# Projet API

## Architecture de l'API

### Architecture provisoire

```
src/
│
├── index.ts
├── routes.ts
│
├── config/
│   ├── env.ts
│   ├── jwt.ts
│   └── swagger.ts
│
├── common/
│   ├── errors/
│   │   ├── app-error.ts
│   │   ├── domain-error.ts
│   │   └── http-error.ts
│   ├── types/
│   │   ├── auth-request.ts
│   │   └── pagination.ts
│   └── utils/
│       ├── date-range.ts
│       ├── money.ts
│       └── password.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── role.middleware.ts
│   ├── validation.middleware.ts
│   ├── error.middleware.ts
│   └── request-logger.middleware.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.usecase.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.validator.ts
│   │   └── auth.swagger.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.usecase.ts
│   │   ├── users.repository.ts
│   │   ├── users.validator.ts
│   │   └── users.swagger.ts
│   ├── rooms/
│   │   ├── rooms.controller.ts
│   │   ├── rooms.usecase.ts
│   │   ├── rooms.repository.ts
│   │   ├── rooms.validator.ts
│   │   └── rooms.swagger.ts
│   ├── movies/
│   │   ├── movies.controller.ts
│   │   ├── movies.usecase.ts
│   │   ├── movies.repository.ts
│   │   ├── movies.validator.ts
│   │   └── movies.swagger.ts
│   ├── screenings/
│   │   ├── screenings.controller.ts
│   │   ├── screenings.usecase.ts
│   │   ├── screenings.repository.ts
│   │   ├── screenings.validator.ts
│   │   └── screenings.swagger.ts
│   ├── tickets/
│   │   ├── tickets.controller.ts
│   │   ├── tickets.usecase.ts
│   │   ├── tickets.repository.ts
│   │   ├── tickets.validator.ts
│   │   └── tickets.swagger.ts
│   ├── wallet/
│   │   ├── wallet.controller.ts
│   │   ├── wallet.usecase.ts
│   │   ├── wallet.repository.ts
│   │   ├── wallet.validator.ts
│   │   └── wallet.swagger.ts
│   └── stats/
│       ├── stats.controller.ts
│       ├── stats.usecase.ts
│       ├── stats.repository.ts
│       ├── stats.validator.ts
│       └── stats.swagger.ts
│
├── database/
│   ├── database.ts
│   └── entities/
│       ├── movie.ts
│       ├── room.ts
│       ├── screening.ts
│       ├── test.ts
│       ├── ticket.ts
│       ├── token.ts
│       ├── transaction.ts
│       └── user.ts
│
└── docs/
    └── openapi/
        ├── index.ts
        └── schemas/
            ├── user.schema.ts
            ├── room.schema.ts
            ├── movie.schema.ts
            ├── screening.schema.ts
            ├── ticket.schema.ts
            └── transaction.schema.ts
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

- [ ] Suivi en temps réel du taux de fréquentation et affluence hebdomadaire.
- [ ] Visualisation par l'administrateur du nombre de billets vendus par séance.
- [ ] Tracking détaillé de l'activité des utilisateurs (films vus).

### Technique et Infrastructure

- [x] Mise en production avec support HTTPS.
- [x] Dockerisation de l'application (image de production sans TypeScript).
- [x] Documentation OpenAPI / Swagger.

### Bonus

- [x] Pipeline CI/CD et gestion des race conditions.
