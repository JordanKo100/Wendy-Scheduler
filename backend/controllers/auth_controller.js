import bcrypt from 'bcrypt';
import db from '../config/db_mysql.js';
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    refreshCookieOptions,
    REFRESH_COOKIE_NAME,
} from '../utils/jwt.js';

const BCRYPT_COST = 12;

function buildTokens(user) {
    const payload = { sub: user.id, role: user.role, email: user.email };
    return {
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload),
    };
}

function publicUser(row) {
    return {
        id: row.id,
        username: row.username,
        email: row.email,
        phone: row.phone,
        role: row.role,
    };
}

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const [rows] = await db.execute(
            'SELECT id, username, email, phone, password, role FROM users WHERE email = ? LIMIT 1',
            [email],
        );

        // Always run bcrypt compare even on miss — prevents timing-based user enumeration.
        const userRow = rows[0];
        const hash = userRow?.password ?? '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi';
        const ok = await bcrypt.compare(password, hash);

        if (!userRow || !ok) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = publicUser(userRow);
        const { accessToken, refreshToken } = buildTokens(user);

        res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
        return res.status(200).json({ user, accessToken });
    } catch (err) {
        console.error('login error:', err);
        return res.status(500).json({ message: 'Internal error' });
    }
}

export async function signup(req, res) {
    const { firstName, lastName, email, phone, password } = req.body;
    const username = `${firstName} ${lastName}`.trim();

    try {
        const hash = await bcrypt.hash(password, BCRYPT_COST);

        const [result] = await db.execute(
            `INSERT INTO users (username, email, phone, password, role)
             VALUES (?, ?, ?, ?, 'customer')`,
            [username, email, phone, hash],
        );

        const user = {
            id: result.insertId,
            username,
            email,
            phone,
            role: 'customer',
        };

        const { accessToken, refreshToken } = buildTokens(user);
        res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
        return res.status(201).json({ user, accessToken });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            // Generic message — don't confirm whether email exists.
            return res.status(409).json({ message: 'Could not create account' });
        }
        console.error('signup error:', err);
        return res.status(500).json({ message: 'Internal error' });
    }
}

export async function refresh(req, res) {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    try {
        const payload = verifyRefreshToken(token);
        // Re-fetch user so role changes/disabled accounts take effect.
        const [rows] = await db.execute(
            'SELECT id, username, email, phone, role FROM users WHERE id = ? LIMIT 1',
            [payload.sub],
        );
        if (!rows[0]) return res.status(401).json({ message: 'User not found' });

        const user = publicUser(rows[0]);
        const { accessToken, refreshToken } = buildTokens(user);

        // Rotate refresh token
        res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
        return res.status(200).json({ user, accessToken });
    } catch {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
}

export async function logout(_req, res) {
    res.clearCookie(REFRESH_COOKIE_NAME, { ...refreshCookieOptions, maxAge: undefined });
    return res.status(204).end();
}

// Returns the current user from their access token.
// Replaces the old /check-user endpoint which leaked email existence.
export async function me(req, res) {
    try {
        const [rows] = await db.execute(
            'SELECT id, username, email, phone, role FROM users WHERE id = ? LIMIT 1',
            [req.user.id],
        );
        if (!rows[0]) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json({ user: publicUser(rows[0]) });
    } catch (err) {
        console.error('me error:', err);
        return res.status(500).json({ message: 'Internal error' });
    }
}