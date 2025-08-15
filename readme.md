# 🗳️ Frontend - Système de Vote UCAO-UUC

Interface utilisateur du système de vote développé dans le cadre du projet TRC 2025 à l'UCAO-UUC.

## 🚀 Technologies

- **HTML5**, **CSS3**, **JavaScript**
- **API REST** connectée au backend Node.js/Express
- **Design responsive** et moderne
- **Thème UCAO** (rouge bordeaux, bleu nuit, or)

## 📋 Prérequis

- Navigateur web moderne
- Connexion internet pour l'API

## 🛠️ Installation

### 1. **Cloner le repository**
```bash
git clone https://github.com/Badmus2005/sys-voteucao-frontend.git
cd sys-voteucao-frontend
```

### 2. **Configuration**
Ouvrez `config.js` et vérifiez l'URL de l'API :
```javascript
BASE_URL: 'https://sys-voteucao-backend-production.up.railway.app'
```

### 3. **Servir les fichiers**
```bash
# Option 1 : Avec Python
python -m http.server 3000

# Option 2 : Avec Node.js
npx serve -s . -l 3000

# Option 3 : Avec PHP
php -S localhost:3000

# Option 4 : Ouvrir directement dans le navigateur
# Double-cliquez sur index.html
```

## 📱 Pages Disponibles

- **index.html** - Page d'accueil
- **login.html** - Connexion utilisateur
- **register.html** - Inscription étudiant
- **dashboard.html** - Tableau de bord admin
- **election.html** - Gestion des élections
- **vote.html** - Interface de vote
- **results.html** - Résultats des élections
- **candidature.html** - Dépôt de candidature
- **user_index.html** - Espace étudiant

## 🚀 Déploiement sur Vercel

### 1. **Connecter à Vercel**
- Allez sur [vercel.com](https://vercel.com)
- Connectez-vous avec GitHub
- Importez ce repository

### 2. **Configuration automatique**
Le fichier `vercel.json` configure automatiquement :
- Routes pour chaque page
- Headers de sécurité
- Redirection SPA

### 3. **Déployer**
- Vercel détectera automatiquement la configuration
- Votre site sera sur : `https://sys-voteucao-frontend.vercel.app`

## 🎨 Fonctionnalités

### 👨‍🎓 **Pour les étudiants**
- **Inscription** avec matricule ou code d'inscription
- **Connexion** sécurisée
- **Candidature** aux élections
- **Vote** avec tokens sécurisés
- **Consultation** des résultats

### 👨‍💼 **Pour les administrateurs**
- **Gestion** des élections
- **Validation** des candidatures
- **Suivi** en temps réel
- **Statistiques** détaillées

## 🔧 Configuration

### **Variables d'environnement**
```javascript
// config.js
CONFIG.API.BASE_URL = 'https://votre-backend.railway.app'
```

### **Thème personnalisable**
```css
/* Couleurs UCAO */
--primary: #800020;    /* Rouge bordeaux */
--secondary: #1a2a4a;  /* Bleu nuit */
--accent: #d4af37;     /* Or */
```

## 🏗️ Structure du Projet

```
sys-voteucao-frontend/
├── index.html         # Page d'accueil
├── login.html         # Connexion
├── register.html      # Inscription
├── dashboard.html     # Admin dashboard
├── election.html      # Gestion élections
├── vote.html          # Interface vote
├── results.html       # Résultats
├── candidature.html   # Candidature
├── user_index.html    # Espace étudiant
├── config.js          # Configuration API
├── vercel.json        # Configuration Vercel
└── readme.md          # Documentation
```

## 🔒 Sécurité

- **HTTPS** obligatoire en production
- **CORS** configuré pour l'API
- **Validation** côté client
- **Headers** de sécurité

## 📞 Support

Pour toute question :
- Ouvrir une issue sur GitHub
- Contacter l'équipe UCAO Tech

---

**Version :** 2.0.0  
**Auteur :** Dodji Virgile Tchidehou  
**Projet :** TRC 2025 - UCAO-UUC  
**Déploiement :** [sys-voteucao-frontend.vercel.app](https://sys-voteucao-frontend.vercel.app)
