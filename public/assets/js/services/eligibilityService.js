// assets/js/services/eligibilityService.js
class EligibilityService {
    static async checkEligibility(electionId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.ELIGIBILITY.CHECK(electionId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.data || response;
        } catch (error) {
            console.error('Erreur vérification éligibilité:', error);
            return {
                eligible: false,
                message: 'Impossible de vérifier l\'éligibilité'
            };
        }
    }

    static async canCandidate(electionId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.ELIGIBILITY.CAN_CANDIDATE(electionId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.canCandidate || false;
        } catch (error) {
            console.error('Erreur vérification candidature:', error);
            return false;
        }
    }

    static async canVote(electionId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.ELIGIBILITY.CAN_VOTE(electionId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.canVote || false;
        } catch (error) {
            console.error('Erreur vérification vote:', error);
            return false;
        }
    }

    static async getEligibilityRequirements(electionId) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.ELIGIBILITY.REQUIREMENTS(electionId);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.data || response;
        } catch (error) {
            console.error('Erreur récupération conditions éligibilité:', error);
            return {
                requirements: [],
                message: 'Impossible de charger les conditions d\'éligibilité'
            };
        }
    }

    static async verifyResponsableStatus() {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.ELIGIBILITY.RESPONSABLE_STATUS;

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.isResponsable || false;
        } catch (error) {
            console.error('Erreur vérification statut responsable:', error);
            return false;
        }
    }

    static async verifyDelegueStatus() {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.ELIGIBILITY.DELEGUE_STATUS;

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.isDelegue || false;
        } catch (error) {
            console.error('Erreur vérification statut délégué:', error);
            return false;
        }
    }

    static getEligibilityMessage(eligibilityResult) {
        if (!eligibilityResult || !eligibilityResult.eligible) {
            return eligibilityResult?.message || 'Vous n\'êtes pas éligible pour cette élection.';
        }

        const now = new Date();
        const election = eligibilityResult.election;

        if (election) {
            const status = ElectionService.getElectionStatus(election);

            switch (status) {
                case 'candidature':
                    return 'Période de candidature en cours. Vous pouvez vous porter candidat.';
                case 'active':
                    return 'Période de vote en cours. Vous pouvez voter.';
                case 'upcoming':
                    return 'Élection à venir.';
                case 'completed':
                    return 'Élection terminée.';
                default:
                    return 'Vous êtes éligible pour cette élection.';
            }
        }

        return 'Vous êtes éligible pour cette élection.';
    }
}