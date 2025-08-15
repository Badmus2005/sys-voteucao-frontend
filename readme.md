# SYS-VOTE UCAO Frontend

Interface utilisateur du système de vote développé dans le cadre du projet TRC 2025 à l'UCAO-UUC.

## 🔗 Technologies
- HTML, CSS, JavaScript
- API connectée à un backend Node.js/Express hébergé sur Railway

## 🚀 Déploiement
Frontend hébergé sur Vercel  
Backend hébergé sur Railway

## 👨‍💻 Auteur
Dodji Virgile Tchidehou – Étudiant en Informatique Industrielle & Maintenance

## 📝 Changelog

### Version 2.0.1 (2025-12-08)
- ✅ Correction de login.html : suppression de la gestion admin (exclusivement pour étudiants)
- ✅ Redirection directe vers user_index.html après connexion étudiante
- ✅ Cohérence avec la logique : admins se connectent via index.html

### Version 2.0.0 (2025-12-08)
- ✅ Reconfiguration complète pour utiliser config.js centralisé
- ✅ Mise à jour de tous les fichiers HTML pour utiliser CONFIG.API.BASE_URL
- ✅ Amélioration des messages d'erreur et de succès avec CONFIG.MESSAGES
- ✅ Intégration des utilitaires UTILS pour validation et formatage
- ✅ Standardisation des appels API dans tous les fichiers
- ✅ Amélioration de l'UX avec états de chargement et validation

