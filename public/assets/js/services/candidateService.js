// assets/js/services/candidateService.js
class CandidateService {
    static async getCandidates(electionId = null) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = electionId
                ? CONFIG.API.ENDPOINTS.CANDIDATE.BY_ELECTION(electionId)
                : CONFIG.API.ENDPOINTS.CANDIDATE.LIST;

            return await fetchWithAuth(`${BASE}${endpoint}`);
        } catch (error) {
            console.error('Erreur lors de la récupération des candidats:', error);
            throw error;
        }
    }

    static async submitCandidature(candidatureData) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.CANDIDATE.SUBMIT;

            const response = await fetchWithAuth(`${BASE}${endpoint}`, {
                method: 'POST',
                body: JSON.stringify(candidatureData)
            });

            return response;
        } catch (error) {
            console.error('Erreur lors de la soumission de la candidature:', error);
            throw error;
        }
    }

    static async isCandidate(electionId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.CANDIDATE.IS_CANDIDATE(electionId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.isCandidate || false;
        } catch (error) {
            console.error('Erreur lors de la vérification de candidature:', error);
            return false;
        }
    }

    static async getCandidateProfile(candidateId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.CANDIDATE.PROFILE(candidateId);

            return await fetchWithAuth(`${BASE}${endpoint}`);
        } catch (error) {
            console.error('Erreur lors de la récupération du profil candidat:', error);
            throw error;
        }
    }

    static async getMyCandidatures() {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.CANDIDATE.MY_CANDIDATURES;

            const response = await fetchWithAuth(`${BASE}${endpoint}`);

            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error('Erreur récupération candidatures:', error);
            return [];
        }
    }

    static async updateCandidature(candidatureId, data) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.CANDIDATE.UPDATE(candidatureId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });

            return response;
        } catch (error) {
            console.error('Erreur modification candidature:', error);
            throw error;
        }
    }

    static async deleteCandidature(candidatureId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.CANDIDATE.DELETE(candidatureId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`, {
                method: 'DELETE'
            });

            return response;
        } catch (error) {
            console.error('Erreur suppression candidature:', error);
            throw error;
        }
    }
}
