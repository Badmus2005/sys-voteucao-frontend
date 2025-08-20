// dashboard.js - Logique du tableau de bord
import { showLoading, hideLoading, showNotification, API_BASE, CONFIG } from './utils.js';

let APP_STATE = window.APP_STATE;

export function initDashboard() {
    console.log("Initialisation du tableau de bord");
    updateDashboardUI();
    setupDashboardEventListeners();
}

export function updateDashboardUI() {
    const activeElections = APP_STATE.elections.filter(e => e.status === 'active');
    const votedElections = APP_STATE.elections.filter(e => e.hasVoted);

    document.getElementById('active-elections-count').textContent = activeElections.length;
    document.getElementById('votes-count').textContent = votedElections.length;

    const upcoming = APP_STATE.elections
        .filter(e => e.status === 'upcoming')
        .sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut))[0];

    if (upcoming) {
        const daysLeft = Math.ceil((new Date(upcoming.dateDebut) - new Date()) / (1000 * 60 * 60 * 24));
        document.getElementById('next-election').textContent = daysLeft;
        document.getElementById('next-election-label').textContent = upcoming.titre;
    }

    // Afficher élections en cours
    const container = document.getElementById('current-elections');
    if (activeElections.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Aucune élection active</p></div>';
    } else {
        container.innerHTML = activeElections.map(election => `
            <div class="election-item">
                <div class="election-info">
                    <h3 class="election-title">${election.titre}</h3>
                    <div class="election-meta">
                        <span><i class="fas fa-calendar-alt"></i> Clôture: ${new Date(election.dateFin).toLocaleDateString()}</span>
                        <span class="election-badge badge-active">Active</span>
                    </div>
                </div>
                ${election.hasVoted ?
                '<span class="election-badge" style="background: rgba(56, 161, 105, 0.2); color: var(--success);"><i class="fas fa-check"></i> Vote effectué</span>' :
                '<button class="btn btn-primary vote-btn" data-election-id="${election.id}"><i class="fas fa-pen"></i> Voter</button>'
            }
            </div>
        `).join('');
    }
}

function setupDashboardEventListeners() {
    // Écouteurs d'événements spécifiques au tableau de bord
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('vote-btn')) {
            const electionId = e.target.dataset.electionId;
            handleVoteClick(electionId);
        }
    });
}

function handleVoteClick(electionId) {
    const election = APP_STATE.elections.find(e => e.id == electionId);
    if (election) {
        showNotification(`Redirection vers le vote pour: ${election.titre}`, 'info');
        // Ici, vous redirigeriez normalement vers la page de vote
    }
}