const express = require('express');
const router = express.Router();
const FormSubmission = require('../models/FormSubmission');
const { requireAuth } = require('../middleware/auth');

// Get all form submissions with optional filters (admin)
router.get('/', requireAuth, async (req, res) => {
    try {
        const { formType, status } = req.query;
        let query = {};

        if (formType) {
            query.formType = formType;
        }

        if (status) {
            query.status = status;
        }

        const forms = await FormSubmission.find(query)
            .populate('animalId', 'name type breed')
            .sort({ createdAt: -1 });
        res.json(forms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single form submission (admin)
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const form = await FormSubmission.findById(req.params.id)
            .populate('animalId', 'name type breed photos');
        if (!form) {
            return res.status(404).json({ message: 'Formulario no encontrado' });
        }
        res.json(form);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new form submission
router.post('/', async (req, res) => {
    try {
        const formData = req.body;

        // Normalizar el campo type a formType si viene de algunos formularios
        if (formData.type && !formData.formType) {
            formData.formType = formData.type;
            delete formData.type;
        }

        const form = new FormSubmission(formData);
        const savedForm = await form.save();
        res.status(201).json(savedForm);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update form submission status (admin)
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const form = await FormSubmission.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!form) {
            return res.status(404).json({ message: 'Formulario no encontrado' });
        }
        res.json(form);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete form submission (admin)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const form = await FormSubmission.findByIdAndDelete(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Formulario no encontrado' });
        }
        res.json({ message: 'Formulario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get stats by form type (admin)
router.get('/stats/summary', requireAuth, async (req, res) => {
    try {
        const volunteer = await FormSubmission.countDocuments({ formType: 'volunteer' });
        const foster = await FormSubmission.countDocuments({ formType: 'foster' });
        const sponsorship = await FormSubmission.countDocuments({ formType: 'sponsorship' });
        const contributions = await FormSubmission.countDocuments({ formType: 'invoice_contribution' });

        const pending = await FormSubmission.countDocuments({ status: 'pending' });

        res.json({ volunteer, foster, sponsorship, contributions, pending });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
