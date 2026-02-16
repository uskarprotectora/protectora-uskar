const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../models/AdoptionRequest');
const { requireAuth } = require('../middleware/auth');
const upload = require('../config/upload');
const fs = require('fs');
const path = require('path');

// Get all adoption requests (admin)
router.get('/', requireAuth, async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        const requests = await AdoptionRequest.find(query)
            .populate('petId', 'name type breed')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single adoption request (admin)
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const request = await AdoptionRequest.findById(req.params.id)
            .populate('petId', 'name type breed photos');
        if (!request) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new adoption request with optional video
router.post('/', upload.single('presentationVideo'), async (req, res) => {
    try {
        let adoptionData;

        // Check if data comes as JSON string (multipart) or direct JSON
        if (req.body.data) {
            adoptionData = JSON.parse(req.body.data);
        } else {
            adoptionData = req.body;
        }

        // Process uploaded video
        if (req.file) {
            adoptionData.presentationVideo = {
                filename: req.file.filename,
                url: `/uploads/videos/${req.file.filename}`
            };
        }

        const adoptionRequest = new AdoptionRequest(adoptionData);
        const savedRequest = await adoptionRequest.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update adoption request status (admin)
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const request = await AdoptionRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!request) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }
        res.json(request);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete adoption request (admin)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const request = await AdoptionRequest.findByIdAndDelete(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }
        res.json({ message: 'Solicitud eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete multiple adoption requests (admin)
router.post('/bulk-delete', requireAuth, async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Se requiere un array de IDs' });
        }

        const result = await AdoptionRequest.deleteMany({ _id: { $in: ids } });
        res.json({
            message: `${result.deletedCount} solicitud(es) eliminada(s) correctamente`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get stats (admin)
router.get('/stats/summary', requireAuth, async (req, res) => {
    try {
        const total = await AdoptionRequest.countDocuments();
        const pending = await AdoptionRequest.countDocuments({ status: 'pending' });
        const reviewing = await AdoptionRequest.countDocuments({ status: 'reviewing' });
        const approved = await AdoptionRequest.countDocuments({ status: 'approved' });
        const rejected = await AdoptionRequest.countDocuments({ status: 'rejected' });

        res.json({ total, pending, reviewing, approved, rejected });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
