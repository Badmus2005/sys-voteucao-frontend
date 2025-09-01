// assets/js/services/eligibilityService.js
class EligibilityService {
    static isEligibleForElection(user, election) {
        if (!user || !election) return false;

        // Vérification basique des dates de candidature/vote
        const now = new Date();
        const debutCandidature = new Date(election.dateDebutCandidature);
        const finCandidature = new Date(election.dateFinCandidature);
        const debutVote = new Date(election.dateDebut);
        const finVote = new Date(election.dateFin);

        // Vérification du type d'élection et des critères spécifiques
        switch (election.type) {
            case 'SALLE':
                return user.filiere === election.filiere &&
                    user.annee === election.annee &&
                    user.ecole === election.ecole;

            case 'ECOLE':
                // Pour les délégués d'école, vérifier si c'est un responsable de salle
                const isResponsable = user.estResponsableSalle;
                if (election.delegueType === 'PREMIER') {
                    return isResponsable && user.annee === 3 && user.ecole === election.ecole;
                } else {
                    return isResponsable && user.annee === 2 && user.ecole === election.ecole;
                }

            case 'UNIVERSITE':
                // Pour les délégués universitaires, vérifier si c'est un délégué d'école
                const isDelegueEcole = user.estDelegueEcole;
                if (election.delegueType === 'PREMIER') {
                    return isDelegueEcole && user.positionDelegue === '1er';
                } else {
                    return isDelegueEcole && user.positionDelegue === '2ème';
                }

            default:
                return false;
        }
    }

    static canVoteInElection(user, election) {
        if (!user || !election) return false;

        const now = new Date();
        const debutVote = new Date(election.dateDebut);
        const finVote = new Date(election.dateFin);

        return this.isEligibleForElection(user, election) &&
            now >= debutVote &&
            now <= finVote &&
            !election.hasVoted;
    }

    static canCandidateInElection(user, election) {
        if (!user || !election) return false;

        const now = new Date();
        const debutCandidature = new Date(election.dateDebutCandidature);
        const finCandidature = new Date(election.dateFinCandidature);

        return this.isEligibleForElection(user, election) &&
            now >= debutCandidature &&
            now <= finCandidature &&
            !election.hasCandidated;
    }

    static getEligibilityMessage(user, election) {
        if (!this.isEligibleForElection(user, election)) {
            return "Vous n'êtes pas éligible pour cette élection.";
        }

        const now = new Date();
        const debutCandidature = new Date(election.dateDebutCandidature);
        const finCandidature = new Date(election.dateFinCandidature);
        const debutVote = new Date(election.dateDebut);
        const finVote = new Date(election.dateFin);

        if (now < debutCandidature) {
            return `La période de candidature débutera le ${debutCandidature.toLocaleDateString('fr-FR')}.`;
        }

        if (now > finCandidature && now < debutVote) {
            return "La période de candidature est terminée.";
        }

        if (now >= debutVote && now <= finVote) {
            return "La période de vote est en cours.";
        }

        if (now > finVote) {
            return "L'élection est terminée.";
        }

        return "Vous êtes éligible pour cette élection.";
    }
}