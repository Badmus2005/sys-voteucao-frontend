class NotificationService {
    constructor() {
        this.API_URL = CONFIG.BASE_URL;
        this.TOKEN = localStorage.getItem('token');
        this.notifications = [];
        this.subscribers = [];
        this.initialized = false;

        this.initialize();
    }

    async initialize() {
        if (this.initialized) return;

        try {
            await this.fetchNotifications(); // 🔁 toutes les notifications
            this.initialized = true;
            this.notifySubscribers();
            this.startPolling(); // 🔁 mise à jour régulière
        } catch (error) {
            console.error("Erreur d'initialisation du service de notifications:", error);
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
                throw new Error("Erreur de récupération des notifications");
            }

            const data = await response.json();
            this.notifications = Array.isArray(data?.notifications) ? data.notifications : [];

            // ✅ Tri par date descendante
            this.notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

            return this.notifications;
        } catch (error) {
            console.error("Erreur lors de la récupération des notifications:", error);
            return [];
        }
    }

    async fetchNewNotifications() {
        try {
            const response = await fetch(`${this.API_URL}/api/notifications?unreadOnly=true`, {
                headers: {
                    'Authorization': `Bearer ${this.TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error("Erreur de récupération des nouvelles notifications");
            }

            const data = await response.json();
            const newNotifications = Array.isArray(data?.notifications) ? data.notifications : [];

            for (const notification of newNotifications) {
                if (!this.notifications.find(n => n.id === notification.id)) {
                    this.notifications.unshift(notification);
                }
            }

            this.notifySubscribers();
            return newNotifications;
        } catch (error) {
            console.error("Erreur lors de la récupération des nouvelles notifications:", error);
            return [];
        }
    }

    async getUnreadCount() {
        try {
            const response = await fetch(`${this.API_URL}/api/notifications/unread/count`, {
                headers: {
                    'Authorization': `Bearer ${this.TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error("Erreur de récupération du nombre de notifications non lues");
            }

            const data = await response.json();
            return data?.count || 0;
        } catch (error) {
            console.error("Erreur lors du comptage des notifications non lues:", error);
            return 0;
        }
    }

    getNotifications() {
        return [...this.notifications];
    }

    getUnreadLocalCount() {
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
                throw new Error("Erreur de marquage de la notification");
            }

            const notification = this.notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
                this.notifySubscribers();
            }
        } catch (error) {
            console.error("Erreur marquage notification:", error);
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
                throw new Error("Erreur de marquage des notifications");
            }

            this.notifications.forEach(n => n.read = true);
            this.notifySubscribers();
        } catch (error) {
            console.error("Erreur marquage notifications:", error);
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
                throw new Error("Erreur lors de la suppression des notifications");
            }

            this.notifications = [];
            this.notifySubscribers();
        } catch (error) {
            console.error("Erreur suppression notifications:", error);
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
                console.error("Erreur lors de la notification d'un abonné:", error);
            }
        });
    }

    startPolling() {
        setInterval(async () => {
            try {
                await this.fetchNewNotifications();
            } catch (error) {
                console.error("Erreur polling notifications:", error);
            }
        }, 30000);
    }
}
