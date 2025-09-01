// assets/js/components/CandidateCard.js
class CandidateCard {
    static create(candidate, options = {}) {
        return `
            <div class="candidate-card" data-candidate-id="${candidate.id}">
                <div class="candidate-header">
                    <img src="${candidate.photoUrl || 'https://via.placeholder.com/70'}" 
                         alt="${candidate.prenom} ${candidate.nom}" 
                         class="candidate-avatar"
                         onerror="this.src='https://via.placeholder.com/70'">
                    <div class="candidate-info">
                        <h3 class="candidate-name">${candidate.prenom} ${candidate.nom}</h3>
                        <div class="candidate-details">
                            ${candidate.filiere || 'Non spécifié'} - 
                            Année ${candidate.annee || 'N/A'}
                        </div>
                    </div>
                </div>
                
                ${candidate.slogan ? `
                <div class="candidate-slogan">"${candidate.slogan}"</div>
                ` : ''}
                
                ${options.showProgram ? this.renderProgramPreview(candidate.programme) : ''}
                
                ${options.showActions ? this.renderActions(candidate, options) : ''}
            </div>
        `;
    }

    static renderProgramPreview(program) {
        if (!program) return '';

        return `
            <div class="candidate-program">
                <div class="program-preview">
                    ${program.substring(0, 150)}...
                </div>
                <a href="#" class="view-program-link" onclick="CandidateCard.viewFullProgram(event)">
                    <i class="fa-solid fa-book-open"></i>
                    Voir le programme complet
                </a>
            </div>
        `;
    }

    static renderActions(candidate, options) {
        let actions = '';

        if (options.showViewProfile) {
            actions += `
                <button class="btn btn-secondary" onclick="location.href='profil-candidat.html?id=${candidate.id}'">
                    <i class="fa-solid fa-user"></i>
                    Voir profil
                </button>
            `;
        }

        if (options.showVote && options.electionId) {
            actions += `
                <button class="btn btn-primary" onclick="CandidateCard.voteForCandidate(${options.electionId}, ${candidate.id})">
                    <i class="fa-solid fa-check"></i>
                    Voter
                </button>
            `;
        }

        return actions ? `<div class="candidate-actions">${actions}</div>` : '';
    }

    static viewFullProgram(event) {
        event.preventDefault();
        // Implémenter l'affichage du programme complet
        console.log('Voir programme complet');
    }

    static async voteForCandidate(electionId, candidateId) {
        try {
            // Implémenter la logique de vote
            console.log(`Vote pour l'élection ${electionId}, candidat ${candidateId}`);
        } catch (error) {
            showToast('Erreur lors du vote', 'error');
        }
    }

    // Dans assets/js/components/CandidateCard.js - Ajouter cette méthode
    static createForModal(candidate) {
        return `
        <div class="candidate-modal-header">
            <img src="${candidate.photoUrl || 'https://via.placeholder.com/100'}" 
                 alt="${candidate.prenom} ${candidate.nom}" 
                 class="candidate-modal-image"
                 onerror="this.src='https://via.placeholder.com/100'">
            <div class="candidate-modal-info">
                <h2 class="candidate-modal-name">${candidate.prenom} ${candidate.nom}</h2>
                <div class="candidate-modal-slogan">"${candidate.slogan}"</div>
                <div>
                    <strong>${candidate.filiere || 'Non spécifié'}</strong> - 
                    Année ${candidate.annee || 'N/A'}
                </div>
            </div>
        </div>

        <div class="candidate-modal-section">
            <h4><i class="fa-solid fa-book"></i> Programme électoral</h4>
            <div class="candidate-modal-content-text">${candidate.programme || 'Aucun programme disponible'}</div>
        </div>

        <div class="candidate-modal-section">
            <h4><i class="fa-solid fa-heart"></i> Motivation</h4>
            <div class="candidate-modal-content-text">${candidate.motivation || 'Aucune motivation disponible'}</div>
        </div>
    `;
    }

    // Dans assets/js/components/CandidateCard.js - Ajouter cette méthode
    static createForVote(candidate, options = {}) {
        const baseCard = this.create(candidate, options);

        // Ajouter des styles spécifiques pour le vote
        return baseCard.replace('candidate-card', 'candidate-card vote-candidate');
    }
}