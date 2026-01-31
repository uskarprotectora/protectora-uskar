const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../models/AdoptionRequest');
const upload = require('../config/uploadS3');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'eu-west-1'
});
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'protectora-uskar-uploads';

// Get all adoption requests (admin)
router.get('/', async (req, res) => {
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

// Get single adoption request
router.get('/:id', async (req, res) => {
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

// Create new adoption request with optional video upload to S3
router.post('/', upload.single('presentationVideo'), async (req, res) => {
    try {
        let adoptionData;

        if (req.body.data) {
            adoptionData = JSON.parse(req.body.data);
        } else {
            adoptionData = req.body;
        }

        // Process uploaded video from S3
        if (req.file) {
            adoptionData.presentationVideo = {
                filename: req.file.key,
                url: req.file.location
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
router.put('/:id', async (req, res) => {
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

// Delete adoption request
router.delete('/:id', async (req, res) => {
    try {
        const request = await AdoptionRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        // Delete video from S3 if exists
        if (request.presentationVideo && request.presentationVideo.filename) {
            try {
                await s3Client.send(new DeleteObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: request.presentationVideo.filename
                }));
            } catch (err) {
                console.error('Error deleting video from S3:', err);
            }
        }

        await AdoptionRequest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Solicitud eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get stats
router.get('/stats/summary', async (req, res) => {
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
