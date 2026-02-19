import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Handle 401 (Optional Redirect)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Check if not already on login/signup to avoid loops
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const getZones = async () => {
    const response = await api.get('/zones');
    return response.data;
};

export const createZone = async (name) => {
    const response = await api.post('/zones', { name });
    return response.data;
};

export const deleteZone = async (id) => {
    const response = await api.delete(`/zones/${id}`);
    return response.data;
};

export const getZoneDetails = async (id, includeRecords = true) => {
    const response = await api.get(`/zones/${id}?rrsets=${includeRecords}`);
    return response.data;
};

export const getZoneRecords = async (id, query = '', max = 100) => {
    const response = await api.get(`/zones/${id}/records`, {
        params: { q: query, max }
    });
    return response.data;
};

export const addRecord = async (zoneId, recordData) => {
    // recordData = { type, name, content, ttl }
    const response = await api.post(`/zones/${zoneId}/records`, recordData);
    return response.data;
};

export const deleteRecord = async (zoneId, recordName, recordType) => {
    const response = await api.delete(`/zones/${zoneId}/records`, {
        data: { name: recordName, type: recordType }
    });
    return response.data;
};

export const verifyZone = async (id) => {
    const response = await api.post(`/zones/${id}/verify`);
    return response.data;
};

export const exportZone = async (id, zoneName) => {
    const response = await api.get(`/zones/${id}/export`, {
        responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${zoneName}.zone`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

// Public Stats
export const getLiveStats = async () => {
    const response = await api.get('/public/stats');
    return response.data;
};

export default api;
