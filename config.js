/**
 * Configuration centralisée du système de vote UCAO-UUC
 */

const CONFIG = {
    // Configuration de l'API
    API: {
        // Utiliser l'URL du backend Railway en production
        BASE_URL: 'https://sys-voteucao-backend-production-311c.up.railway.app',
        ENDPOINTS: {
            AUTH: {
                LOGIN: '/api/userLogin',
                REGISTER: '/api/userRegister',
                ADMIN_LOGIN: '/api/adminLogin',
                ADMIN_REGISTER: '/api/adminRegister',
                CHANGE_PASSWORD: '/api/userLogin/change-password',
                FORGOT_PASSWORD: '/api/userLogin/forgot-password',
                RESET_PASSWORD: '/api/userLogin/reset-password',
            },
            ELECTION: {
                LIST: '/api/election',
                DETAILS: (id) => `/api/election/${id}`,
                CREATE: '/api/election',
                CLOSE: (id) => `/api/election/${id}/close`,
                DELETE: (id) => `/api/election/${id}`,
                BY_TYPE: (type) => `/api/election/by-type/${type}`,
                STATS_BY_TYPE: (type) => `/api/election/stats/by-type/${type}`
            },
            VOTE: {
                TOKEN: (electionId) => `/api/vote/token/${electionId}`,
                SUBMIT: '/api/vote',
                RESULTS: (electionId) => `/api/vote/results/${electionId}`,
                STATUS: (electionId) => `/api/vote/status/${electionId}`
            },
            CANDIDATE: {
                LIST: '/api/candidats',
                CREATE: '/api/candidats'
            },
            UPLOAD: {
                IMAGE: '/api/upload/image'
            },

            STATS: {
                GENERAL: "/api/stats/general",
                VOTES: "/api/stats/votes",
                DISTRIBUTION: "/api/stats/distribution",
                HOURLY: "/api/stats/hourly",
                COMPARISON: "/api/stats/comparison",
                EXPORT: "/api/stats/export"
            },
            USERS: {
                FEED: '/api/users/feed',
                ELECTION: '/api/users/elections',
                PROFILE: '/api/users/profile',
                AVATAR: '/api/users/avatar',
                UPDATE: '/api/users/profile',
                CHANGE_PASSWORD: '/api/users/change-password'
            },
            ADMIN: {
                ME: '/api/admin/me',
                UPDATE: '/api/admin/update'
            },
            STUDENTS: {
                LIST: "/students",
                UPDATE_STATUS: "/students/:id/status",
                SEARCH: "/students",
                STATS: "/students/stats"
            },
            ACTIVITY: {
                LIST: '/api/activity'
            },
            CODES: {
                GENERATE: '/api/codes/generate'
            },
            UPLOAD: {
                IMAGE: '/api/upload/image'
            }
        }
    },

    // Configuration des élections
    ELECTION: {
        TYPES: {
            SALLE: 'SALLE',
            ECOLE: 'ECOLE',
            UNIVERISTE: 'UNIVERSITE'
        },
        STATUS: {
            ACTIVE: 'active',
            CLOSED: 'closed',
            UPCOMING: 'upcoming'
        }
    },

    // Configuration de l'interface
    UI: {
        COLORS: {
            PRIMARY: '#800020',      // Rouge bordeaux UCAO
            SECONDARY: '#1a2a4a',    // Bleu nuit
            ACCENT: '#d4af37',       // Or
            SUCCESS: '#28a745',      // Vert
            WARNING: '#ffc107',      // Jaune
            DANGER: '#dc3545',       // Rouge
            LIGHT: '#f8f4e9',        // Blanc cassé
            DARK: '#343a40'          // Gris foncé
        },
        BREAKPOINTS: {
            MOBILE: 768,
            TABLET: 1024,
            DESKTOP: 1200
        },
        ANIMATIONS: {
            DURATION: 300,
            EASING: 'ease-in-out'
        }
    },

    // Configuration de sécurité
    SECURITY: {
        TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 heures en millisecondes
        PASSWORD_MIN_LENGTH: 8,
        SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes
    },

    // Messages d'erreur et de succès
    MESSAGES: {
        SUCCESS: {
            LOGIN: 'Connexion réussie !',
            REGISTER: 'Inscription réussie !',
            VOTE: 'Votre vote a été enregistré avec succès !',
            CANDIDATURE: 'Votre candidature a été soumise avec succès !',
            ELECTION_CREATED: 'Élection créée avec succès !',
            ELECTION_CLOSED: 'Élection clôturée avec succès !'
        },
        ERROR: {
            LOGIN_FAILED: 'Échec de la connexion. Vérifiez vos identifiants.',
            REGISTER_FAILED: 'Échec de l\'inscription. Vérifiez vos informations.',
            VOTE_FAILED: 'Échec de l\'enregistrement du vote.',
            CANDIDATURE_FAILED: 'Échec de la soumission de la candidature.',
            NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
            UNAUTHORIZED: 'Accès non autorisé. Veuillez vous connecter.',
            FORBIDDEN: 'Accès interdit. Vous n\'avez pas les permissions nécessaires.',
            NOT_FOUND: 'Ressource non trouvée.',
            SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.'
        },
        VALIDATION: {
            REQUIRED_FIELD: 'Ce champ est obligatoire.',
            INVALID_EMAIL: 'Adresse email invalide.',
            PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 8 caractères.',
            PASSWORDS_DONT_MATCH: 'Les mots de passe ne correspondent pas.',
            INVALID_MATRICULE: 'Matricule invalide.',
            INVALID_CODE: 'Code d\'inscription invalide.'
        }
    },

    ACADEMIC: {
        ECOLES: {
            EGEI: {
                nom: "EGEI",
                filieres: [
                    'Électronique',
                    'Génie Télécoms et TIC',
                    'Informatique Industrielle et Maintenance',
                    'Electrotechnique']
            },
            ESMEA: {
                nom: "ESMEA",
                filieres: [
                    'Assurances',
                    'Banque et Finance d\'Entreprise',
                    'Audit et Contrôle de Gestion',
                    'Management des Ressources Humaines',
                    'Action Commerciale et Force de Vente',
                    'Communication et Action Publicitaire',
                    'Commerce',
                    'Informatique de Gestion',
                    'Transport et Logistique']
            },
            FSAE: {
                nom: "FSAE",
                filieres: [
                    'Gestion de l\'Environnement et Aménagement du Territoire',
                    'Production et Gestion des Ressources Animales',
                    'Sciences et Techniques de Production Végétale',
                    'Stockage Conservation et Conditionnement des Produits Agricoles',
                    'Gestion des Entreprises Rurales et Agricoles']
            },
            FDE: {
                nom: "FDE",
                filieres: [
                    'Droit',
                    'Economie']
            }
        },
        ANNEES: [1, 2, 3]
    },

    // Configuration des notifications
    NOTIFICATIONS: {
        AUTO_HIDE_DELAY: 5000, // 5 secondes
        POSITION: 'top-right',
        TYPES: {
            SUCCESS: 'success',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info'
        }
    }
};

// Fonctions utilitaires
const UTILS = {
    /**
     * Formate une date en français
     */
    formatDate: (date, options = {}) => {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        return new Date(date).toLocaleDateString('fr-FR', {
            ...defaultOptions,
            ...options
        });
    },

    /**
     * Formate un nombre avec des séparateurs de milliers
     */
    formatNumber: (number) => {
        return new Intl.NumberFormat('fr-FR').format(number);
    },

    /**
     * Calcule le pourcentage
     */
    calculatePercentage: (value, total) => {
        if (total === 0) return 0;
        return ((value / total) * 100).toFixed(2);
    },

    /**
     * Vérifie si l'utilisateur est connecté
     */
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Date.now() / 1000;
            return payload.exp > now;
        } catch (error) {
            return false;
        }
    },

    /**
     * Vérifie le rôle de l'utilisateur
     */
    getUserRole: () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role;
        } catch (error) {
            return null;
        }
    },

    /**
     * Décode le token JWT
     */
    decodeToken: (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            return null;
        }
    },

    /**
     * Génère un ID unique
     */
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Valide une adresse email
     */
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Débounce une fonction
     */
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Exporter la configuration
window.CONFIG = CONFIG;
window.UTILS = UTILS;



// Version du système
CONFIG.VERSION = '2.0.0';
CONFIG.BUILD_DATE = '2025-12-08';
