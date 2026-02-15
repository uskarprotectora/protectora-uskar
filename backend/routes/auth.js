const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const Admin = require('../models/Admin');
const { requireAuth, JWT_SECRET, JWT_EXPIRY } = require('../middleware/auth');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        message: 'Demasiados intentos de inicio de sesion. Intente de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.ip || req.headers['x-forwarded-for'] || 'unknown';
    }
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'Usuario y contrasena son requeridos.'
            });
        }

        const admin = await Admin.findOne({ username: username.toLowerCase() });

        if (!admin) {
            return res.status(401).json({
                message: 'Usuario o contrasena incorrectos.'
            });
        }

        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Usuario o contrasena incorrectos.'
            });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate JWT
        const token = jwt.sign(
            {
                adminId: admin._id,
                username: admin.username
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        // Calculate expiry time for frontend
        let expiresIn;
        if (JWT_EXPIRY.endsWith('h')) {
            expiresIn = parseInt(JWT_EXPIRY) * 60 * 60 * 1000;
        } else if (JWT_EXPIRY.endsWith('d')) {
            expiresIn = parseInt(JWT_EXPIRY) * 24 * 60 * 60 * 1000;
        } else {
            expiresIn = parseInt(JWT_EXPIRY) * 1000;
        }

        res.json({
            token,
            expiresAt: Date.now() + expiresIn,
            admin: {
                id: admin._id,
                username: admin.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error al iniciar sesion.' });
    }
});

// GET /api/auth/verify
router.get('/verify', requireAuth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-password');

        if (!admin) {
            return res.status(401).json({
                message: 'Administrador no encontrado.'
            });
        }

        res.json({
            valid: true,
            admin: {
                id: admin._id,
                username: admin.username
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error de verificacion.' });
    }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req, res) => {
    res.json({ message: 'Sesion cerrada correctamente.' });
});

module.exports = router;
