// Configuration et constantes
const API_URL = CONFIG.BASE_URL;

// Récupérer le token dynamiquement
function getToken() {
    return localStorage.getItem('token');
}

// Services de base
const BaseService = {
    async apiCall(endpoint, options = {}) {
        const token = getToken();
        const url = `${API_URL}/api${endpoint}`;

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        // Ajouter l'autorisation seulement si le token existe
        if (token) {
            defaultOptions.headers.Authorization = `Bearer ${token}`;
        }

        const config = { ...defaultOptions, ...options };

        try {
            console.log(`API Call: ${url}`, config);

            const response = await fetch(url, config);

            if (!response.ok) {
                // Essayer de récupérer le message d'erreur du backend
                let errorMessage = `Erreur HTTP: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                    console.error('Détails erreur backend:', errorData);
                } catch (e) {
                    // Si la réponse n'est pas du JSON
                    const errorText = await response.text();
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }
};

const UserService = {
    async getProfile() {
        return await BaseService.apiCall('/users/profile');
    }
};

// Fonctions communes à toutes les pages
const Common = {
    // Charger le profil utilisateur dans le header
    async loadUserProfileInHeader() {
        try {
            const response = await UserService.getProfile();
            const userData = response.data;

            const headerAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');

            if (userData && userData.prenom) {
                userName.textContent = userData.prenom + ' ' + (userData.nom || '');

                if (userData.photoUrl && headerAvatar) {
                    const photoUrl = userData.photoUrl.startsWith('http')
                        ? userData.photoUrl
                        : `${API_URL}${userData.photoUrl}`;

                    headerAvatar.src = photoUrl;
                    headerAvatar.onerror = function () {
                        this.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80';
                    };
                }
            }
        } catch (error) {
            console.error('Erreur chargement profil header:', error);
        }
    },

    // Initialiser les éléments communs (menu, notifications, etc.)
    initCommonElements() {
        // Initialiser le menu burger
        const burger = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        if (burger && sidebar) {
            burger.addEventListener('click', function () {
                sidebar.classList.toggle('active');
                if (overlay) overlay.classList.toggle('active');
            });

            if (overlay) {
                overlay.addEventListener('click', function () {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                });
            }
        }

        // Gestion de la déconnexion
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('userProfile');
                window.location.href = 'login.html';
            });
        }
    },

    // Vérifier l'authentification
    checkAuth() {
        if (!localStorage.getItem('token')) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // Fonctions utilitaires d'affichage
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
    },

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.style.display = 'none';
    },

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastIcon = document.getElementById('toastIcon');
        const toastMessage = document.getElementById('toastMessage');

        if (!toast) return;

        // Changer l'icône selon le type
        switch (type) {
            case 'success':
                toastIcon.className = 'fas fa-circle-check';
                break;
            case 'error':
                toastIcon.className = 'fas fa-circle-exclamation';
                break;
            case 'warning':
                toastIcon.className = 'fas fa-triangle-exclamation';
                break;
        }

        toastMessage.textContent = message;
        toast.className = `toast ${type} show`;

        // Cacher après 3 secondes
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    },

    // Gestion des erreurs API
    handleApiError(error, context) {
        console.error(`Erreur ${context}:`, error);

        let userMessage = 'Une erreur est survenue';

        if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
            userMessage = 'Problème de connexion. Vérifiez votre connexion internet.';
        } else if (error.message.includes('401') || error.message.includes('token')) {
            userMessage = 'Session expirée. Veuillez vous reconnecter.';
            setTimeout(() => {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            }, 2000);
        } else if (error.message.includes('404')) {
            userMessage = 'Ressource non trouvée.';
        } else if (error.message.includes('500')) {
            userMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        }

        this.showToast(userMessage, 'error');
        return false;
    }
};