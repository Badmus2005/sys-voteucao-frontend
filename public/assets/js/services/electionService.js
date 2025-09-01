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

            return await fetchWithAuth(`${BASE}${url}`);
        } catch (error) {
            console.error('Erreur lors de la récupération des élections:', error);
            throw error;
        }
    }

    static async getElectionDetails(id) {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.ELECTION.DETAILS(id);

            return await fetchWithAuth(`${BASE}${endpoint}`);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de l\'élection:', error);
            throw error;
        }
    }

    static async getMyElections() {
        try {
            const BASE = CONFIG.API.BASE_URL;
            const endpoint = CONFIG.API.ENDPOINTS.ELECTION.MY_ELECTIONS;

            return await fetchWithAuth(`${BASE}${endpoint}`);
        } catch (error) {
            console.error('Erreur lors de la récupération de mes élections:', error);
            throw error;
        }
    }

    static getElectionStatus(election) {
        if (!election || !election.dateDebut || !election.dateFin) return 'upcoming';

        const now = new Date();
        const debutCandidature = new Date(election.dateDebutCandidature);
        const finCandidature = new Date(election.dateFinCandidature);
        const debutVote = new Date(election.dateDebut);
        const finVote = new Date(election.dateFin);

        if (now > finVote) return 'completed';
        if (now >= debutVote && now <= finVote) return 'active';
        if (now >= debutCandidature && now <= finCandidature) return 'candidature';
        return 'upcoming';
    }

    static getStatusText(status) {
        const statuses = {
            'active': 'En cours',
            'upcoming': 'À venir',
            'completed': 'Terminée',
            'candidature': 'Candidature'
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
            'PREMIER': 'Premier Responsable',
            'DEUXIEME': 'Deuxième Responsable',
            'DELEGUE': 'Délégué'
        };
        return types[type] || type;
    }
}
