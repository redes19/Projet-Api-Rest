# Projet API

- [Lien vers le projet sur GitHub](https://github.com/redes19/Projet-Api-Rest)
- [Lien vers l'application publique](https://api-cinema-6qx5.onrender.com)
- [Documentation Swagger](https://api-cinema-6qx5.onrender.com/docs)

## Acces public

- Application : https://api-cinema-6qx5.onrender.com
- Swagger : https://api-cinema-6qx5.onrender.com/docs

## Lancer en local

### 1. Prerequis

- Node.js 24+
- Docker + Docker Compose

### 2. Demarrer la base Postgres (dev)

```powershell
docker compose -f docker-compose.dev.yml up -d
```

### 3 Variables d'environnement

Creer un fichier .env a la racine du projet :

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=cinema
DB_PASSWORD=cinema
DB_NAME=cinema_db
PORT=3000
SEED_DATA=false
CLEAR_DB=false
```

### 4 Installer les dependances et lancer l'API

```powershell
npm install
npm run seed
npm run dev
```

L'API tourne sur <http://localhost:3000>

## Lancer en production (Docker)

```powershell
docker build -t cinema-api:latest .
docker run -d -p 3000:3000 --name cinema-api --env-file .env cinema-api:latest
```

## Exporter la BDD

```powershell
docker compose -f docker-compose.dev.yml exec -T postgres pg_dump -U cinema -d cinema_db > cinema_db_dump.sql
```

## Architecture de l'API

```
src/
├── database/           # Configuration et entités TypeORM
│   ├── entities/       # Définitions des modèles de données (Movie, User, etc.)
│   ├── database.ts     # Configuration de la connexion
│   └── seed.ts         # Script de peuplement de la base
├── middleware/         # Middlewares Express
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validation.middleware.ts
├── modules/            # Modules métier découpés par domaine
│   ├── auth/           # Authentification
│   ├── balance/        # Portefeuille
│   ├── movie/          # Films
│   ├── room/           # Salles
│   ├── screening/      # Séances
│   ├── ticket/         # Billets
│   ├── transaction/    # Transactions
|   └── user/           # Utilisateurs
├── swagger/            # Configuration OpenAPI / Swagger
├── types/              # Définitions de types TypeScript personnalisées
└── utils/              # Fonctions utilitaires (dates, erreurs, validateurs)
```

## Fonctionnalités Réalisées

### Gestion des Salles

- [x] **CRUD Complet** : Implémentation de la création, lecture, mise à jour et suppression des salles.
- [x] **Spécifications** : Chaque salle intègre un nom, une description, des images, un type et une capacité comprise entre 15 et 30 places.
- [x] **Maintenance** : Possibilité pour les administrateurs de passer une salle en maintenance, masquant automatiquement les séances associées aux utilisateurs.
- [x] **Planning** : Consultation du planning d'une salle spécifique sur une période donnée pour les utilisateurs authentifiés.

### Gestion des Films et Séances

- [x] **Catalogue Films** : CRUD pour les administrateurs et consultation pour tous les utilisateurs.
- [x] **Séances** : Gestion des séances par les administrateurs (ajout, modification, suppression).
- [x] **Règles Métier** : Calcul automatique de la durée (film + 30 min de nettoyage/pub) et interdiction des chevauchements dans une même salle.
- [x] **Consultation** : Recherche de séances par film ou par période.

### Authentification et Utilisateurs

- [x] **Sécurité** : Authentification par token stateful avec mécanisme de refresh token.
- [x] **Gestion des Sessions** : Durée de validité des access_token fixée à 5 minutes maximum et système de logout.
- [x] **Rôles** : Distinction entre Administrateurs et Clients.

### Billetterie et Finance

- [x] **Achat** : Système de vente de billets simples et de "Super Billets" (10 séances).
- [x] **Portefeuille** : Gestion du solde utilisateur en euros (dépôt, retrait, historique des transactions).
- [x] **Contrôle** : Vérification systématique du solde avant achat.

### Statistiques et Administration Avancée

- [x] Visualisation par l'administrateur du nombre de billets vendus par séance.
- [ ] Tracking détaillé de l'activité des utilisateurs (films vus).

### Technique et Infrastructure

- [x] Mise en production avec support HTTPS.
- [x] Dockerisation de l'application (image de production sans TypeScript).
- [x] Documentation OpenAPI / Swagger.

### Bonus

- [x] Pipeline CI/CD et gestion des race conditions.
