class NotificationService {
    constructor() {
        this.baseUrl = CONFIG.BASE_URL;
        this.notifications = [];
        this.unreadCount = 0;
        this.lastCheck = null;
        this.checkInterval = 30000; // Vérifier toutes les 30 secondes
    }

    async init() {
        await this.loadNotifications();
        this.startPolling();
    }

    async loadNotifications() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${this.baseUrl}/api/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Erreur de chargement des notifications');

            const data = await response.json();
            this.notifications = data.notifications || [];
            this.unreadCount = this.notifications.filter(n => !n.is_read).length;
            this.updateUI();
        } catch (error) {
            console.error('Erreur notifications:', error);
        }
    }

    startPolling() {
        setInterval(() => this.checkNewNotifications(), this.checkInterval);
    }

    async checkNewNotifications() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${this.baseUrl}/api/notifications?since=${this.lastCheck || ''}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Erreur de vérification des notifications');

            const data = await response.json();
            if (data.notifications && data.notifications.length > 0) {
                this.notifications = [...data.notifications, ...this.notifications];
                this.unreadCount += data.notifications.length;
                this.updateUI();
                this.showNotificationToast('Nouvelles notifications');
            }

            this.lastCheck = new Date().toISOString();
        } catch (error) {
            console.error('Erreur vérification notifications:', error);
        }
    }

    updateUI() {
        // Mettre à jour le compteur
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'flex' : 'none';
        }

        // Mettre à jour la liste des notifications si le panneau est ouvert
        const notificationList = document.getElementById('notificationList');
        if (notificationList) {
            notificationList.innerHTML = this.notifications.map(notification => `
                <div class="notification-item ${notification.is_read ? '' : 'unread'}" 
                     data-id="${notification.id}">
                    <div class="notification-content">
                        ${notification.message}
                    </div>
                    <div class="notification-time">
                        ${this.formatDate(notification.createdAt)}
                    </div>
                </div>
            `).join('');

            // Ajouter les écouteurs d'événements
            notificationList.querySelectorAll('.notification-item').forEach(item => {
                item.addEventListener('click', () => this.markAsRead(item.dataset.id));
            });
        }
    }

    async markAsRead(notificationId) {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${this.baseUrl}/api/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Erreur de marquage de la notification');

            // Mettre à jour localement
            const notification = this.notifications.find(n => n.id === notificationId);
            if (notification && !notification.is_read) {
                notification.is_read = true;
                this.unreadCount--;
                this.updateUI();
            }
        } catch (error) {
            console.error('Erreur marquage notification:', error);
        }
    }

    async markAllAsRead() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${this.baseUrl}/api/notifications/read-all`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Erreur de marquage des notifications');

            // Mettre à jour localement
            this.notifications.forEach(n => n.is_read = true);
            this.unreadCount = 0;
            this.updateUI();
        } catch (error) {
            console.error('Erreur marquage notifications:', error);
        }
    }

    formatDate(date) {
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'Hier';
        } else {
            return d.toLocaleDateString('fr-FR');
        }
    }

    showNotificationToast(message) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = 'toast show';
            setTimeout(() => {
                toast.className = 'toast';
            }, 3000);
        }
    }
}

// Créer une instance globale du service
window.notificationService = new NotificationService();