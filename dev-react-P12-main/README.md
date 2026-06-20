# Kasa - Plateforme de Location de Logements entre Particuliers

Kasa est une application web moderne de location de vacances entre particuliers en France. Ce projet comprend un frontend dynamique développé en Next.js (React) et un backend RESTful utilisant Express et SQLite.

---

## Description du Projet

Kasa permet aux utilisateurs de :
- Rechercher et consulter des annonces détaillées d'hébergements (titre, localisation, prix, équipements, tags, photos et notes).
- Ajouter des hébergements aux favoris (persistance locale).
- Échanger des messages en temps réel avec les hôtes grâce à une messagerie intégrée.
- Ajouter, modifier ou supprimer des annonces de logements (pour les utilisateurs disposant du rôle Propriétaire ou Administrateur), incluant le téléversement d'images et la prévisualisation.
- Consulter le site de manière optimale sur tous types d'écrans (ordinateur, tablette, mobile) grâce à un design responsive premium et moderne.

---

## Pré-requis pour l'Installation

Avant de commencer, assurez-vous d'avoir installé sur votre machine :
- **Node.js** (Version 18.x ou supérieure recommandée)
- **npm** (inclus avec Node.js)

---

## Installation

Le projet est divisé en deux parties : le **frontend** et le **backend**.

### 1. Cloner le projet et installer le Backend
Accédez au répertoire du backend et installez les dépendances :
```bash
cd backend
npm install
```

### 2. Installer le Frontend
Accédez au répertoire du frontend et installez les dépendances :
```bash
cd ../frontend
npm install
```

---

## Lancement du Projet

Pour exécuter l'application localement, vous devez lancer simultanément le serveur backend et le serveur de développement frontend.

### 1. Démarrer le Backend
Depuis le dossier `backend` :
```bash
npm start
```
Le backend s'initialise (crée la base de données SQLite `data/kasa.sqlite3` et injecte les données de démo si nécessaire) et écoute sur `http://localhost:3001` (ou `http://localhost:3000` selon la configuration du port).

### 2. Démarrer le Frontend
Depuis le dossier `frontend` :
```bash
npm run dev
```
Le frontend Next.js démarre sur `http://localhost:3000`. Vous pouvez y accéder directement depuis votre navigateur.

---

## Tests Unitaires

Le projet dispose d'une suite de tests unitaires couvrant la logique fonctionnelle critique.
Les tests utilisent des assertions `expect()` pour valider le comportement :
- **Favoris** : Vérification de l'ajout, de la suppression, de la détection de doublons et du basculement (toggle).
- **Diaporama (Galerie)** : Vérification du formatage des URLs d'images et du calcul cyclique de l'index d'image suivante/précédente.

Pour lancer les tests :
1. Accédez au dossier `frontend` :
   ```bash
   cd frontend
   ```
2. Exécutez la commande suivante :
   ```bash
   npm test
   ```
