import { fetchWithAuth } from '../utils/api.js';
import { CONFIG } from '../config.js';

export async function getUserProfile() {
    const url = `${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.USERS.PROFILE}`;
    return await fetchWithAuth(url);
}

export async function updateUserProfile(data) {
    const url = `${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.USERS.UPDATE}`;
    return await fetchWithAuth(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}
