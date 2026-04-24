import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, signup, refresh, logout, me } from '../controllers/auth_controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { loginSchema, signupSchema } from '../validators/auth.js';

const router = express.Router();

// Tight limit on credential endpoints to slow brute force / credential stuffing.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts, try again later' },
});

router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/signup', authLimiter, validate(signupSchema), signup);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

// NOTE: /check-user removed. It enabled email enumeration.
// Duplicate-email cases are handled server-side during signup.

export default router;