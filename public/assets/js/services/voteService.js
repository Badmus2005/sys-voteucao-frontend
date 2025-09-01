// assets/js/services/voteService.js
class VoteService {
    static async getVoteToken(electionId) {
        try {
            const response = await fetchWithAuth(CONFIG.API.ENDPOINTS.VOTE.TOKEN(electionId));
            return response.token;
        } catch (error) {
            console.error('Erreur lors de la récupération du token de vote:', error);
            throw error;
        }
    }

    static async submitVote(voteData) {
        try {
            const response = await fetchWithAuth(CONFIG.API.ENDPOINTS.VOTE.SUBMIT, {
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
            const url = electionId ?
                CONFIG.API.ENDPOINTS.VOTE.RESULTS_DETAILED(electionId) :
                CONFIG.API.ENDPOINTS.VOTE.RESULTS;

            return await fetchWithAuth(url);
        } catch (error) {
            console.error('Erreur lors de la récupération des résultats:', error);
            throw error;
        }
    }

    static async getVoteStatus(electionId) {
        try {
            const response = await fetchWithAuth(CONFIG.API.ENDPOINTS.VOTE.STATUS(electionId));
            return response.hasVoted || false;
        } catch (error) {
            console.error('Erreur lors de la vérification du statut de vote:', error);
            return false;
        }
    }

    static async validateToken(electionId, token) {
        try {
            const response = await fetchWithAuth('/api/vote/validate-token', {
                method: 'POST',
                body: JSON.stringify({ electionId, voteToken: token })
            });

            return response.isValid || false;
        } catch (error) {
            console.error('Erreur lors de la validation du token:', error);
            return false;
        }
    }

    // Dans assets/js/services/voteService.js - Ajouter cette méthode
    static async getMyElections() {
        try {
            // Cette endpoint devrait retourner les élections où l'utilisateur peut voter
            const response = await fetchWithAuth('/api/election/my-elections');

            if (response && Array.isArray(response)) {
                return response;
            }

            return [];
        } catch (error) {
            console.error('Erreur récupération élections personnelles:', error);
            return [];
        }
    }

    // Dans assets/js/services/voteService.js - Ajouter cette méthode
    static async getResults(electionId) {
        try {
            const url = electionId ?
                `${CONFIG.API.ENDPOINTS.VOTE.RESULTS_DETAILED}/${electionId}` :
                CONFIG.API.ENDPOINTS.VOTE.RESULTS;

            const response = await fetchWithAuth(url);

            if (response && response.resultats) {
                return response;
            }

            throw new Error('Format de réponse invalide');
        } catch (error) {
            console.error('Erreur récupération résultats:', error);
            throw error;
        }
    }
}