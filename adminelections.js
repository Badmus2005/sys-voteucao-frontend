// elections.js - Logique de la section "Mes élections"
import { showLoading, hideLoading, showNotification, API_BASE, CONFIG } from './utils.js';

let APP_STATE = window.APP_STATE;

export function initElections() {
    console.log("Initialisation de la section élections");
    updateElectionsUI();
    setupElectionsEventListeners();
    loadElectionsFilters();
}

export function updateElectionsUI() {
    const container = document.getElementById('all-elections-list');
    const statusFilter = document.getElementById('status-filter').value;
    const typeFilter = document.getElementById('type-filter').value;

    let filteredElections = APP_STATE.elections;

    if (statusFilter !== 'all') {
        filteredElections = filteredElections.filter(e => e.status === statusFilter);
    }

    if (typeFilter !== 'all') {
        filteredElections = filteredElections.filter(e => e.type === typeFilter);
    }

    if (filteredElections.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Aucune élection trouvée</p></div>';
    } else {
        container.innerHTML = filteredElections.map(election => {
            let badgeClass = '';
            if (election.status === 'active') badgeClass = 'badge-active';
            else if (election.status === 'upcoming') badgeClass = 'badge-upcoming';
            else if (election.status === 'ended') badgeClass = 'badge-ended';

            return `
                <div class="election-item">
                    <div class="election-info">
                        <h3 class="election-title">${election.titre}</h3>
                        <div class="election-meta">
                            <span><i class="fas fa-calendar-alt"></i> Début: ${new Date(election.dateDebut).toLocaleDateString()}</span>
                            <span><i class="fas fa-calendar-alt"></i> Fin: ${new Date(election.dateFin).toLocaleDateString()}</span>
                            <span class="election-badge ${badgeClass}">${getStatusText(election.status)}</span>
                        </div>
                    </div>
                    ${election.status === 'active' && !election.hasVoted ?
                    '<button class="btn btn-primary vote-btn" data-election-id="${election.id}"><i class="fas fa-pen"></i> Voter</button>' :
                    '<button class="btn btn-outline" data-election-id="${election.id}"><i class="fas fa-eye"></i> Détails</button>'
                }
                </div>
            `;
        }).join('');
    }
}

function getStatusText(status) {
    const statusMap = {
        'active': 'Active',
        'upcoming': 'À venir',
        'ended': 'Terminée'
    };
    return statusMap[status] || status;
}

function loadElectionsFilters() {
    // Remplir les filtres si nécessaire
}

function setupElectionsEventListeners() {
    // Filtres
    document.getElementById('status-filter').addEventListener('change', updateElectionsUI);
    document.getElementById('type-filter').addEventListener('change', updateElectionsUI);

    // Actions sur les élections
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('vote-btn')) {
            const electionId = e.target.dataset.electionId;
            handleVoteClick(electionId);
        } else if (e.target.closest('.btn-outline')) {
            const electionId = e.target.closest('.btn-outline').dataset.electionId;
            showElectionDetails(electionId);
        }
    });
}

function handleVoteClick(electionId) {
    const election = APP_STATE.elections.find(e => e.id == electionId);
    if (election) {
        showNotification(`Redirection vers le vote pour: ${election.titre}`, 'info');
        // Redirection vers la page de vote
    }
}

function showElectionDetails(electionId) {
    const election = APP_STATE.elections.find(e => e.id == electionId);
    if (election) {
        showNotification(`Détails de l'élection: ${election.titre}`, 'info');
        // Afficher les détails de l'élection
    }
}