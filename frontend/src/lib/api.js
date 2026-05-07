// Single source of truth for all API calls.
// - Attaches Bearer token from memory (never localStorage).
// - On 401, tries /auth/refresh exactly once, then replays the request.
// - Throws on non-2xx with a parsed error body.

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

let accessToken = null;
let refreshPromise = null;

export function setAccessToken(token) {
    accessToken = token;
}
export function getAccessToken() {
    return accessToken;
}

async function tryRefresh() {
    // De-dupe concurrent refresh calls.
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!res.ok) {
            accessToken = null;
            return null;
        }
        const data = await res.json();
        accessToken = data.accessToken;
        return data;
    })().finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
}

async function doFetch(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
    const init = {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
            ...(auth && accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        ...(body !== undefined && { body: JSON.stringify(body) }),
    };

    let res = await fetch(`${BASE_URL}${path}`, init);

    // One retry after refresh if access token expired.
    if (res.status === 401 && auth) {
        const refreshed = await tryRefresh();
        if (refreshed) {
            init.headers.Authorization = `Bearer ${accessToken}`;
            res = await fetch(`${BASE_URL}${path}`, init);
        }
    }

    if (res.status === 204) return null;

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(data.message || `HTTP ${res.status}`);
        err.status = res.status;
        err.errors = data.errors;
        throw err;
    }
    return data;
}

export const api = {
    get: (path, opts) => doFetch(path, { ...opts, method: 'GET' }),
    post: (path, body, opts) => doFetch(path, { ...opts, method: 'POST', body }),
    patch: (path, body, opts) => doFetch(path, { ...opts, method: 'PATCH', body }),
    delete: (path, opts) => doFetch(path, { ...opts, method: 'DELETE' }),
};

export { tryRefresh };