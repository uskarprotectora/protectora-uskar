const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const upload = require('../config/upload');
const { requireAuth } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// Get all pets with optional filters
router.get('/', async (req, res) => {
    try {
        const { type, status, search, ageRange } = req.query;
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

        // Filtro por rango de edad
        if (ageRange && ageRange !== 'all') {
            const now = new Date();
            let minDate, maxDate;

            switch (ageRange) {
                case 'puppy': // 0-1 año
                    minDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    maxDate = now;
                    break;
                case 'young': // 1-3 años
                    minDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
                    maxDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    break;
                case 'adult': // 3-7 años
                    minDate = new Date(now.getFullYear() - 7, now.getMonth(), now.getDate());
                    maxDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
                    break;
                case 'senior': // 7+ años
                    maxDate = new Date(now.getFullYear() - 7, now.getMonth(), now.getDate());
                    break;
            }

            if (minDate && maxDate) {
                query.birthDate = { $gte: minDate, $lt: maxDate };
            } else if (maxDate && !minDate) {
                query.birthDate = { $lt: maxDate };
            }
        }

        const pets = await Pet.find(query).sort({ urgent: -1, displayOrder: 1, createdAt: -1 });
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

// Generate presigned URLs for local development (simulates S3 presign)
// In local mode, we return local URLs that will work with the upload endpoint
router.post('/presign', requireAuth, async (req, res) => {
    try {
        const { files } = req.body;
        const urls = files.map((file) => {
            const folder = file.type.startsWith('image/') ? 'photos' : 'videos';
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.name);
            const filename = `${uniqueSuffix}${ext}`;

            // For local development, the upload URL is the local server
            // and the public URL is the local path
            return {
                uploadUrl: `/uploads/${folder}/${filename}`,
                publicUrl: `/uploads/${folder}/${filename}`,
                key: filename
            };
        });

        res.json(urls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reorder pets
router.put('/reorder', requireAuth, async (req, res) => {
    try {
        const { petId, direction } = req.body;

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Obtener todos los pets con el mismo status ordenados
        const allPets = await Pet.find({ status: pet.status }).sort({ urgent: -1, displayOrder: 1, createdAt: -1 });
        const currentIndex = allPets.findIndex(p => p._id.toString() === petId);

        if (currentIndex === -1) {
            return res.status(404).json({ message: 'Pet not found in list' });
        }

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= allPets.length) {
            return res.status(400).json({ message: 'Cannot move further in that direction' });
        }

        // Intercambiar displayOrder con el vecino
        const targetPet = allPets[targetIndex];
        const tempOrder = pet.displayOrder;

        // Si ambos tienen el mismo displayOrder, asignar valores únicos
        if (pet.displayOrder === targetPet.displayOrder) {
            pet.displayOrder = direction === 'up' ? targetPet.displayOrder - 1 : targetPet.displayOrder + 1;
        } else {
            pet.displayOrder = targetPet.displayOrder;
            targetPet.displayOrder = tempOrder;
        }

        await pet.save();
        await targetPet.save();

        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new pet with file uploads or JSON data
router.post('/', requireAuth, upload.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
]), async (req, res) => {
    try {
        // Support both multipart form data and JSON body
        let petData;
        if (req.body.data) {
            petData = JSON.parse(req.body.data);
        } else if (typeof req.body === 'object' && !req.files) {
            petData = req.body;
        } else {
            petData = {};
        }

        // Process uploaded photos (multipart)
        if (req.files && req.files.photos) {
            petData.photos = req.files.photos.map((file, index) => ({
                filename: file.filename,
                url: `/uploads/photos/${file.filename}`,
                isMain: index === 0
            }));
        }

        // Process photos from presigned S3 upload (JSON)
        if (petData.newPhotos && petData.newPhotos.length > 0) {
            petData.photos = petData.newPhotos.map((photo, index) => ({
                filename: photo.filename,
                url: photo.url,
                isMain: index === 0
            }));
            delete petData.newPhotos;
        }

        // Process uploaded videos (multipart)
        if (req.files && req.files.videos) {
            petData.videos = req.files.videos.map(file => ({
                filename: file.filename,
                url: `/uploads/videos/${file.filename}`
            }));
        }

        // Process videos from presigned S3 upload (JSON)
        if (petData.newVideos && petData.newVideos.length > 0) {
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
router.put('/:id', requireAuth, upload.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
]), async (req, res) => {
    try {
        // Support both multipart form data and JSON body
        let petData;
        if (req.body.data) {
            petData = JSON.parse(req.body.data);
        } else if (typeof req.body === 'object' && !req.files) {
            petData = req.body;
        } else {
            petData = {};
        }

        const existingPet = await Pet.findById(req.params.id);

        if (!existingPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Keep existing photos unless new ones are uploaded (multipart)
        if (req.files && req.files.photos && req.files.photos.length > 0) {
            const newPhotos = req.files.photos.map((file, index) => ({
                filename: file.filename,
                url: `/uploads/photos/${file.filename}`,
                isMain: false
            }));
            petData.photos = [...(existingPet.photos || []), ...newPhotos];
        }

        // Process new photos from presigned S3 upload (JSON)
        if (petData.newPhotos && petData.newPhotos.length > 0) {
            const newPhotos = petData.newPhotos.map(photo => ({
                filename: photo.filename,
                url: photo.url,
                isMain: false
            }));
            petData.photos = [...(existingPet.photos || []), ...newPhotos];
            delete petData.newPhotos;
        }

        if (!petData.photos) {
            petData.photos = existingPet.photos;
        }

        // Keep existing videos unless new ones are uploaded (multipart)
        if (req.files && req.files.videos && req.files.videos.length > 0) {
            const newVideos = req.files.videos.map(file => ({
                filename: file.filename,
                url: `/uploads/videos/${file.filename}`
            }));
            petData.videos = [...(existingPet.videos || []), ...newVideos];
        }

        // Process new videos from presigned S3 upload (JSON)
        if (petData.newVideos && petData.newVideos.length > 0) {
            const newVideos = petData.newVideos.map(video => ({
                filename: video.filename,
                url: video.url
            }));
            petData.videos = [...(existingPet.videos || []), ...newVideos];
            delete petData.newVideos;
        }

        if (!petData.videos) {
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
router.put('/:id/main-photo/:photoIndex', requireAuth, async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const photoIndex = parseInt(req.params.photoIndex);

        // Reset all photos to not main
        pet.photos.forEach((photo, index) => {
            photo.isMain = index === photoIndex;
        });

        await pet.save();
        res.json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete photo
router.delete('/:id/photo/:photoIndex', requireAuth, async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const photoIndex = parseInt(req.params.photoIndex);
        const photo = pet.photos[photoIndex];

        if (photo) {
            // Delete file from disk
            const filePath = path.join(__dirname, '../uploads/photos', photo.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Remove from array
            pet.photos.splice(photoIndex, 1);

            // If deleted photo was main, set first photo as main
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
router.delete('/:id/video/:videoIndex', requireAuth, async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const videoIndex = parseInt(req.params.videoIndex);
        const video = pet.videos[videoIndex];

        if (video) {
            // Delete file from disk
            const filePath = path.join(__dirname, '../uploads/videos', video.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            pet.videos.splice(videoIndex, 1);
            await pet.save();
        }

        res.json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete pet
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Delete all associated photos
        if (pet.photos) {
            pet.photos.forEach(photo => {
                const filePath = path.join(__dirname, '../uploads/photos', photo.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        // Delete all associated videos
        if (pet.videos) {
            pet.videos.forEach(video => {
                const filePath = path.join(__dirname, '../uploads/videos', video.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        await Pet.findByIdAndDelete(req.params.id);
        res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
