import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setAccessToken, tryRefresh } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, try to silently restore session via refresh cookie.
    useEffect(() => {
        (async () => {
            const refreshed = await tryRefresh();
            if (refreshed) setUser(refreshed.user);
            setLoading(false);
        })();
    }, []);

    const login = useCallback(async (email, password) => {
        const { user: u, accessToken } = await api.post(
            '/auth/login',
            { email, password },
            { auth: false },
        );
        setAccessToken(accessToken);
        setUser(u);
        return u;
    }, []);

    const signup = useCallback(async (payload) => {
        const { user: u, accessToken } = await api.post('/auth/signup', payload, {
            auth: false,
        });
        setAccessToken(accessToken);
        setUser(u);
        return u;
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout', {}, { auth: false });
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}