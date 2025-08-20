// results.js - Logique de la section "Résultats"
import { showLoading, hideLoading, showNotification, API_BASE, CONFIG } from './utils.js';

let APP_STATE = window.APP_STATE;

export function initResults() {
    console.log("Initialisation de la section résultats");
    loadResults();
    setupResultsEventListeners();
}

async function loadResults() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}${CONFIG.API.ENDPOINTS.RESULTS.LIST}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            APP_STATE.results = data.results || [];
            updateResultsUI();
        } else {
            throw new Error('Erreur lors du chargement des résultats');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur de chargement des résultats', 'error');
    } finally {
        hideLoading();
    }
}

export function updateResultsUI() {
    const container = document.getElementById('results-container');

    if (!APP_STATE.results || APP_STATE.results.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-pie"></i>
                <h3>Aucune donnée à afficher</h3>
                <p>Sélectionnez une école ou faculté pour voir les résultats</p>
            </div>
        `;
        return;
    }

    // Afficher les résultats disponibles
    container.innerHTML = APP_STATE.results.map(result => {
        const election = APP_STATE.elections.find(e => e.id == result.electionId);
        if (!election) return '';

        return `
            <div class="result-section">
                <h3>${election.titre}</h3>
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Candidat</th>
                            <th>Voix</th>
                            <th>Pourcentage</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${result.candidates.map(candidate => {
            const isWinner = candidate.votes === Math.max(...result.candidates.map(c => c.votes));
            return `
                                <tr>
                                    <td>
                                        <div class="candidate-info">
                                            <img src="${candidate.photoUrl || 'https://randomuser.me/api/portraits/men/32.jpg'}" 
                                                 alt="${candidate.prenom} ${candidate.nom}" class="candidate-photo">
                                            <span>${candidate.prenom} ${candidate.nom}</span>
                                        </div>
                                    </td>
                                    <td>${candidate.votes}</td>
                                    <td>${calculatePercentage(candidate.votes, result.totalVotes)}%</td>
                                    <td>${isWinner ? '<span class="winner-badge">Gagnant</span>' : ''}</td>
                                </tr>
                            `;
        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }).join('');
}

function calculatePercentage(votes, total) {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
}

function setupResultsEventListeners() {
    // Boutons de filtrage hiérarchique
    document.querySelectorAll('.hierarchy-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const school = this.dataset.school;
            filterResultsBySchool(school);
        });
    });
}

function filterResultsBySchool(school) {
    showNotification(`Filtrage des résultats pour: ${school}`, 'info');
    // Implémenter la logique de filtrage
}