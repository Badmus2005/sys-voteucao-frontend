// profile.js - Logique de la section "Profil"
import { showLoading, hideLoading, showNotification, API_BASE, CONFIG } from './utils.js';

let APP_STATE = window.APP_STATE;

export function initProfile() {
    console.log("Initialisation de la section profil");
    updateProfileUI();
    setupProfileEventListeners();
    loadProfileFormData();
}

export function updateProfileUI() {
    if (!APP_STATE.userData) return;

    const user = APP_STATE.userData;

    // Sidebar
    document.getElementById('username').textContent = `${user.prenom} ${user.nom}`;
    document.getElementById('user-program').textContent = user.filiere || '-';
    document.getElementById('user-role').textContent = 'Électeur';

    if (user.photoUrl) {
        document.getElementById('user-avatar').src = user.photoUrl;
        document.getElementById('profile-avatar-view').src = user.photoUrl;
    }

    // Mode affichage profil
    document.getElementById('profile-name').textContent = `${user.prenom} ${user.nom}`;
    document.getElementById('profile-matricule').textContent = `Matricule: ${user.matricule || '-'}`;
    document.getElementById('profile-program').textContent = `Filière: ${user.filiere || '-'}`;
    document.getElementById('profile-year').textContent = `Année: ${user.annee ? `${user.annee}ème année` : '-'}`;
    document.getElementById('profile-email').textContent = `Email: ${user.email || '-'}`;

    document.getElementById('view-fullname').textContent = `${user.prenom} ${user.nom}`;
    document.getElementById('view-email').textContent = user.email || '-';
    document.getElementById('view-matricule').textContent = user.matricule || '-';
    document.getElementById('view-program').textContent = user.filiere || '-';
    document.getElementById('view-year').textContent = user.annee ? `${user.annee}ème année` : '-';
}

function loadProfileFormData() {
    if (!APP_STATE.userData) return;

    const user = APP_STATE.userData;
    document.getElementById('email').value = user.email || '';
    document.getElementById('lastname').value = user.nom || '';
    document.getElementById('firstname').value = user.prenom || '';
    document.getElementById('program').value = user.filiere || '';
    document.getElementById('year').value = user.annee || '';
}

function setupProfileEventListeners() {
    // Bouton modifier profil
    document.getElementById('edit-profile-btn').addEventListener('click', toggleEditMode);

    // Annuler les modifications
    document.getElementById('cancel-changes').addEventListener('click', cancelEdit);

    // Changer mot de passe
    document.getElementById('change-password-btn').addEventListener('click', openPasswordModal);

    // Changer photo
    document.getElementById('change-avatar-btn').addEventListener('click', () => {
        document.getElementById('avatar-upload').click();
    });

    // Soumission formulaire profil
    document.getElementById('profile-form').addEventListener('submit', saveProfile);

    // Modal mot de passe
    document.getElementById('password-modal-close').addEventListener('click', closePasswordModal);
    document.getElementById('cancel-password-change').addEventListener('click', closePasswordModal);
    document.getElementById('password-form').addEventListener('submit', changePassword);
}

function toggleEditMode() {
    const editSection = document.getElementById('profile-edit-section');
    const viewSection = document.getElementById('profile-view-section');
    const editBtn = document.getElementById('edit-profile-btn');

    if (editSection.style.display === 'none') {
        // Passer en mode édition
        editSection.style.display = 'block';
        viewSection.style.display = 'none';
        editBtn.innerHTML = '<i class="fas fa-times"></i> Annuler';
        editBtn.classList.remove('btn-primary');
        editBtn.classList.add('btn-outline');
        loadProfileFormData();
    } else {
        // Revenir en mode affichage
        editSection.style.display = 'none';
        viewSection.style.display = 'block';
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Modifier mon profil';
        editBtn.classList.remove('btn-outline');
        editBtn.classList.add('btn-primary');
    }
}

function cancelEdit() {
    toggleEditMode();
    showNotification('Modifications annulées', 'info');
}

async function saveProfile(e) {
    e.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        nom: document.getElementById('lastname').value,
        prenom: document.getElementById('firstname').value,
        filiere: document.getElementById('program').value,
        annee: parseInt(document.getElementById('year').value)
    };

    try {
        showLoading();
        const response = await fetch(`${API_BASE}${CONFIG.API.ENDPOINTS.USERS.PROFILE}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const updatedData = await response.json();
            APP_STATE.userData = { ...APP_STATE.userData, ...updatedData };
            updateProfileUI();
            toggleEditMode();
            showNotification('Profil mis à jour avec succès', 'success');
        } else {
            throw new Error('Erreur mise à jour profil');
        }
    } catch (error) {
        showNotification('Erreur lors de la mise à jour', 'error');
    } finally {
        hideLoading();
    }
}

function openPasswordModal() {
    document.getElementById('password-modal').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('password-modal').classList.add('active');
    }, 10);
}

function closePasswordModal() {
    document.getElementById('password-modal').classList.remove('active');
    setTimeout(() => {
        document.getElementById('password-modal').style.display = 'none';
    }, 300);
}

async function changePassword(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }

    try {
        showLoading();
        const response = await fetch(`${API_BASE}${CONFIG.API.ENDPOINTS.AUTH.CHANGE_PASSWORD}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        if (response.ok) {
            closePasswordModal();
            showNotification('Mot de passe changé avec succès', 'success');
            document.getElementById('password-form').reset();
        } else {
            throw new Error('Erreur changement mot de passe');
        }
    } catch (error) {
        showNotification('Erreur lors du changement de mot de passe', 'error');
    } finally {
        hideLoading();
    }
}