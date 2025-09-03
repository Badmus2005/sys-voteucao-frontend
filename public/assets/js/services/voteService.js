// assets/js/services/voteService.js
class VoteService {
    static async getVoteToken(electionId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.VOTE.TOKEN(electionId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.data?.token || response.token;
        } catch (error) {
            console.error('Erreur récupération token de vote:', error);
            throw new Error('Impossible de récupérer le token de vote');
        }
    }

    static async submitVote(voteData) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.VOTE.SUBMIT;

            const response = await fetchWithAuth(`${BASE}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(voteData)
            });

            return response;
        } catch (error) {
            console.error('Erreur soumission du vote:', error);
            throw new Error('Échec de la soumission du vote');
        }
    }

    static async getActiveElectionId() {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.ELECTION.ACTIVE;

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            const electionId = response.data?.id || response.id;

            if (electionId) {
                sessionStorage.setItem('activeElectionId', electionId);
                return electionId;
            }

            return null;
        } catch (error) {
            console.debug('Aucune élection active:', error.message);
            return null;
        }
    }

    static async getResults(electionId = null) {
        try {
            let targetElectionId = electionId;

            if (!targetElectionId) {
                targetElectionId = await this.getActiveElectionId();
            }

            if (!targetElectionId) {
                throw new Error('Aucune élection spécifiée ou active');
            }

            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.VOTE.RESULTS_DETAILED(targetElectionId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.data || response;
        } catch (error) {
            console.error('Erreur récupération résultats:', error);
            throw new Error('Impossible de charger les résultats');
        }
    }

    static async getVoteStatus(electionId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.VOTE.STATUS(electionId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.data?.hasVoted || response.hasVoted || false;
        } catch (error) {
            console.error('Erreur vérification statut vote:', error);
            return false;
        }
    }

    static async validateToken(electionId, token) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.VOTE.VALIDATE_TOKEN;

            const response = await fetchWithAuth(`${BASE}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    electionId,
                    voteToken: token
                })
            });

            return response.data?.isValid || response.isValid || false;
        } catch (error) {
            console.error('Erreur validation token:', error);
            return false;
        }
    }

    static async getElectionDetails(electionId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.ELECTION.DETAILS(electionId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.data || response;
        } catch (error) {
            console.error('Erreur récupération détails élection:', error);
            throw new Error('Impossible de charger les détails de l\'élection');
        }
    }

    static async hasVoted(electionId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.VOTE.STATUS(electionId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.data?.hasVoted || response.hasVoted || false;
        } catch (error) {
            console.error('Erreur vérification vote:', error);
            return false;
        }
    }

    static clearActiveElection() {
        sessionStorage.removeItem('activeElectionId');
    }
}