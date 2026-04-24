import jwt from 'jsonwebtoken';
import { config, isProd } from '../config/index.js';

export function signAccessToken(payload) {
    return jwt.sign(payload, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessTtl,
    });
}

export function signRefreshToken(payload) {
    return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshTtl,
    });
}

export function verifyAccessToken(token) {
    return jwt.verify(token, config.jwt.accessSecret);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, config.jwt.refreshSecret);
}

// Refresh cookie options — httpOnly so JS can't touch it.
export const refreshCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    path: '/api/auth', // only sent to auth endpoints
    domain: config.cookie.domain,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d, keep in sync with JWT_REFRESH_TTL
};

export const REFRESH_COOKIE_NAME = 'rt';