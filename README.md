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

### Données initiales (seed)

Le script `npm run seed` est idempotent et peuple la BDD avec :

- **3 utilisateurs** (mot de passe : `password123`) :
  - `admin@cinema.com` (rôle admin)
  - `employee@cinema.com` (rôle employee)
  - `client@cinema.com` (rôle client, solde de 100 €)
- **7 films** de durées et genres variés (Inception, La Reine des Neiges, Dune, Le Roi Lion, Interstellar, Le Parrain, Toy Story)
- **12 salles** (capacité 15-30, types 2D/3D/IMAX/4DX/VIP, accès handicapé varié)
- **1 mois de séances** programmées du lundi au vendredi (3 créneaux par jour : 10h, 14h, 17h30) en respectant toutes les règles métier (créneau, durée, anti-chevauchement)

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
- [x] **Filtres avancés sur les films** : recherche partielle par titre, par genre, par durée maximum, par fenêtre de date de sortie.
- [x] **Séances** : Gestion des séances par les administrateurs (ajout, modification, suppression).
- [x] **Règles Métier** :
  - Validation stricte du créneau d'ouverture du cinéma (séance entièrement comprise entre 9h00 et 20h00).
  - Durée minimale d'une séance ≥ durée du film + 30 minutes (publicités et nettoyage).
  - Anti-chevauchement de séances dans une même salle.
  - Anti-chevauchement d'un même film projeté simultanément dans plusieurs salles.
  - Salle en maintenance : aucune séance ne peut y être créée et les séances existantes sont masquées aux utilisateurs.
- [x] **Consultation** :
  - Toutes les séances d'un film sur une période choisie (`GET /movies/:id/screenings`).
  - Planning d'une salle sur une période choisie (`GET /rooms/:id/screenings`).
  - Liste générique des séances filtrable par film, salle et période (`GET /screenings`).

### Authentification et Utilisateurs

- [x] **Inscription** : Création de compte (`POST /auth/register`) avec mot de passe hashé (bcrypt) et émission immédiate d'une paire access + refresh token.
- [x] **Connexion** : Login (`POST /auth/login`) avec validation des identifiants et émission de tokens.
- [x] **Refresh token** : Renouvellement de session (`POST /auth/refresh`) avec rotation (l'ancien refresh est révoqué à chaque utilisation).
- [x] **Logout** : Révocation de tous les tokens du user (`POST /auth/logout`).
- [x] **Sécurité** : Authentification par token stateful (tokens stockés en BDD, révocables) avec mécanisme de refresh token.
- [x] **Gestion des Sessions** : Durée de validité des access_token fixée à 5 minutes maximum.
- [x] **Rôles** : Middleware `RequireRole` paramétrable. Distinction entre Client, Employee et Administrateur. Application aux routes admin (création/modification/suppression de films, salles, séances, users).

### Billetterie et Finance

- [x] **Achat** : Système de vente de billets simples et de "Super Billets" (10 séances) avec déduction automatique du solde et création d'une transaction associée.
- [x] **Utilisation** : Validation d'un billet pour une séance donnée (`POST /tickets/:id/use`), avec décrémentation du nombre d'utilisations restantes et protection contre la double utilisation sur la même séance.
- [x] **Historique** : Consultation des utilisations d'un billet (à quelles séances il a été utilisé) via `GET /tickets/:id/usages`.
- [x] **Portefeuille** : Gestion du solde utilisateur en euros (dépôt, retrait, historique des transactions filtré par utilisateur ou par admin sur tous les utilisateurs).
- [x] **Contrôle** : Vérification systématique du solde avant achat.
- [x] **Race conditions** : Achat de billet géré dans une transaction SQL (atomicité solde + ticket + transaction).

### Statistiques et Administration Avancée

- [x] **Stats par séance** : visualisation par l'administrateur du nombre de billets vendus / spectateurs pour une séance donnée (`GET /screenings/:id/stats`).
- [x] **Affluence quotidienne** : nombre de spectateurs sur une journée, par séance et au total, optionnellement filtré par salle (`GET /stats/attendance/daily`).
- [x] **Affluence sur période** : statistiques agrégées sur une période arbitraire (totaux, moyennes, taux d'occupation moyen, top 5 des films les plus vus) avec filtre optionnel par salle (`GET /stats/attendance`).
- [ ] Affluence hebdomadaire et taux de fréquentation temps réel.
- [ ] Tracking détaillé de l'activité d'un utilisateur (films vus, séances assistées).

### Technique et Infrastructure

- [x] Mise en production avec support HTTPS.
- [x] Dockerisation de l'application (image de production sans TypeScript).
- [x] Documentation OpenAPI / Swagger.

### Bonus

- [x] Pipeline CI/CD et gestion des race conditions.
