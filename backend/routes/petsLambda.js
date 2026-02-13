const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { S3Client, DeleteObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'eu-west-1'
});
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'protectora-uskar-uploads';

// Get all pets with optional filters
router.get('/', async (req, res) => {
    try {
        const { type, status, search } = req.query;
        let query = {};

        if (type && type !== 'all') {
            query.type = type;
        }

        if (status) {
            // Soportar múltiples estados separados por coma (ej: "active,scheduled")
            if (status.includes(',')) {
                query.status = { $in: status.split(',') };
            } else {
                query.status = status;
            }
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { breed: { $regex: search, $options: 'i' } },
                { 'owner.name': { $regex: search, $options: 'i' } }
            ];
        }

        const pets = await Pet.find(query).sort({ createdAt: -1 });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get stats
router.get('/stats', async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        // Si se especifica un estado, filtrar por él
        if (status) {
            query.status = status;
        }

        const total = await Pet.countDocuments(query);
        const dogs = await Pet.countDocuments({ ...query, type: 'dog' });
        const cats = await Pet.countDocuments({ ...query, type: 'cat' });

        res.json({ total, dogs, cats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single pet
router.get('/:id', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(pet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Generate presigned URLs for direct S3 upload from browser
router.post('/presign', async (req, res) => {
    try {
        const { files } = req.body;
        const urls = await Promise.all(files.map(async (file) => {
            const folder = file.type.startsWith('image/') ? 'photos' : 'videos';
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.name);
            const key = `uploads/${folder}/${uniqueSuffix}${ext}`;

            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
                ContentType: file.type,
            });

            const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
            const publicUrl = `https://${BUCKET_NAME}.s3.eu-west-1.amazonaws.com/${key}`;

            return { uploadUrl, publicUrl, key };
        }));

        res.json(urls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new pet
router.post('/', async (req, res) => {
    try {
        const petData = req.body;

        // Process photos from presigned upload
        if (petData.newPhotos) {
            petData.photos = petData.newPhotos.map((photo, index) => ({
                filename: photo.filename,
                url: photo.url,
                isMain: index === 0
            }));
            delete petData.newPhotos;
        }

        // Process videos from presigned upload
        if (petData.newVideos) {
            petData.videos = petData.newVideos.map(video => ({
                filename: video.filename,
                url: video.url
            }));
            delete petData.newVideos;
        }

        const pet = new Pet(petData);
        const savedPet = await pet.save();
        res.status(201).json(savedPet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update pet
router.put('/:id', async (req, res) => {
    try {
        const petData = req.body;
        const existingPet = await Pet.findById(req.params.id);

        if (!existingPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Process new photos from presigned upload
        if (petData.newPhotos && petData.newPhotos.length > 0) {
            const newPhotos = petData.newPhotos.map(photo => ({
                filename: photo.filename,
                url: photo.url,
                isMain: false
            }));
            petData.photos = [...(existingPet.photos || []), ...newPhotos];
            delete petData.newPhotos;
        } else if (!petData.photos) {
            petData.photos = existingPet.photos;
        }

        // Process new videos from presigned upload
        if (petData.newVideos && petData.newVideos.length > 0) {
            const newVideos = petData.newVideos.map(video => ({
                filename: video.filename,
                url: video.url
            }));
            petData.videos = [...(existingPet.videos || []), ...newVideos];
            delete petData.newVideos;
        } else if (!petData.videos) {
            petData.videos = existingPet.videos;
        }

        const pet = await Pet.findByIdAndUpdate(
            req.params.id,
            petData,
            { new: true, runValidators: true }
        );

        res.json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Set main photo
router.put('/:id/main-photo/:photoIndex', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const photoIndex = parseInt(req.params.photoIndex);
        pet.photos.forEach((photo, index) => {
            photo.isMain = index === photoIndex;
        });

        await pet.save();
        res.json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Helper function to delete from S3
async function deleteFromS3(key) {
    try {
        await s3Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key
        }));
    } catch (error) {
        console.error('Error deleting from S3:', error);
    }
}

// Delete photo
router.delete('/:id/photo/:photoIndex', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const photoIndex = parseInt(req.params.photoIndex);
        const photo = pet.photos[photoIndex];

        if (photo) {
            // Delete from S3
            await deleteFromS3(photo.filename);

            pet.photos.splice(photoIndex, 1);

            if (photo.isMain && pet.photos.length > 0) {
                pet.photos[0].isMain = true;
            }

            await pet.save();
        }

        res.json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete video
router.delete('/:id/video/:videoIndex', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const videoIndex = parseInt(req.params.videoIndex);
        const video = pet.videos[videoIndex];

        if (video) {
            await deleteFromS3(video.filename);
            pet.videos.splice(videoIndex, 1);
            await pet.save();
        }

        res.json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete pet
router.delete('/:id', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Delete all photos from S3
        if (pet.photos) {
            for (const photo of pet.photos) {
                await deleteFromS3(photo.filename);
            }
        }

        // Delete all videos from S3
        if (pet.videos) {
            for (const video of pet.videos) {
                await deleteFromS3(video.filename);
            }
        }

        await Pet.findByIdAndDelete(req.params.id);
        res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
