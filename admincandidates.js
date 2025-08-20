// candidates.js - Logique de la section "Candidats"
import { showLoading, hideLoading, showNotification, API_BASE, CONFIG } from './utils.js';

let APP_STATE = window.APP_STATE;

export function initCandidates() {
    console.log("Initialisation de la section candidats");
    loadCandidates();
    setupCandidatesEventListeners();
}

async function loadCandidates() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}${CONFIG.API.ENDPOINTS.CANDIDATES.LIST}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            APP_STATE.candidates = data.candidates || [];
            updateCandidatesUI();
        } else {
            throw new Error('Erreur lors du chargement des candidats');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de chargement des candidats', 'error');
    } finally {
        hideLoading();
    }
}

export function updateCandidatesUI() {
    const container = document.getElementById('candidates-list');
    const electionFilter = document.getElementById('election-filter').value;
    const programFilter = document.getElementById('program-filter').value;

    let filteredCandidates = APP_STATE.candidates;

    if (electionFilter !== 'all') {
        filteredCandidates = filteredCandidates.filter(c => c.electionId == electionFilter);
    }

    if (programFilter !== 'all') {
        filteredCandidates = filteredCandidates.filter(c => c.program === programFilter);
    }

    if (filteredCandidates.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-user-slash"></i><p>Aucun candidat trouvé</p></div>';
    } else {
        container.innerHTML = filteredCandidates.map(candidate => `
            <div class="candidate-card">
                <div class="candidate-header">
                    <img src="${candidate.photoUrl || 'https://randomuser.me/api/portraits/men/32.jpg'}" 
                         alt="${candidate.prenom} ${candidate.nom}" class="candidate-photo-lg">
                </div>
                <div class="candidate-body">
                    <h3 class="candidate-name">${candidate.prenom} ${candidate.nom}</h3>
                    <p class="candidate-program">${candidate.programme || 'Aucun programme spécifié'}</p>
                    <div class="candidate-election">${getElectionName(candidate.electionId)}</div>
                    <p class="candidate-bio">${candidate.biographie || 'Aucune biographie disponible'}</p>
                    <a href="#" class="candidate-link" data-candidate-id="${candidate.id}">
                        Voir le profil complet
                    </a>
                </div>
            </div>
        `).join('');
    }
}

function getElectionName(electionId) {
    const election = APP_STATE.elections.find(e => e.id == electionId);
    return election ? election.titre : 'Élection inconnue';
}

function setupCandidatesEventListeners() {
    // Filtres
    document.getElementById('election-filter').addEventListener('change', updateCandidatesUI);
    document.getElementById('program-filter').addEventListener('change', updateCandidatesUI);

    // Actions sur les candidats
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('candidate-link')) {
            e.preventDefault();
            const candidateId = e.target.dataset.candidateId;
            showCandidateDetails(candidateId);
        }
    });
}

function showCandidateDetails(candidateId) {
    const candidate = APP_STATE.candidates.find(c => c.id == candidateId);
    if (candidate) {
        showNotification(`Profil de: ${candidate.prenom} ${candidate.nom}`, 'info');
        // Afficher les détails du candidat
    }
}