// Initialisation du système de notifications
document.addEventListener('DOMContentLoaded', function () {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token) return;

    // Initialiser le service de notifications
    if (window.notificationService) {
        window.notificationService.init();
    }

    // Gestionnaire pour le bouton de notifications
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationPanel = document.getElementById('notificationPanel');
    const overlay = document.getElementById('overlay');

    if (notificationBtn && notificationPanel) {
        notificationBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            notificationPanel.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }

    // Gestionnaire pour le bouton "Tout marquer comme lu"
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (window.notificationService) {
                window.notificationService.markAllAsRead();
            }
        });
    }

    // Fermer le panneau quand on clique en dehors
    document.addEventListener('click', function (e) {
        if (!notificationPanel?.contains(e.target) && !notificationBtn?.contains(e.target)) {
            notificationPanel?.classList.remove('active');
            overlay?.classList.remove('active');
        }
    });
});