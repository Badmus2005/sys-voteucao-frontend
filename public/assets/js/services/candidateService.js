// assets/js/services/candidateService.js
class CandidateService {
    static async getCandidates(electionId = null) {
        try {
            const url = electionId ?
                CONFIG.API.ENDPOINTS.CANDIDATE.BY_ELECTION(electionId) :
                CONFIG.API.ENDPOINTS.CANDIDATE.LIST;

            return await fetchWithAuth(url);
        } catch (error) {
            console.error('Erreur lors de la récupération des candidats:', error);
            throw error;
        }
    }

    static async submitCandidature(candidatureData) {
        try {
            const response = await fetchWithAuth(CONFIG.API.ENDPOINTS.CANDIDATE.SUBMIT, {
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
            const response = await fetchWithAuth(CONFIG.API.ENDPOINTS.CANDIDATE.IS_CANDIDATE(electionId));
            return response.isCandidate || false;
        } catch (error) {
            console.error('Erreur lors de la vérification de candidature:', error);
            return false;
        }
    }

    static async getCandidateProfile(candidateId) {
        try {
            // Cette endpoint devra être créé côté backend
            return await fetchWithAuth(`/api/candidats/${candidateId}`);
        } catch (error) {
            console.error('Erreur lors de la récupération du profil candidat:', error);
            throw error;
        }
    }

    // Dans assets/js/services/candidateService.js - Ajouter ces méthodes
    static async getMyCandidatures() {
        try {
            // Cette endpoint devra être créé côté backend
            const response = await fetchWithAuth('/api/candidats/mes-candidatures');

            if (response && Array.isArray(response)) {
                return response;
            }

            return [];
        } catch (error) {
            console.error('Erreur récupération candidatures:', error);
            return [];
        }
    }

    static async updateCandidature(candidatureId, data) {
        try {
            const response = await fetchWithAuth(`/api/candidats/${candidatureId}`, {
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
            const response = await fetchWithAuth(`/api/candidats/${candidatureId}`, {
                method: 'DELETE'
            });

            return response;
        } catch (error) {
            console.error('Erreur suppression candidature:', error);
            throw error;
        }
    }
}