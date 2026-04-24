import { verifyAccessToken } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing token' });
    }

    const token = header.slice('Bearer '.length);
    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, role: payload.role, email: payload.email };
        return next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
}