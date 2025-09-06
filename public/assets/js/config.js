/**
 * Configuration centralisée du système de vote UCAO-UUC
 * Version modulaire pour l'application frontend
 */

const CONFIG = {
    // Configuration de l'API
    API: {
        // URL du backend Railway en production
        //BASE_URL: 'https://system-vote-ucao.onrender.com',
        BASE_URL: 'https://808924019adf.ngrok-free.app',

        ENDPOINTS: {
            // Authentification
            AUTH: {
                LOGIN: '/api/userLogin',
                REGISTER: '/api/userRegister',
                ADMIN_LOGIN: '/api/admin/auth/login',
                ADMIN_REGISTER: '/api/admin/auth/register',
                CHANGE_PASSWORD_TEMPORARY: '/api/userLogin/change-password-temporary',
                FORGOT_PASSWORD: '/api/userLogin/forgot-password',
                RESET_PASSWORD: '/api/userLogin/reset-password',
                TEST: '/api/userLogin/test'
            },

            // Élections - ENDPOINTS PRINCIPAUX À UTILISER
            ELECTION: {
                LIST: '/api/election',
                DETAILS: (id) => `/api/election/${id}`,
                CREATE: '/api/election',
                CLOSE: (id) => `/api/election/${id}/close`,
                DELETE: (id) => `/api/election/${id}`,
                BY_TYPE: (type) => `/api/election/by-type/${type}`,
                STATS_BY_TYPE: (type) => `/api/election/stats/by-type/${type}`,

                // NOUVEAU: Endpoint pour les élections de l'utilisateur
                MY_ELECTIONS: '/api/election/vote/my-elections',
                ACTIVE: '/api/election/active',
                // NOUVEAU: Endpoint pour vérifier l'éligibilité
                CHECK_ELIGIBILITY: (electionId) => `/api/election/${electionId}/check-eligibility`
            },

            // Votes - ENDPOINTS PRINCIPAUX À UTILISER  
            VOTE: {
                TOKEN: (electionId) => `/api/vote/token/${electionId}`,
                SUBMIT: '/api/vote',
                RESULTS: (electionId) => `/api/vote/results/${electionId}`,
                STATUS: (electionId) => `/api/vote/status/${electionId}`,

                // NOUVEAU: Endpoints pour nos services
                MY_VOTES: '/api/vote/my-votes',
                VALIDATE_TOKEN: '/api/vote/validate-token',

                // Endpoint détaillé pour les résultats 
                RESULTS_DETAILED: (electionId) => `/api/vote/results-detailed/${electionId}`
            },

            // Candidats - ENDPOINTS PRINCIPAUX À UTILISER
            CANDIDATE: {
                LIST: '/api/candidats',
                CREATE: '/api/candidats/create',
                IS_CANDIDATE: (electionId) => `/api/candidats/is-candidate/${electionId}`,
                BY_ELECTION: (electionId) => `/api/candidats/election/${electionId}`,
                SUBMIT: '/api/candidats',
                // NOUVEAU: Endpoints pour nos services
                MY_CANDIDATURES: '/api/candidats/mes-candidatures',
                UPDATE: (candidateId) => `/api/candidats/${candidateId}`,
                DELETE: (candidateId) => `/api/candidats/${candidateId}`
            },

            // Upload d'images
            UPLOAD: {
                IMAGE: '/api/upload/image'
            },

            // Statistiques
            STATS: {
                GENERAL: "/api/stats/general",
                VOTES: "/api/stats/votes",
                DISTRIBUTION: "/api/stats/distribution",
                HOURLY: "/api/stats/hourly",
                COMPARISON: "/api/stats/comparison",
                EXPORT: "/api/stats/export"
            },

            // Utilisateurs
            USERS: {
                FEED: '/api/users/feed',
                ELECTION: '/api/users/elections', // Utilisé pour MY_ELECTIONS
                PROFILE: '/api/users/profile',
                AVATAR: '/api/users/avatar',
                UPDATE: '/api/users/profile',
                CHANGE_PASSWORD: '/api/users/change-password',

                // NOUVEAU: Stats utilisateur
                STATS: '/api/users/stats'
            },

            // Admin
            ADMIN: {
                ME: '/api/admin/me',
                UPDATE: '/api/admin/update'
            },

            // Étudiants  
            STUDENTS: {
                LIST: "/api/students",
                SEARCH: "/api/students",
                STATS: "/api/students/stats",
                UPDATE_STATUS: (id) => `/api/students/${id}/status`,
                RESET_ACCESS: (studentId) => `/api/students/${studentId}/reset-access`,
                BY_ID: (id) => `/api/students/${id}`,
                DELETE: (id) => `/api/students/${id}/delete`,
                ACTIVATE: (id) => `/api/students/${id}/activate`,
            },

            // Activité
            ACTIVITY: {
                LIST: '/api/activity'
            },

            // Codes
            CODES: {
                GENERATE: '/api/codes/generate',
                LIST: '/api/codes/list'
            },

            // Notifications
            NOTIFICATIONS: {
                LIST: '/api/notifications',
                READ: (id) => `/api/notifications/${id}/read`,
                READ_ALL: '/api/notifications/read-all',
                DELETE: (id) => `/api/notifications/${id}`,
                DELETE_ALL: '/api/notifications',
                STATS: '/api/notifications/stats',
                ADMIN: '/api/notifications/admin'
            },

            ELIGIBILITY: {
                CHECK: (id) => `/eligibility/check/${id}`,
                CAN_CANDIDATE: (id) => `/eligibility/can-candidate/${id}`,
                CAN_VOTE: (id) => `/eligibility/can-vote/${id}`,
                REQUIREMENTS: (id) => `/eligibility/requirements/${id}`,
                RESPONSABLE_STATUS: '/eligibility/responsable-status',
                DELEGUE_STATUS: '/eligibility/delegue-status'
            },

            // Configuration académique
            CONFIG_ACADEMIC: '/api/configAcademic'
        }
    },

    // Configuration des élections
    ELECTION: {
        TYPES: {
            SALLE: 'SALLE',
            ECOLE: 'ECOLE',
            UNIVERSITE: 'UNIVERSITE' // Correction: UNIVERISTE → UNIVERSITE
        },
        STATUS: {
            ACTIVE: 'active',
            CLOSED: 'closed',
            UPCOMING: 'upcoming',
            CANDIDATURE: 'candidature' // Nouveau statut pour période de candidature
        },

        // Types de délégués
        DELEGUE_TYPES: {
            PREMIER: 'PREMIER',
            DEUXIEME: 'DEUXIEME',
            DELEGUE: 'DELEGUE'
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
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes

        // Nouveau: Configuration des tokens de vote
        VOTE_TOKEN_EXPIRY: 15 * 60 * 1000 // 15 minutes pour les tokens de vote
    },

    // Messages d'erreur et de succès
    MESSAGES: {
        SUCCESS: {
            LOGIN: 'Connexion réussie !',
            REGISTER: 'Inscription réussie !',
            VOTE: 'Votre vote a été enregistré avec succès !',
            CANDIDATURE: 'Votre candidature a été soumise avec succès !',
            ELECTION_CREATED: 'Élection créée avec succès !',
            ELECTION_CLOSED: 'Élection clôturée avec succès !',
            // Nouveaux messages
            CANDIDATURE_UPDATED: 'Candidature modifiée avec succès !',
            CANDIDATURE_CANCELLED: 'Candidature annulée avec succès !'
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
            SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
            // Nouveaux messages
            NOT_ELIGIBLE: 'Vous n\'êtes pas éligible pour cette élection.',
            ALREADY_CANDIDATE: 'Vous êtes déjà candidat à cette élection.',
            ALREADY_VOTED: 'Vous avez déjà voté à cette élection.',
            ELECTION_CLOSED: 'Cette élection est terminée.',
            CANDIDATURE_CLOSED: 'La période de candidature est terminée.'
        },
        VALIDATION: {
            REQUIRED_FIELD: 'Ce champ est obligatoire.',
            INVALID_EMAIL: 'Adresse email invalide.',
            PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 8 caractères.',
            PASSWORDS_DONT_MATCH: 'Les mots de passe ne correspondent pas.',
            INVALID_MATRICULE: 'Matricule invalide.',
            INVALID_CODE: 'Code d\'inscription invalide.',
            // Nouveaux messages
            IMAGE_TOO_LARGE: 'L\'image ne doit pas dépasser 2MB.',
            INVALID_IMAGE_TYPE: 'Format d\'image non supporté. Utilisez JPG ou PNG.',
            TEXT_TOO_LONG: (maxLength) => `Le texte ne doit pas dépasser ${maxLength} caractères.`,
            TEXT_TOO_SHORT: (minLength) => `Le texte doit contenir au moins ${minLength} caractères.`
        }
    },

    // Configuration académique
    ACADEMIC: {
        ECOLES: {
            EGEI: {
                nom: "EGEI",
                filieres: [
                    'Électronique',
                    'Génie Télécoms et TIC',
                    'Informatique Industrielle et Maintenance',
                    'Electrotechnique'
                ]
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
                    'Transport et Logistique'
                ]
            },
            FSAE: {
                nom: "FSAE",
                filieres: [
                    'Gestion de l\'Environnement et Aménagement du Territoire',
                    'Production et Gestion des Ressources Animales',
                    'Sciences et Techniques de Production Végétale',
                    'Stockage Conservation et Conditionnement des Produits Agricoles',
                    'Gestion des Entreprises Rurales et Agricoles'
                ]
            },
            FDE: {
                nom: "FDE",
                filieres: [
                    'Droit',
                    'Economie'
                ]
            }
        },
        ANNEES: [1, 2, 3],

        // Nouveau: Niveaux hiérarchiques pour l'éligibilité
        HIERARCHY: {
            SALLE: 1,      // Responsable de salle
            ECOLE: 2,      // Délégué d'école  
            UNIVERSITE: 3  // Délégué d'université
        }
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
    },

    // Nouveau: Configuration des limites
    LIMITS: {
        CANDIDATURE: {
            SLOGAN_MAX_LENGTH: 100,
            PROGRAMME_MIN_LENGTH: 50,
            PROGRAMME_MAX_LENGTH: 2000,
            MOTIVATION_MIN_LENGTH: 100,
            MOTIVATION_MAX_LENGTH: 1000,
            IMAGE_MAX_SIZE: 2 * 1024 * 1024, // 2MB
            IMAGE_ALLOWED_TYPES: ['image/jpeg', 'image/png']
        },
        PAGINATION: {
            DEFAULT_PAGE_SIZE: 10,
            MAX_PAGE_SIZE: 50
        }
    },

    // Nouveau: Configuration des fonctionnalités
    FEATURES: {
        ENABLE_CANDIDATURE: true,
        ENABLE_VOTING: true,
        ENABLE_RESULTS: true,
        ENABLE_STATS: true,
        MAINTENANCE_MODE: false
    }
};

// Pour la compatibilité avec les scripts existants
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

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


    /**
     * Vérifie le rôle de l'utilisateur
     */


    /**
     * Décode le token JWT
     */


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

window.UTILS = UTILS;



// Version du système
CONFIG.VERSION = '2.0.0';
CONFIG.BUILD_DATE = '2025-12-08';
