// | Colonne    | Type         | NOT NULL | Contrainte / note                |
// | ---------- | ------------ | -------- | -------------------------------- |
// | id         | SERIAL       | ●        | PK                               |
// | user_id    | INT          | ●        | FK → users.id, ON DELETE CASCADE |
// | token_hash | VARCHAR(255) | ●        | UNIQUE                           |
// | expires_at | TIMESTAMP    | ●        |                                  |
// | created_at | TIMESTAMP    | ●        | DEFAULT NOW()                    |
// | revoked_at | TIMESTAMP    | ○        | NULL = token actif               |
