const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const upload = require('../config/upload');
const fs = require('fs');
const path = require('path');

// Get all pets with optional filters
router.get('/', async (req, res) => {
    try {
        const { type, status, search } = req.query;
        let query = {};

        if (type && type !== 'all') {
            query.type = type;
        }

        if (status) {
            query.status = status;
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
        const total = await Pet.countDocuments();
        const dogs = await Pet.countDocuments({ type: 'dog' });
        const cats = await Pet.countDocuments({ type: 'cat' });

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

// Create new pet with file uploads
router.post('/', upload.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
]), async (req, res) => {
    try {
        const petData = JSON.parse(req.body.data || '{}');

        // Process uploaded photos
        if (req.files && req.files.photos) {
            petData.photos = req.files.photos.map((file, index) => ({
                filename: file.filename,
                url: `/uploads/photos/${file.filename}`,
                isMain: index === 0 // First photo is main by default
            }));
        }

        // Process uploaded videos
        if (req.files && req.files.videos) {
            petData.videos = req.files.videos.map(file => ({
                filename: file.filename,
                url: `/uploads/videos/${file.filename}`
            }));
        }

        const pet = new Pet(petData);
        const savedPet = await pet.save();
        res.status(201).json(savedPet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update pet
router.put('/:id', upload.fields([
    { name: 'photos', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
]), async (req, res) => {
    try {
        const petData = JSON.parse(req.body.data || '{}');
        const existingPet = await Pet.findById(req.params.id);

        if (!existingPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Keep existing photos unless new ones are uploaded
        if (req.files && req.files.photos && req.files.photos.length > 0) {
            const newPhotos = req.files.photos.map((file, index) => ({
                filename: file.filename,
                url: `/uploads/photos/${file.filename}`,
                isMain: false
            }));

            // Merge with existing photos
            petData.photos = [...(existingPet.photos || []), ...newPhotos];
        } else if (!petData.photos) {
            petData.photos = existingPet.photos;
        }

        // Keep existing videos unless new ones are uploaded
        if (req.files && req.files.videos && req.files.videos.length > 0) {
            const newVideos = req.files.videos.map(file => ({
                filename: file.filename,
                url: `/uploads/videos/${file.filename}`
            }));

            petData.videos = [...(existingPet.videos || []), ...newVideos];
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
router.delete('/:id/photo/:photoIndex', async (req, res) => {
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
router.delete('/:id/video/:videoIndex', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
