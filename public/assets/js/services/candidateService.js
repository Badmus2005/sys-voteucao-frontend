// assets/js/services/candidateService.js
class CandidateService {
    static async getCandidates(electionId = null) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = electionId
                ? CONFIG.API.ENDPOINTS.CANDIDATE.BY_ELECTION(electionId)
                : CONFIG.API.ENDPOINTS.CANDIDATE.LIST;

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.data || response;
        } catch (error) {
            console.error('Erreur lors de la récupération des candidats:', error);
            throw new Error('Impossible de charger les candidats');
        }
    }

    static async submitCandidature(candidatureData) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.CANDIDATE.SUBMIT;

            const response = await fetchWithAuth(`${BASE}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(candidatureData)
            });

            return response;
        } catch (error) {
            console.error('Erreur lors de la soumission de la candidature:', error);
            throw new Error('Échec de la soumission de la candidature');
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

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.data || response;
        } catch (error) {
            console.error('Erreur lors de la récupération du profil candidat:', error);
            throw new Error('Impossible de charger le profil du candidat');
        }
    }

    static async getMyCandidatures() {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.CANDIDATE.MY_CANDIDATURES;

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.data || response;
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
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            return response;
        } catch (error) {
            console.error('Erreur modification candidature:', error);
            throw new Error('Échec de la modification de la candidature');
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
            throw new Error('Échec de la suppression de la candidature');
        }
    }

    static async getCandidatesByElection(electionId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.CANDIDATE.BY_ELECTION(electionId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.data || response;
        } catch (error) {
            console.error('Erreur récupération candidats par élection:', error);
            throw new Error('Impossible de charger les candidats pour cette élection');
        }
    }
}