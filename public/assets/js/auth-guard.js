/**
 * Guard d'authentification pour les pages utilisateur
 * Vérifie la validité du token et redirige vers login si nécessaire
 */

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        LOGIN_URL: '/user/login.html',
        TOKEN_KEY: 'token',
        USER_ROLE_KEY: 'userRole',
        CHECK_INTERVAL: 60000 // Vérifier toutes les minutes
    };

    /**
     * Vérifie si le token existe
     */
    function hasToken() {
        const token = localStorage.getItem(CONFIG.TOKEN_KEY);
        return !!token;
    }

    /**
     * Vérifie si le token est expiré (basique)
     */
    function isTokenExpired() {
        const token = localStorage.getItem(CONFIG.TOKEN_KEY);
        if (!token) return true;

        try {
            // Décoder le JWT pour vérifier l'expiration
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Si pas d'expiration dans le token, considérer comme valide
            if (!payload.exp) {
                console.log('Token sans expiration - Considéré comme valide');
                return false;
            }

            const exp = payload.exp * 1000; // Convertir en millisecondes
            const now = Date.now();
            const isExpired = now >= exp;

            if (isExpired) {
                console.log(`Token expiré: exp=${new Date(exp).toLocaleString()}, now=${new Date(now).toLocaleString()}`);
            } else {
                const timeLeft = Math.floor((exp - now) / 1000 / 60); // minutes
                console.log(`Token valide - Expire dans ${timeLeft} minutes`);
            }

            return isExpired;
        } catch (error) {
            console.error('Erreur lors de la vérification du token:', error);
            // Si on ne peut pas décoder, NE PAS expirer automatiquement
            // Laisser le backend décider
            console.warn('Impossible de décoder le token, mais on le garde valide pour le moment');
            return false;
        }
    }

    /**
     * Vérifie que l'utilisateur a le bon rôle
     */
    function hasCorrectRole() {
        const role = localStorage.getItem(CONFIG.USER_ROLE_KEY);
        const isValid = role === 'STUDENT' || role === 'ETUDIANT';

        if (!isValid) {
            console.log(`Rôle actuel: "${role}" - Attendu: STUDENT ou ETUDIANT`);
        }

        // Si pas de rôle mais token présent, considérer comme valide
        // Le backend validera de toute façon
        if (!role && hasToken()) {
            console.warn('Pas de rôle stocké mais token présent - Considéré comme valide');
            return true;
        }

        return isValid;
    }

    /**
     * Nettoie les données d'authentification
     */
    function clearAuthData() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_ROLE_KEY);
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
    }

    /**
     * Redirige vers la page de connexion
     */
    function redirectToLogin() {
        clearAuthData();
        const currentPath = window.location.pathname;
        const returnUrl = encodeURIComponent(currentPath);
        window.location.href = `${CONFIG.LOGIN_URL}?returnUrl=${returnUrl}`;
    }

    /**
     * Vérifie l'authentification
     */
    function checkAuth() {
        // Ne pas vérifier sur les pages login et register
        const currentPath = window.location.pathname;
        if (currentPath.includes('login.html') || currentPath.includes('register.html')) {
            return;
        }

        // Vérifier la présence du token
        if (!hasToken()) {
            console.warn('🔒 Token manquant - Redirection vers login');
            redirectToLogin();
            return;
        }

        // Vérifier l'expiration du token
        if (isTokenExpired()) {
            console.warn('⏰ Token expiré - Redirection vers login');
            alert('Votre session a expiré. Veuillez vous reconnecter.');
            redirectToLogin();
            return;
        }

        // Vérifier le rôle
        if (!hasCorrectRole()) {
            console.warn('⚠️ Rôle incorrect - Redirection vers login');
            redirectToLogin();
            return;
        }

        console.log('✅ Authentification valide');
    }

    /**
     * Intercepte les erreurs 401 des fetch
     */
    function setupFetchInterceptor() {
        const originalFetch = window.fetch;
        window.fetch = function (...args) {
            return originalFetch.apply(this, args)
                .then(response => {
                    if (response.status === 401) {
                        console.warn('🔒 Erreur 401 détectée - Token invalide');
                        alert('Votre session a expiré. Veuillez vous reconnecter.');
                        redirectToLogin();
                    }
                    return response;
                })
                .catch(error => {
                    throw error;
                });
        };
    }

    /**
     * Initialise le guard d'authentification
     */
    function init() {
        // Vérification initiale
        checkAuth();

        // ⚠️ Vérification périodique désactivée pour éviter les déconnexions intempestives
        // La vérification se fera au chargement de chaque page et sur les erreurs 401
        // setInterval(checkAuth, CONFIG.CHECK_INTERVAL);

        // Intercepter les erreurs 401
        setupFetchInterceptor();

        // Écouter les changements de localStorage (pour détecter la déconnexion depuis un autre onglet)
        window.addEventListener('storage', function (e) {
            if (e.key === CONFIG.TOKEN_KEY && !e.newValue) {
                console.warn('🔒 Token supprimé dans un autre onglet - Redirection vers login');
                redirectToLogin();
            }
        });

        console.log('🛡️ Auth Guard initialisé (mode tolérant)');
    }

    // Initialiser dès que le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exposer certaines fonctions pour usage externe si nécessaire
    window.AuthGuard = {
        checkAuth: checkAuth,
        redirectToLogin: redirectToLogin,
        hasToken: hasToken,
        isTokenExpired: isTokenExpired
    };
})();
