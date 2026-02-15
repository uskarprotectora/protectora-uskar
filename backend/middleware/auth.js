const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

// Verify JWT token middleware
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Acceso no autorizado. Token requerido.'
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Acceso no autorizado. Token no proporcionado.'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.adminId = decoded.adminId;
        req.adminUsername = decoded.username;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Sesion expirada. Por favor, inicie sesion nuevamente.'
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Token invalido.'
            });
        }
        return res.status(500).json({
            message: 'Error de autenticacion.'
        });
    }
};

// Optional auth - attach admin info if token valid, but don't fail
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.adminId = decoded.adminId;
            req.adminUsername = decoded.username;
            req.isAuthenticated = true;
        } else {
            req.isAuthenticated = false;
        }
    } catch (error) {
        req.isAuthenticated = false;
    }
    next();
};

module.exports = { requireAuth, optionalAuth, JWT_SECRET, JWT_EXPIRY };
