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
                DELETE: (id) => `/api/election/${id}`
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
                DASHBOARD: '/api/stats/dashboard',
                ELECTION: (id) => `/api/stats/election/${id}`,
                GENERAL: '/api/stats'
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
            ACTIVITY: {
                LIST: '/api/activity'
            },
            CODES: {
                GENERATE: '/api/codes/generate'
            },
            UPLOAD: {
                ADMIN: '/api/upload/admin'
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


// Exporter la configuration
window.CONFIG = CONFIG;


// Version du système
CONFIG.VERSION = '2.0.0';
CONFIG.BUILD_DATE = '2025-12-08';
