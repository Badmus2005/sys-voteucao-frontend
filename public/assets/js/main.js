// assets/js/main.js
// Initialisation globale de l'application
document.addEventListener('DOMContentLoaded', async function () {
    // Vérifier l'authentification
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/user/login';
        return;
    }

    // Charger le profil utilisateur
    try {
        window.userProfile = await fetchWithAuth(CONFIG.API.ENDPOINTS.USERS.PROFILE);
        updateUIWithUserProfile();
    } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        showToast('Erreur de chargement du profil', 'error');
    }

    // Initialiser les gestionnaires d'événements communs
    initCommonEventHandlers();
});

function updateUIWithUserProfile() {
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(element => {
        if (window.userProfile && window.userProfile.prenom) {
            element.textContent = `${window.userProfile.prenom} ${window.userProfile.nom}`;
        }
    });
}

function initCommonEventHandlers() {
    // Gestionnaire de déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('token');
            showToast('Déconnexion réussie', 'success');
            setTimeout(() => {
                window.location.href = '/user/login';
            }, 1500);
        });
    }

    // Menu burger pour mobile
    const burger = document.getElementById('burger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (burger && sidebar && overlay) {
        burger.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            burger.classList.toggle('open');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            burger.classList.remove('open');
        });
    }
}

// Exposer les fonctions globales
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.formatDate = formatDate;