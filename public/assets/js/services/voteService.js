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

    static async getActiveElectionId() {
        // 1. Vérifie l’URL
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get('electionId');
        if (fromQuery) return fromQuery;

        // 2. Vérifie sessionStorage
        const fromSession = sessionStorage.getItem('electionId');
        if (fromSession) return fromSession;

        // 3. Appelle le backend (si endpoint disponible)
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = '/api/election/active';
            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            if (response?.id) {
                sessionStorage.setItem('electionId', response.id);
                return response.id;
            }
        } catch (_) {
            // Silencieux si aucune élection active
        }

        return null;
    }

    static async getResults(electionId = null) {
        try {
            const id = electionId || await this.getActiveElectionId();
            if (!id) throw new Error('Aucune élection active détectée');

            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.VOTE.RESULTS_DETAILED(id);
            const response = await fetchWithAuth(`${BASE}${endpoint}`);

            if (response?.resultats) return response;
            throw new Error('Format de réponse invalide');
        } catch (error) {
            console.error('Erreur récupération résultats:', error);
            throw error;
        }
    }

    /* static async getResults(electionId = null) {
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
     }*/

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

            // Vérifier si la réponse est OK
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Erreur serveur'}`);
            }

            const data = await response.json();

            // Vérification plus robuste
            if (data && Array.isArray(data)) {
                return data;
            } else if (data && data.message) {
                // Gérer les messages d'erreur du backend
                throw new Error(data.message);
            } else {
                return [];
            }

        } catch (error) {
            console.error('Erreur récupération élections personnelles:', error);
            throw error; // Propager l'erreur pour une meilleure gestion
        }
    }
}
