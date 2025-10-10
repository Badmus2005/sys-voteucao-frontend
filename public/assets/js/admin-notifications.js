// admin-notifications.js
// Système de gestion des notifications pour les pages admin avec localStorage

// Configuration
const NOTIFICATIONS_CONFIG = {
    ENDPOINT: '/api/notifications/admin',
    ITEMS_PER_PAGE: 15,
    STORAGE_KEY: 'admin_read_notifications',
    INITIAL_LOAD_LIMIT: 50
};

// Variables globales
let notificationCurrentPage = 1;
let notificationTotalPages = 1;
let notificationHasMore = false;
let allNotifications = [];

// ============ FONCTIONS UTILITAIRES ============

/**
 * Crée une clé unique pour une notification
 */
function createNotificationKey(notification) {
    return `${notification.action || ''}_${notification.createdAt || ''}`;
}

/**
 * Récupère les notifications lues depuis localStorage
 */
function getReadNotifications() {
    const stored = localStorage.getItem(NOTIFICATIONS_CONFIG.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Marque une notification comme lue dans localStorage
 */
function markNotificationAsReadLocally(notificationKey) {
    const readNotifications = getReadNotifications();
    if (!readNotifications.includes(notificationKey)) {
        readNotifications.push(notificationKey);
        localStorage.setItem(NOTIFICATIONS_CONFIG.STORAGE_KEY, JSON.stringify(readNotifications));
    }
}

/**
 * Marque toutes les notifications comme lues dans localStorage
 */
function markAllNotificationsAsReadLocally() {
    const allKeys = allNotifications.map(n => createNotificationKey(n));
    localStorage.setItem(NOTIFICATIONS_CONFIG.STORAGE_KEY, JSON.stringify(allKeys));
}

/**
 * Met à jour le badge de notifications
 */
function updateNotificationBadge() {
    const unreadCount = allNotifications.filter(n => !n.is_read).length;

    const badge = document.getElementById('notificationCount');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

/**
 * Formate une date de manière relative
 */
function formatRelativeTime(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} h`;
    const d = Math.floor(h / 24);
    return `${d} j`;
}

/**
 * Formate une date complète
 */
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('fr-FR', options);
}

/**
 * Récupère le token d'authentification
 */
function getAuthToken() {
    return localStorage.getItem('token');
}

/**
 * Affiche un toast
 */
function showNotificationToast(message, type = 'info') {
    // Si la fonction showToast existe déjà sur la page, l'utiliser
    if (typeof showToast === 'function') {
        showToast(message, type);
        return;
    }

    // Sinon, créer un toast simple
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.cssText = `
        padding: 12px 20px;
        margin-bottom: 10px;
        border-radius: 8px;
        color: white;
        display: flex;
        align-items: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
    `;

    const bgColors = {
        success: '#38a169',
        error: '#e53e3e',
        info: '#3182ce'
    };
    toast.style.backgroundColor = bgColors[type] || bgColors.info;

    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    toast.innerHTML = `<i class="fas fa-${icon}" style="margin-right: 10px;"></i>${message}`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 2000;';
    document.body.appendChild(container);
    return container;
}

// ============ FONCTIONS PRINCIPALES ============

/**
 * Charge les notifications avec pagination
 */
async function loadNotifications(reset = false) {
    try {
        const token = getAuthToken();

        if (reset) {
            notificationCurrentPage = 1;
            allNotifications = [];
        }

        const url = `${CONFIG.BASE_URL}${NOTIFICATIONS_CONFIG.ENDPOINT}?limit=${NOTIFICATIONS_CONFIG.ITEMS_PER_PAGE}&page=${notificationCurrentPage}`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Erreur de chargement des notifications');

        const result = await response.json();

        // Adapter selon la structure de l'API
        let notifications = [];
        let total = 0;

        if (Array.isArray(result)) {
            notifications = result;
            total = result.length;
        } else if (result.data && Array.isArray(result.data)) {
            notifications = result.data;
            total = result.total || result.data.length;
        } else if (result.notifications && Array.isArray(result.notifications)) {
            notifications = result.notifications;
            total = result.total || result.notifications.length;
        }

        // Récupérer les notifications lues du localStorage
        const readNotifications = getReadNotifications();

        // Marquer les notifications comme lues si elles sont dans localStorage
        notifications = notifications.map(n => ({
            ...n,
            is_read: readNotifications.includes(createNotificationKey(n)),
            notificationKey: createNotificationKey(n)
        }));

        // Ajouter les nouvelles notifications
        if (reset) {
            allNotifications = notifications;
        } else {
            allNotifications = [...allNotifications, ...notifications];
        }

        // Vérifier s'il y a plus de notifications
        notificationTotalPages = result.totalPages || Math.ceil(total / NOTIFICATIONS_CONFIG.ITEMS_PER_PAGE);
        notificationHasMore = notificationCurrentPage < notificationTotalPages;

        displayNotifications(allNotifications, reset);
        updateNotificationBadge();

        // Afficher/masquer le bouton "Charger plus"
        const loadMoreBtn = document.getElementById('notificationPagination');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = notificationHasMore ? 'block' : 'none';
        }
    } catch (error) {
        console.error('Erreur chargement notifications:', error);
        showNotificationToast('Erreur de chargement des notifications', 'error');
    }
}

/**
 * Charge la page suivante de notifications
 */
async function loadMoreNotifications() {
    notificationCurrentPage++;
    await loadNotifications(false);
}

/**
 * Affiche les notifications dans le panel
 */
function displayNotifications(notifications, reset = false) {
    const container = document.getElementById('notificationList');
    if (!container) return;

    if (reset) {
        container.innerHTML = '';
    }

    if (!Array.isArray(notifications)) {
        console.warn('notifications n\'est pas un tableau', notifications);
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: #e53e3e;">Erreur de chargement des notifications</p>';
        return;
    }

    if (notifications.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: #a0aec0;">Aucune notification</p>';
        return;
    }

    // Afficher seulement les nouvelles notifications si pas reset
    const startIndex = reset ? 0 : container.children.length;
    const notificationsToDisplay = notifications.slice(startIndex);

    notificationsToDisplay.forEach(notification => {
        const div = document.createElement('div');
        const isRead = notification.is_read;

        div.className = `notification-item ${isRead ? '' : 'unread'}`;
        div.dataset.notificationKey = notification.notificationKey;

        const message = notification.message || notification.action || notification.details || 'Notification sans contenu';
        const time = notification.createdAt || notification.timestamp;

        div.innerHTML = `
            <div class="notification-content">${message}</div>
            <div class="notification-time">${formatRelativeTime(time)}</div>
        `;

        div.addEventListener('click', () => {
            if (!isRead) {
                const key = notification.notificationKey || createNotificationKey(notification);
                markNotificationAsReadLocally(key);

                div.classList.remove('unread');

                // Mettre à jour l'objet notification dans le tableau
                const notifIndex = allNotifications.findIndex(n =>
                    createNotificationKey(n) === key
                );
                if (notifIndex !== -1) {
                    allNotifications[notifIndex].is_read = true;
                }

                updateNotificationBadge();
            }
        });

        container.appendChild(div);
    });
}

/**
 * Marque toutes les notifications comme lues
 */
function markAllAsRead() {
    try {
        markAllNotificationsAsReadLocally();

        allNotifications.forEach(n => {
            n.is_read = true;
        });

        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => item.classList.remove('unread'));

        updateNotificationBadge();

        showNotificationToast('Toutes les notifications marquées comme lues', 'success');
    } catch (error) {
        console.error('Erreur markAllAsRead:', error);
        showNotificationToast('Erreur lors du marquage des notifications', 'error');
    }
}

/**
 * Charge uniquement le badge de notifications au démarrage
 */
async function loadNotificationBadge() {
    try {
        const token = getAuthToken();
        const url = `${CONFIG.BASE_URL}${NOTIFICATIONS_CONFIG.ENDPOINT}?limit=${NOTIFICATIONS_CONFIG.INITIAL_LOAD_LIMIT}`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) return;

        const result = await response.json();

        let notifications = [];
        if (Array.isArray(result)) {
            notifications = result;
        } else if (result.data && Array.isArray(result.data)) {
            notifications = result.data;
        } else if (result.notifications && Array.isArray(result.notifications)) {
            notifications = result.notifications;
        }

        const readNotifications = getReadNotifications();

        const unreadCount = notifications.filter(n => {
            const key = createNotificationKey(n);
            return !readNotifications.includes(key);
        }).length;

        const badge = document.getElementById('notificationCount');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    } catch (error) {
        console.error('Erreur chargement badge notifications:', error);
    }
}

/**
 * Initialise le système de notifications
 */
function initNotifications() {
    // Event listener pour le bouton de notifications
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const panel = document.getElementById('notificationPanel');
            if (panel) {
                panel.classList.toggle('active');

                if (panel.classList.contains('active')) {
                    loadNotifications(true);
                }
            }
        });
    }

    // Event listener pour "Tout marquer comme lu"
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllAsRead);
    }

    // Event listener pour "Charger plus"
    const loadMoreBtn = document.getElementById('loadMoreNotifications');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreNotifications);
    }

    // Fermer le panel en cliquant à l'extérieur
    document.addEventListener('click', function (e) {
        const panel = document.getElementById('notificationPanel');
        const btn = document.getElementById('notificationBtn');

        if (panel && panel.classList.contains('active') &&
            !panel.contains(e.target) &&
            !btn.contains(e.target)) {
            panel.classList.remove('active');
        }
    });

    // Charger le badge au démarrage
    loadNotificationBadge();
}

// Auto-initialisation quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotifications);
} else {
    initNotifications();
}
