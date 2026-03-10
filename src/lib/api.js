import axios from 'axios';

// In production (Vercel), API is served from the same domain under /api
// In development, Vite proxy handles /api → localhost:5000
const baseURL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

const api = axios.create({
    baseURL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('maitri_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('maitri_token');
            localStorage.removeItem('maitri_user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default api;
