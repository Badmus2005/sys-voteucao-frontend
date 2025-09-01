// assets/js/components/ElectionCard.js
class ElectionCard {
    static create(election, options = {}) {
        const status = ElectionService.getElectionStatus(election);
        const statusText = ElectionService.getStatusText(status);
        const statusClass = `status-${status}`;

        return `
            <div class="election-card" data-election-id="${election.id}">
                <div class="election-header">
                    <div>
                        <h3 class="election-title">${election.titre || 'Sans titre'}</h3>
                        <span class="election-type">${ElectionService.getElectionTypeLabel(election.type)}</span>
                    </div>
                    <span class="election-status ${statusClass}">${statusText}</span>
                </div>
                
                <div class="election-meta">
                    <div class="meta-item">
                        <i class="fa-solid fa-graduation-cap"></i>
                        <strong>École:</strong> ${election.ecole || 'Toutes écoles'}
                    </div>
                    ${election.filiere ? `
                    <div class="meta-item">
                        <i class="fa-solid fa-layer-group"></i>
                        <strong>Filière:</strong> ${election.filiere}
                    </div>
                    ` : ''}
                    ${election.annee ? `
                    <div class="meta-item">
                        <i class="fa-solid fa-calendar"></i>
                        <strong>Année:</strong> ${election.annee}
                    </div>
                    ` : ''}
                    <div class="meta-item">
                        <i class="fa-solid fa-user-tie"></i>
                        <strong>Poste:</strong> ${ElectionService.getDelegueTypeLabel(election.delegueType)}
                    </div>
                </div>
                
                <p class="election-description">${election.description || 'Aucune description disponible'}</p>
                
                ${this.renderActions(election, status, options)}
            </div>
        `;
    }

    static renderActions(election, status, options) {
        if (!options.showActions) return '';

        let actions = '';

        switch (status) {
            case 'candidature':
                actions = `
                    <button class="btn btn-primary" onclick="location.href='candidature.html?electionId=${election.id}'">
                        <i class="fa-solid fa-file-signature"></i>
                        Se porter candidat
                    </button>
                `;
                break;

            case 'active':
                actions = `
                    <button class="btn btn-primary" onclick="location.href='vote.html?electionId=${election.id}'">
                        <i class="fa-solid fa-vote-yea"></i>
                        Voter maintenant
                    </button>
                `;
                break;

            case 'completed':
                actions = `
                    <button class="btn btn-secondary" onclick="location.href='results.html?electionId=${election.id}'">
                        <i class="fa-solid fa-chart-bar"></i>
                        Voir résultats
                    </button>
                `;
                break;

            default:
                actions = `
                    <button class="btn btn-secondary" disabled>
                        <i class="fa-solid fa-clock"></i>
                        Élection à venir
                    </button>
                `;
        }

        // Ajouter le bouton de détails si demandé
        if (options.showDetails) {
            actions += `
                <button class="btn btn-secondary" onclick="ElectionCard.showDetails(${election.id})">
                    <i class="fa-solid fa-eye"></i>
                    Détails
                </button>
            `;
        }

        return `<div class="election-actions">${actions}</div>`;
    }

    static async showDetails(electionId) {
        try {
            const election = await ElectionService.getElectionDetails(electionId);
            // Implémenter l'affichage des détails dans un modal
            console.log('Détails de l\'élection:', election);
        } catch (error) {
            showToast('Erreur lors du chargement des détails', 'error');
        }
    }
}