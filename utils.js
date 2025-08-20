// utils.js - Fonctions utilitaires pour l'application de vote

// Configuration de l'API (importée depuis config.js)
export const API_BASE = CONFIG.API.BASE_URL;
export const CONFIG = window.CONFIG;

// Variables globales
let loadingCount = 0;

/**
 * Affiche l'overlay de chargement
 */
export function showLoading() {
    loadingCount++;
    if (loadingCount === 1) {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Masque l'overlay de chargement
 */
export function hideLoading() {
    loadingCount = Math.max(0, loadingCount - 1);
    if (loadingCount === 0) {
        document.getElementById('loading-overlay').style.display = 'none';
    }
}

/**
 * Affiche une notification
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de notification (success, error, warning, info)
 */
export function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.className = `notification ${type} show`;
    document.getElementById('notification-message').textContent = message;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

/**
 * Formate une date en français
 * @param {string|Date} dateString - La date à formater
 * @returns {string} La date formatée
 */
export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Formate une date et heure en français
 * @param {string|Date} dateString - La date à formater
 * @returns {string} La date et heure formatées
 */
export function formatDateTime(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Calcule un pourcentage
 * @param {number} value - La valeur
 * @param {number} total - La valeur totale
 * @returns {number} Le pourcentage
 */
export function calculatePercentage(value, total) {
    return total > 0 ? Math.round((value / total) * 100) : 0;
}

/**
 * Vérifie si un token est valide
 * @returns {boolean} True si le token est valide
 */
export function isTokenValid() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.exp > Date.now() / 1000;
    } catch (error) {
        return false;
    }
}

/**
 * Récupère les données utilisateur depuis le token
 * @returns {Object|null} Les données utilisateur ou null
 */
export function getUserFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        return null;
    }
}

/**
 * Effectue une requête API avec gestion d'erreur
 * @param {string} endpoint - L'endpoint de l'API
 * @param {Object} options - Les options de la requête
 * @returns {Promise} La promesse de la requête
 */
export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, mergedOptions);

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return null;
        }

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        showNotification('Erreur de connexion au serveur', 'error');
        throw error;
    }
}

/**
 * Met à jour le compteur de notifications
 * @param {number} count - Le nombre de notifications
 */
export function updateNotificationCount(count) {
    const element = document.getElementById('notification-count');
    if (element) {
        element.textContent = count;
        element.style.display = count > 0 ? 'inline' : 'none';
    }
}

/**
 * Basculer la visibilité du mot de passe
 * @param {string} targetId - L'ID de l'input password
 */
export function togglePasswordVisibility(targetId) {
    const passwordInput = document.getElementById(targetId);
    const toggleIcon = document.querySelector(`.password-toggle[data-target="${targetId}"] i`);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

/**
 * Vérifie la force d'un mot de passe
 * @param {string} password - Le mot de passe à vérifier
 * @returns {string} Le niveau de force (weak, medium, strong)
 */
export function checkPasswordStrength(password) {
    if (password.length < 8) return 'weak';

    let strength = 0;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[!@#$%^&*(),.?":{}|<>]+/)) strength++;

    if (strength < 2) return 'weak';
    if (strength < 4) return 'medium';
    return 'strong';
}

/**
 * Déclenche le téléchargement d'un fichier
 * @param {string} content - Le contenu du fichier
 * @param {string} filename - Le nom du fichier
 * @param {string} contentType - Le type MIME
 */
export function downloadFile(content, filename, contentType = 'text/plain') {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

/**
 * Formate un nombre avec séparateurs de milliers
 * @param {number} number - Le nombre à formater
 * @returns {string} Le nombre formaté
 */
export function formatNumber(number) {
    return new Intl.NumberFormat('fr-FR').format(number);
}

/**
 * Copie du texte vers le clipboard
 * @param {string} text - Le texte à copier
 * @returns {Promise} Promesse de la copie
 */
export function copyToClipboard(text) {
    return navigator.clipboard.writeText(text)
        .then(() => showNotification('Texte copié avec succès', 'success'))
        .catch(() => {
            // Fallback pour les anciens navigateurs
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Texte copié avec succès', 'success');
        });
}

/**
 * Débounce une fonction
 * @param {Function} func - La fonction à débouncer
 * @param {number} wait - Le temps d'attente en ms
 * @returns {Function} La fonction débouncée
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Filtre un tableau d'objets selon plusieurs critères
 * @param {Array} array - Le tableau à filtrer
 * @param {Object} filters - Les critères de filtrage
 * @returns {Array} Le tableau filtré
 */
export function filterArray(array, filters) {
    return array.filter(item => {
        return Object.keys(filters).every(key => {
            if (filters[key] === 'all' || !filters[key]) return true;
            return item[key] === filters[key];
        });
    });
}

/**
 * Génère un identifiant unique
 * @returns {string} Un identifiant unique
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Initialisation des écouteurs d'événements globaux
document.addEventListener('DOMContentLoaded', function () {
    // Gestionnaire pour les toggle de mot de passe
    document.addEventListener('click', function (e) {
        if (e.target.closest('.password-toggle')) {
            const targetId = e.target.closest('.password-toggle').dataset.target;
            togglePasswordVisibility(targetId);
        }
    });

    // Gestionnaire pour la force du mot de passe
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', debounce(function () {
            if (this.id === 'new-password') {
                const strength = checkPasswordStrength(this.value);
                const strengthElement = document.getElementById('password-strength');
                if (strengthElement) {
                    strengthElement.className = `password-strength ${strength}`;
                    const strengthText = {
                        weak: 'Faible',
                        medium: 'Moyen',
                        strong: 'Fort'
                    }[strength];
                    strengthElement.querySelector('.strength-text').textContent = `Force: ${strengthText}`;
                }
            }
        }, 300));
    });
});