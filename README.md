# Projet API

## Architecture de l'API

Architecture provisoire

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
