/**
 * Configuration centralisée du système de vote UCAO-UUC
 * Version modulaire pour l'application frontend
 */

const CONFIG = {
    // Configuration de l'API
    BASE_URL: 'https://system-vote-ucao.onrender.com',


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

    // Configuration

    MESSAGES: {
        VALIDATION: {
            REQUIRED_FIELD: "Veuillez remplir tous les champs obligatoires.",
            INVALID_EMAIL: "Veuillez entrer une adresse email valide.",
            FORBIDDEN_CHARS: "Le nom et prénom ne doivent pas contenir de caractères spéciaux.",
            PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 8 caractères.",
            PASSWORD_REQUIREMENTS: "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.",
            PASSWORDS_DONT_MATCH: "Les mots de passe ne correspondent pas.",
            INVALID_MATRICULE: "Le matricule est requis pour les années supérieures.",
            INVALID_CODE: "Le code d'inscription est requis pour la première année."
        },
        SUCCESS: {
            REGISTER: "Inscription réussie! Redirection en cours..."
        },
        ERROR: {
            REGISTER_FAILED: "Erreur lors de l'inscription. Veuillez réessayer.",
            NETWORK_ERROR: "Erreur de réseau. Veuillez vérifier votre connexion."
        }
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
            NOT_ELIGIBLE: 'Vous n\'êtes pas éligible pour cette élection.',
            ALREADY_CANDIDATE: 'Vous êtes déjà candidat à cette élection.',
            ALREADY_VOTED: 'Vous avez déjà voté à cette élection.',
            ELECTION_CLOSED: 'Cette élection est terminée.',
            CANDIDATURE_CLOSED: 'La période de candidature est terminée.'
        },
        VALIDATION: {
            REQUIRED_FIELD: "Veuillez remplir tous les champs obligatoires.",
            INVALID_EMAIL: "Veuillez entrer une adresse email valide.",
            FORBIDDEN_CHARS: "Le nom et prénom ne doivent pas contenir de caractères spéciaux.",
            PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 8 caractères.",
            PASSWORD_REQUIREMENTS: "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.",
            PASSWORDS_DONT_MATCH: "Les mots de passe ne correspondent pas.",
            INVALID_MATRICULE: "Le matricule est requis pour les années supérieures.",
            INVALID_CODE: "Le code d'inscription est requis pour la première année.",
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


// Version du système
CONFIG.VERSION = '2.0.0';
CONFIG.BUILD_DATE = '2025-12-08';
