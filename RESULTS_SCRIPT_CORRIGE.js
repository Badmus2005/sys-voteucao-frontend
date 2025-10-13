// 🎯 SCRIPT CORRIGÉ POUR results.html
// Version: 2.0 - Nettoyée et optimisée
// Date: 13 octobre 2025

// ============================================
// VARIABLES GLOBALES
// ============================================
let allElections = [];
let currentResults = null;
let votesChart = null;
let comparisonChart = null;

// ============================================
// CONFIGURATION API
// ============================================
const API_BASE = CONFIG.BASE_URL;
const ENDPOINTS = {
    COMPLETED_ELECTIONS: '/api/votes/elections/completed',
    STUDENT_RESULTS: '/api/votes/student/results',
    USER_PROFILE: '/api/users/profile',
    SCHOOLS: '/api/ecoles'
};

// ============================================
// UTILITAIRES
// ============================================
function getToken() {
    return localStorage.getItem('token');
}

function formatDate(dateString) {
    if (!dateString) return 'Non définie';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.className = `toast ${type}`;

    const icons = {
        'success': 'fa-circle-check',
        'error': 'fa-circle-exclamation',
        'warning': 'fa-triangle-exclamation',
        'info': 'fa-circle-info'
    };
    toastIcon.className = `fa-solid ${icons[type] || 'fa-circle-info'}`;

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// ============================================
// SERVICES API
// ============================================
const APIService = {
    async fetchWithAuth(url, options = {}) {
        const headers = {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
            ...options.headers
        };

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                throw new Error('Non authentifié');
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    },

    async getUserProfile() {
        return this.fetchWithAuth(`${API_BASE}${ENDPOINTS.USER_PROFILE}`);
    },

    async getSchools() {
        try {
            return await this.fetchWithAuth(`${API_BASE}${ENDPOINTS.SCHOOLS}`);
        } catch (error) {
            console.error('Erreur chargement écoles:', error);
            return [];
        }
    },

    async getCompletedElections(filters = {}) {
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) queryParams.append(key, filters[key]);
        });

        const url = `${API_BASE}${ENDPOINTS.COMPLETED_ELECTIONS}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        return this.fetchWithAuth(url);
    },

    async getElectionResults(electionId) {
        return this.fetchWithAuth(`${API_BASE}${ENDPOINTS.STUDENT_RESULTS}/${electionId}`);
    }
};

// ============================================
// TRANSFORMATION DES DONNÉES
// ============================================
function transformBackendData(backendData) {
    console.log('📊 Données reçues du backend:', backendData);

    if (!backendData || !backendData.resultats) {
        console.warn('⚠️ Données backend invalides');
        return null;
    }

    const transformed = {
        election: backendData.election,
        statistiques: {
            totalVotes: backendData.statistiques?.totalVotes || 0,
            totalInscrits: backendData.statistiques?.totalInscrits || 0,
            electeursAyantVote: backendData.statistiques?.electeursAyantVote,
            tauxParticipation: backendData.statistiques?.tauxParticipation || 0,
            nombreCandidats: backendData.resultats?.length || 0
        },
        resultats: (backendData.resultats || []).map(candidate => ({
            id: candidate.candidateId || candidate.id,
            nom: candidate.nom || 'Nom inconnu',
            prenom: candidate.prenom || 'Prénom inconnu',
            photoUrl: candidate.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
            filiere: candidate.filiere || candidate.filiereId || 'Filière non spécifiée',
            annee: candidate.annee,
            slogan: candidate.slogan || '',
            scoreFinal: candidate.scoreFinal || 0,
            details: {
                totalVotes: candidate.details?.totalVotes || 0
            }
        }))
    };

    console.log('✅ Données transformées:', {
        tauxParticipation: transformed.statistiques.tauxParticipation,
        electeursAyantVote: transformed.statistiques.electeursAyantVote,
        nombreCandidats: transformed.statistiques.nombreCandidats
    });

    return transformed;
}

// ============================================
// CHARGEMENT DES DONNÉES
// ============================================
async function loadUserProfile() {
    try {
        const data = await APIService.getUserProfile();
        if (data.success && data.data) {
            const user = data.data;
            document.getElementById('userName').textContent =
                `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Étudiant';
            if (user.photoUrl) {
                document.getElementById('userAvatar').src = user.photoUrl;
            }
        }
    } catch (error) {
        console.error('Erreur chargement profil:', error);
    }
}

async function loadSchools() {
    try {
        const schools = await APIService.getSchools();
        const ecoleSelect = document.getElementById('filter-ecole');

        if (schools && schools.length > 0) {
            ecoleSelect.innerHTML = '<option value="">Tous</option>' +
                schools.map(school =>
                    `<option value="${school.id || school.code}">${school.nom || school.name}</option>`
                ).join('');
        } else {
            ecoleSelect.innerHTML = `
                <option value="">Tous</option>
                <option value="EGEI">EGEI</option>
                <option value="ESMEA">ESMEA</option>
                <option value="FSAE">FSAE</option>
                <option value="FDE">FDE</option>
            `;
        }
    } catch (error) {
        console.error('Erreur chargement écoles:', error);
    }
}

async function loadCompletedElections() {
    try {
        const filters = {
            type: document.getElementById('filter-type').value,
            ecole: document.getElementById('filter-ecole').value,
            annee: document.getElementById('filter-annee').value
        };

        // Supprimer les filtres vides
        Object.keys(filters).forEach(key => {
            if (!filters[key]) delete filters[key];
        });

        const response = await APIService.getCompletedElections(filters);

        // Gérer différentes structures de réponse
        let elections = [];
        if (Array.isArray(response)) {
            elections = response;
        } else if (response.data && Array.isArray(response.data)) {
            elections = response.data;
        }

        allElections = elections;
        console.log(`📋 ${allElections.length} élections terminées chargées`);

        return allElections;
    } catch (error) {
        console.error('Erreur chargement élections:', error);
        allElections = [];
        return [];
    }
}

async function loadElectionResults(electionId) {
    if (!electionId) {
        console.warn('⚠️ ID élection manquant');
        return;
    }

    showLoading();

    try {
        const response = await APIService.getElectionResults(electionId);

        if (response && response.success && response.data) {
            const transformedData = transformBackendData(response.data);

            if (transformedData) {
                currentResults = transformedData;
                displayResults(transformedData);
                document.getElementById('noResultsMessage').style.display = 'none';
            } else {
                showNoResults();
            }
        } else {
            showNoResults();
        }
    } catch (error) {
        console.error('Erreur chargement résultats:', error);

        if (error.message.includes('403') || error.message.includes('non disponibles')) {
            showResultsPending();
            showToast('⏳ Les résultats seront publiés prochainement', 'info');
        } else {
            showToast('Erreur de chargement des résultats', 'error');
            showNoResults();
        }
    } finally {
        hideLoading();
    }
}

// ============================================
// AFFICHAGE DES RÉSULTATS
// ============================================
function displayResults(results) {
    if (!results || !results.resultats || !Array.isArray(results.resultats)) {
        showNoResults();
        return;
    }

    const { election, resultats, statistiques } = results;

    // Afficher les sections
    document.querySelector('.stats-grid').style.display = 'grid';
    document.querySelector('.charts-section').style.display = 'block';
    document.querySelector('.ranking-section').style.display = 'block';
    document.getElementById('noResultsMessage').style.display = 'none';

    // Mettre à jour les informations de l'élection
    document.getElementById('electionTitle').textContent = `Résultats: ${election.titre || 'Élection'}`;
    document.getElementById('electionDescription').textContent = election.description || 'Aucune description disponible';
    document.getElementById('resultsDate').textContent = `Date de publication: ${formatDate(new Date())}`;
    document.getElementById('totalVoters').textContent = `Électeurs: ${statistiques.totalInscrits || 0}`;
    document.getElementById('participationRate').textContent = `Taux de participation: ${statistiques.tauxParticipation || 0}%`;

    // Mettre à jour les cartes statistiques
    document.getElementById('statTotalVotes').textContent = statistiques.totalVotes || 0;
    document.getElementById('statTotalVoters').textContent = statistiques.totalInscrits || 0;
    document.getElementById('statParticipation').textContent = `${statistiques.tauxParticipation || 0}%`;
    document.getElementById('statCandidates').textContent = resultats.length;

    // Afficher le gagnant
    if (resultats.length > 0) {
        displayWinner(resultats[0]);
    } else {
        document.getElementById('winnerBanner').style.display = 'none';
    }

    // Afficher le classement
    displayRanking(resultats);

    // Créer les graphiques
    createCharts(resultats);
}

function displayWinner(winner) {
    const winnerBanner = document.getElementById('winnerBanner');
    winnerBanner.style.display = 'block';

    document.getElementById('winnerName').textContent = `${winner.prenom} ${winner.nom}`;
    document.getElementById('winnerVotes').textContent = winner.details.totalVotes;
    document.getElementById('winnerPercentage').textContent = `${winner.scoreFinal}%`;
    document.getElementById('winnerSlogan').textContent = `"${winner.slogan || 'Aucun slogan'}"`;
}

function displayRanking(candidates) {
    const rankingBody = document.getElementById('rankingBody');
    rankingBody.innerHTML = '';

    if (!candidates || candidates.length === 0) {
        rankingBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Aucun candidat</td></tr>';
        return;
    }

    candidates.forEach((candidate, index) => {
        const row = document.createElement('tr');

        const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
        const anneeText = candidate.annee ? `L${candidate.annee}` : 'Année non renseignée';

        row.innerHTML = `
            <td class="candidate-rank ${rankClass}">${index + 1}</td>
            <td>
                <div class="candidate-info">
                    <img src="${candidate.photoUrl}" 
                         alt="${candidate.prenom} ${candidate.nom}" 
                         class="candidate-avatar">
                    <div>
                        <div class="candidate-name">${candidate.prenom} ${candidate.nom}</div>
                        <div class="candidate-details">${candidate.filiere} - ${anneeText}</div>
                    </div>
                </div>
            </td>
            <td class="vote-count">${candidate.details.totalVotes}</td>
            <td class="vote-percentage">${candidate.scoreFinal}%</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${candidate.scoreFinal}%"></div>
                </div>
            </td>
        `;

        rankingBody.appendChild(row);
    });

    // Animer les barres
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            bar.style.transition = 'width 1.5s ease-in-out';
        });
    }, 100);
}

// ============================================
// GRAPHIQUES
// ============================================
function createCharts(candidates) {
    if (votesChart) votesChart.destroy();
    if (comparisonChart) comparisonChart.destroy();

    if (!candidates || candidates.length === 0) return;

    const labels = candidates.map(c => `${c.prenom} ${c.nom}`);
    const votesData = candidates.map(c => c.details.totalVotes);
    const percentages = candidates.map(c => c.scoreFinal);
    const colors = generateColors(candidates.length);

    // Graphique circulaire
    const votesCtx = document.getElementById('votesChart').getContext('2d');
    votesChart = new Chart(votesCtx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: percentages,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.raw}% (${votesData[ctx.dataIndex]} votes)`
                    }
                }
            }
        }
    });

    // Graphique à barres
    const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
    comparisonChart = new Chart(comparisonCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pourcentage de votes',
                data: percentages,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Pourcentage (%)' }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.raw}% (${votesData[ctx.dataIndex]} votes)`
                    }
                }
            }
        }
    });
}

function generateColors(count) {
    const colors = [
        'rgba(128, 0, 32, 0.8)',
        'rgba(13, 27, 42, 0.8)',
        'rgba(212, 175, 55, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(99, 102, 241, 0.8)',
        'rgba(139, 92, 246, 0.8)'
    ];

    if (count > colors.length) {
        for (let i = colors.length; i < count; i++) {
            const hue = Math.floor(Math.random() * 360);
            colors.push(`hsla(${hue}, 70%, 65%, 0.8)`);
        }
    }

    return colors.slice(0, count);
}

// ============================================
// MESSAGES D'ÉTAT
// ============================================
function showNoResults(filtersApplied = false) {
    const message = document.getElementById('noResultsMessage');
    message.innerHTML = `
        <i class="fas fa-inbox"></i>
        <h3>${filtersApplied ? 'Aucun résultat avec ces filtres' : 'Aucun résultat disponible'}</h3>
        <p>${filtersApplied ?
            'Aucune élection terminée ne correspond à vos critères.' :
            'Aucun résultat disponible pour le moment.'}
        </p>
        ${filtersApplied ? '<button class="btn btn-primary" onclick="resetFilters()" style="margin-top: 1rem;">Réinitialiser les filtres</button>' : ''}
    `;
    message.style.display = 'block';

    // Masquer les sections
    document.getElementById('winnerBanner').style.display = 'none';
    document.querySelector('.stats-grid').style.display = 'none';
    document.querySelector('.charts-section').style.display = 'none';
    document.querySelector('.ranking-section').style.display = 'none';
}

function showResultsPending() {
    const message = document.getElementById('noResultsMessage');
    message.innerHTML = `
        <i class="fas fa-hourglass-half" style="color: var(--warning);"></i>
        <h3>Résultats en attente de publication</h3>
        <p>Les résultats de cette élection ne sont pas encore publiés.</p>
    `;
    message.style.display = 'block';

    document.getElementById('winnerBanner').style.display = 'none';
    document.querySelector('.stats-grid').style.display = 'none';
    document.querySelector('.charts-section').style.display = 'none';
    document.querySelector('.ranking-section').style.display = 'none';
}

// ============================================
// SÉLECTEUR D'ÉLECTIONS
// ============================================
function populateElectionSelector() {
    const selector = document.getElementById('election-select');
    selector.innerHTML = '';

    if (allElections.length === 0) {
        selector.innerHTML = '<option value="">Aucune élection terminée</option>';
        selector.disabled = true;
        return;
    }

    selector.disabled = false;
    allElections.forEach((election, index) => {
        const option = document.createElement('option');
        option.value = election.id;

        const dateEnd = new Date(election.dateFin);
        const dateStr = dateEnd.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        option.textContent = `${election.titre} (${dateStr}) - ${election.type || 'N/A'}`;

        if (index === 0) option.selected = true;

        selector.appendChild(option);
    });
}

// ============================================
// FILTRES
// ============================================
async function applyFilters() {
    showLoading();
    try {
        await loadCompletedElections();
        populateElectionSelector();

        if (allElections.length > 0) {
            await loadElectionResults(allElections[0].id);
            showToast('Filtres appliqués avec succès', 'success');
        } else {
            showNoResults(true);
        }
    } catch (error) {
        console.error('Erreur application filtres:', error);
        showToast('Erreur lors de l\'application des filtres', 'error');
    } finally {
        hideLoading();
    }
}

async function resetFilters() {
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-ecole').value = '';
    document.getElementById('filter-annee').value = '';

    await loadPageData();
    showToast('Filtres réinitialisés', 'success');
}

// ============================================
// CHARGEMENT PRINCIPAL
// ============================================
async function loadPageData() {
    showLoading();

    try {
        // Charger les élections terminées
        await loadCompletedElections();

        // Populer le sélecteur
        populateElectionSelector();

        // Charger les résultats
        const urlParams = new URLSearchParams(window.location.search);
        const electionId = urlParams.get('electionId');

        if (electionId) {
            const selector = document.getElementById('election-select');
            if (selector) selector.value = electionId;
            await loadElectionResults(electionId);
        } else if (allElections.length > 0) {
            await loadElectionResults(allElections[0].id);
        } else {
            showNoResults();
        }

    } catch (error) {
        console.error('Erreur chargement données:', error);
        showToast('Erreur de chargement des données', 'error');
    } finally {
        hideLoading();
    }
}

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', async function () {
    console.log('🚀 Initialisation de results.html');

    // Vérifier l'authentification
    const token = getToken();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Charger le profil utilisateur
    await loadUserProfile();

    // Charger les écoles pour les filtres
    await loadSchools();

    // Charger les données principales
    await loadPageData();

    // Event listeners pour les filtres
    document.getElementById('applyFilters')?.addEventListener('click', applyFilters);
    document.getElementById('resetFilters')?.addEventListener('click', resetFilters);

    document.getElementById('filter-type')?.addEventListener('change', async () => {
        await loadCompletedElections();
        populateElectionSelector();
        if (allElections.length > 0) {
            await loadElectionResults(allElections[0].id);
        }
    });

    document.getElementById('filter-ecole')?.addEventListener('change', async () => {
        await loadCompletedElections();
        populateElectionSelector();
        if (allElections.length > 0) {
            await loadElectionResults(allElections[0].id);
        }
    });

    document.getElementById('filter-annee')?.addEventListener('change', async () => {
        await loadCompletedElections();
        populateElectionSelector();
        if (allElections.length > 0) {
            await loadElectionResults(allElections[0].id);
        }
    });

    // Sélecteur d'élection
    document.getElementById('election-select')?.addEventListener('change', async (e) => {
        const electionId = e.target.value;
        if (electionId) {
            await loadElectionResults(parseInt(electionId));
        }
    });

    // Actualiser
    document.getElementById('refreshResults')?.addEventListener('click', async function () {
        await loadPageData();
        showToast('Résultats actualisés avec succès', 'success');
    });

    // Menu mobile
    const burger = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    burger?.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay?.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Déconnexion
    document.getElementById('logoutBtn')?.addEventListener('click', function () {
        localStorage.removeItem('token');
        localStorage.removeItem('studentName');
        window.location.href = 'login.html';
    });

    // Notifications
    document.getElementById('notificationBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('notificationsPanel').classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notifications-panel') && !e.target.closest('.notification-btn')) {
            document.getElementById('notificationsPanel')?.classList.remove('active');
        }
    });

    console.log('✅ Initialisation terminée');
});

// Exposer les fonctions globales
window.loadPageData = loadPageData;
window.resetFilters = resetFilters;
