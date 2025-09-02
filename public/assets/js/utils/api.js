// assets/js/utils/api.js
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/user/login';
        throw new Error('Token non trouvé');
    }

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        ...options
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
        const response = await fetch(url, mergedOptions);
        console.log("URL appelée :", url);

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/user/login';
            return null;
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur fetch:', error);
        throw error;
    }
}

function showToast(message, type = 'info') {
    // Implémentation simplifiée du toast
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast) return;

    toastMessage.textContent = message;
    toast.className = 'toast';

    switch (type) {
        case 'success':
            toastIcon.className = 'fa-solid fa-circle-check';
            toast.classList.add('success');
            break;
        case 'error':
            toastIcon.className = 'fa-solid fa-circle-exclamation';
            toast.classList.add('error');
            break;
        case 'warning':
            toastIcon.className = 'fa-solid fa-triangle-exclamation';
            toast.classList.add('warning');
            break;
        default:
            toastIcon.className = 'fa-solid fa-circle-info';
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

function formatDate(dateString, options = {}) {
    if (!dateString) return 'Non spécifié';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';

    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    return date.toLocaleDateString('fr-FR', { ...defaultOptions, ...options });
}