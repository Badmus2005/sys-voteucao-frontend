# Guide d'intégration des notifications dans les pages admin

## ✅ Pages déjà intégrées :
- dashboardAdmin.html ✓
- elections.html ✓
- candidats.html ✓
- users.html ✓

## 📋 Pages restantes à intégrer :
- stats.html
- results.html
- profile.html
- parametre.html
- activity.html

## 🔧 Étapes d'intégration pour chaque page :

### 1. Ajouter les styles CSS (après `.notification-badge`)

Trouver cette section dans le fichier :
```css
.notification-badge {
    position: absolute;
    ...
}

/* Menu utilisateur */
```

Remplacer par :
```css
.notification-badge {
    position: absolute;
    ...
}

/* Notification Panel */
.notification-panel {
    position: fixed;
    top: 100px;
    right: 20px;
    width: 350px;
    background: var(--card-bg);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: var(--transition);
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid rgba(0, 0, 0, 0.07);
}

.notification-panel.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.notification-header {
    padding: 15px;
    border-bottom: 1px solid var(--light-bg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--blue-night);
}

.notification-item {
    padding: 15px;
    border-bottom: 1px solid var(--light-bg);
    cursor: pointer;
    transition: var(--transition);
}

.notification-item:hover {
    background-color: var(--light-bg);
}

.notification-item.unread {
    background-color: rgba(139, 0, 0, 0.05);
}

.notification-content {
    font-size: 0.9rem;
    margin-bottom: 5px;
    color: var(--text-primary);
}

.notification-time {
    font-size: 0.75rem;
    color: var(--text-muted);
}

/* Menu utilisateur */
```

### 2. Ajouter le HTML du panel (avant `</body>`)

Trouver la fin du fichier avant `</body>` et ajouter :

```html
    </script>

    <!-- Notification Panel -->
    <div class="notification-panel" id="notificationPanel">
        <div class="notification-header">
            <h3>Notifications</h3>
            <button id="markAllReadBtn" style="background: none; border: none; color: var(--bordeaux); cursor: pointer; font-size: 0.85rem; font-weight: 600;">Tout marquer comme lu</button>
        </div>
        <div id="notificationList"></div>
        <div id="notificationPagination" style="padding: 10px 15px; border-top: 1px solid var(--light-bg); display: none;">
            <button id="loadMoreNotifications" style="width: 100%; padding: 8px; background: var(--bordeaux); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">
                <i class="fas fa-angle-down"></i> Charger plus
            </button>
        </div>
    </div>

    <!-- Script de gestion des notifications -->
    <script src="/assets/js/admin-notifications.js"></script>
</body>

</html>
```

## 📝 Fichiers créés :

### `/assets/js/admin-notifications.js`
Ce fichier JavaScript contient tout le système de notifications :
- Gestion localStorage pour les notifications lues
- Pagination (15 par page)
- Chargement du badge
- Marquage comme lu (individuel et global)
- Event listeners

### Fonctionnalités incluses :
✅ Badge de notifications avec compteur
✅ Panel déroulant avec liste paginée
✅ Système localStorage (persistance entre sessions)
✅ Marquage individuel au clic
✅ Bouton "Tout marquer comme lu"
✅ Bouton "Charger plus" pour pagination
✅ Animation et transitions fluides
✅ Compatible avec toutes les pages admin

## 🎯 Résultat attendu :

Une fois intégré, chaque page admin aura :
1. Un badge de notifications dans le header (icône cloche)
2. Un panel qui s'ouvre au clic sur l'icône
3. Les notifications chargées depuis l'API `/api/notifications/admin`
4. Un système de marquage "lu" persistant via localStorage
5. Une pagination automatique si > 15 notifications

## 🚀 Test :

1. Ouvrir une page admin
2. Vérifier que le badge apparaît avec le bon nombre
3. Cliquer sur la cloche → panel s'ouvre
4. Cliquer sur une notification → elle devient grise (lue)
5. Recharger la page → badge mis à jour, notification reste lue
6. Cliquer "Tout marquer comme lu" → toutes deviennent grises
7. Si > 15 notifications → bouton "Charger plus" apparaît
