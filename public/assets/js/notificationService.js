class NotificationService {
    constructor() {
        // Attendre que CONFIG soit défini
        if (typeof CONFIG === 'undefined') {
            throw new Error('CONFIG n\'est pas défini. Assurez-vous que config.js est chargé avant NotificationService');
        }

        this.API_URL = CONFIG.BASE_URL;
        this.TOKEN = localStorage.getItem('token');
        this.notifications = [];
        this.subscribers = [];
        this.initialized = false;

        // Initialiser le service
        this.initialize();
    }

    async initialize() {
        if (this.initialized) return;

        try {
            await this.fetchNotifications();
            this.initialized = true;
            // Notifier les abonnés
            this.notifySubscribers();

            // Mettre en place le polling pour les mises à jour
            this.startPolling();
        } catch (error) {
            console.error('Erreur d\'initialisation du service de notifications:', error);
        }
    }

    async fetchNotifications() {
        try {
            const response = await fetch(`${this.API_URL}/api/notifications`, {
                headers: {
                    'Authorization': `Bearer ${this.TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur de récupération des notifications');
            }

            const data = await response.json();
            this.notifications = data.notifications || [];

            // Trier les notifications par date (plus récentes en premier)
            this.notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            return this.notifications;
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications:', error);
            return [];
        }
    }

    getNotifications() {
        return [...this.notifications];
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    async markAsRead(notificationId) {
        try {
            const response = await fetch(`${this.API_URL}/api/notifications/read/${notificationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur de marquage de la notification');
            }

            // Mettre à jour localement
            const notification = this.notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
                this.notifySubscribers();
            }
        } catch (error) {
            console.error('Erreur marquage notification:', error);
        }
    }

    async markAllAsRead() {
        try {
            const response = await fetch(`${this.API_URL}/api/notifications/read-all`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur de marquage des notifications');
            }

            // Mettre à jour localement
            this.notifications.forEach(n => n.read = true);
            this.notifySubscribers();
        } catch (error) {
            console.error('Erreur marquage notifications:', error);
        }
    }

    async clearAll() {
        try {
            const response = await fetch(`${this.API_URL}/api/notifications/clear-all`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression des notifications');
            }

            // Vider localement
            this.notifications = [];
            this.notifySubscribers();
        } catch (error) {
            console.error('Erreur suppression notifications:', error);
        }
    }

    subscribe(callback) {
        if (typeof callback === 'function') {
            this.subscribers.push(callback);
        }
    }

    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Erreur lors de la notification d\'un abonné:', error);
            }
        });
    }

    startPolling() {
        // Vérifier les nouvelles notifications toutes les 30 secondes
        setInterval(async () => {
            await this.fetchNotifications();
            this.notifySubscribers();
        }, 30000);
    }

    // Méthode pour ajouter une notification (pour les tests)
    addTestNotification() {
        const newNotification = {
            id: Date.now().toString(),
            title: 'Notification de test',
            message: 'Ceci est une notification de test',
            category: 'system',
            timestamp: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(newNotification);
        this.notifySubscribers();
    }
}

// Créer une instance unique du service
const notificationService = new NotificationService();