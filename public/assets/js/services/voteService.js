// assets/js/services/voteService.js
class VoteService {
    static async getVoteToken(electionId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.VOTE.TOKEN(electionId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.token;
        } catch (error) {
            console.error('Erreur lors de la récupération du token de vote:', error);
            throw error;
        }
    }

    static async submitVote(voteData) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.VOTE.SUBMIT;

            const response = await fetchWithAuth(`${BASE}${endpoint}`, {
                method: 'POST',
                body: JSON.stringify(voteData)
            });

            return response;
        } catch (error) {
            console.error('Erreur lors de la soumission du vote:', error);
            throw error;
        }
    }

    static async getResults(electionId = null) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = electionId
                ? CONFIG.API.ENDPOINTS.VOTE.RESULTS_DETAILED(electionId)
                : CONFIG.API.ENDPOINTS.VOTE.RESULTS;

            const response = await fetchWithAuth(`${BASE}${endpoint}`);

            if (response && response.resultats) {
                return response;
            }

            throw new Error('Format de réponse invalide');
        } catch (error) {
            console.error('Erreur récupération résultats:', error);
            throw error;
        }
    }

    static async getVoteStatus(electionId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.VOTE.STATUS(electionId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.hasVoted || false;
        } catch (error) {
            console.error('Erreur lors de la vérification du statut de vote:', error);
            return false;
        }
    }

    static async validateToken(electionId, token) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.VOTE.VALIDATE_TOKEN;

            const response = await fetchWithAuth(`${BASE}${endpoint}`, {
                method: 'POST',
                body: JSON.stringify({ electionId, voteToken: token })
            });

            return response.isValid || false;
        } catch (error) {
            console.error('Erreur lors de la validation du token:', error);
            return false;
        }
    }

    static async getMyElections() {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.ELECTION.MY_ELECTIONS;

            const response = await fetchWithAuth(`${BASE}${endpoint}`);

            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error('Erreur récupération élections personnelles:', error);
            return [];
        }
    }
}
