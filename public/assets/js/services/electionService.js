// assets/js/services/electionService.js
class ElectionService {
    static async getElections(filters = {}) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            let url = CONFIG.API.ENDPOINTS.ELECTION.LIST;

            const queryParams = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key] && filters[key] !== 'all') {
                    queryParams.append(key, filters[key]);
                }
            });

            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }

            const response = await fetchWithAuth(`${BASE}${url}`);
            return response.data || response;
        } catch (error) {
            console.error('Erreur lors de la récupération des élections:', error);
            throw new Error('Impossible de charger les élections');
        }
    }

    static async getElectionDetails(id) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.ELECTION.DETAILS(id);

            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.data || response;
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de l\'élection:', error);
            throw new Error('Impossible de charger les détails de l\'élection');
        }
    }

    static async getElectionsForVoting() {

        const BASE = CONFIG.API.BASE_URL;
        const endpoint = CONFIG.API.ENDPOINTS.ELECTION.MY_ELECTIONS;

        try {
            const response = await fetchWithAuth(`${BASE}${endpoint}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching elections for voting:', error);
            throw error;
        }
    }

    static getElectionStatus(election) {
        if (!election || typeof election !== 'object') return 'upcoming';

        try {
            const now = new Date();

            // Validation et conversion des dates
            const debutCandidature = election.dateDebutCandidature ? new Date(election.dateDebutCandidature) : null;
            const finCandidature = election.dateFinCandidature ? new Date(election.dateFinCandidature) : null;
            const debutVote = election.dateDebut ? new Date(election.dateDebut) : null;
            const finVote = election.dateFin ? new Date(election.dateFin) : null;

            // Validation des dates
            if (!debutVote || !finVote) return 'upcoming';
            if (isNaN(debutVote.getTime()) || isNaN(finVote.getTime())) return 'upcoming';

            if (now > finVote) return 'completed';
            if (now >= debutVote && now <= finVote) return 'active';

            // Période de candidature
            if (debutCandidature && finCandidature &&
                !isNaN(debutCandidature.getTime()) && !isNaN(finCandidature.getTime()) &&
                now >= debutCandidature && now <= finCandidature) {
                return 'candidature';
            }

            return 'upcoming';
        } catch (error) {
            console.error('Erreur calcul statut élection:', error);
            return 'upcoming';
        }
    }

    static getStatusText(status) {
        const statuses = {
            'active': 'En cours',
            'upcoming': 'À venir',
            'completed': 'Terminée',
            'candidature': 'Période de candidature'
        };
        return statuses[status] || status;
    }

    static getElectionTypeLabel(type) {
        const types = {
            'SALLE': 'Responsables de Salle',
            'ECOLE': 'Délégués d\'École',
            'UNIVERSITE': 'Délégués Universitaires'
        };
        return types[type] || type;
    }

    static getDelegueTypeLabel(type) {
        if (!type) return 'Non spécifié';
        const types = {
            'PREMIER': 'Premier Délégué',
            'DEUXIEME': 'Deuxième Délégué',
            'DELEGUE': 'Délégué'
        };
        return types[type] || type;
    }

    static formatDate(dateString) {
        if (!dateString) return 'Date non spécifiée';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Date invalide';
        }
    }
}