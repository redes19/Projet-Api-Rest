// | Colonne        | Type          | NOT NULL | Contrainte / note                 |
// | -------------- | ------------- | -------- | --------------------------------- |
// | id             | SERIAL        | ●        | PK                                |
// | user_id        | INT           | ●        | FK → users.id, ON DELETE RESTRICT |
// | type           | VARCHAR(10)   | ●        | 'single' \| 'super'               |
// | remaining_uses | SMALLINT      | ●        | CHECK ≥ 0                         |
// | price_paid     | NUMERIC(10,2) | ●        | CHECK ≥ 0                         |
// | purchased_at   | TIMESTAMP     | ●        | DEFAULT NOW()                     |

// | Colonne        | Type          | NOT NULL | Contrainte / note                 |
// | -------------- | ------------- | -------- | --------------------------------- |
// | id             | SERIAL        | ●        | PK                                |
// | ticket_id      | INT           | ●        | FK → tickets.id, ON DELETE RESTRICT |
// | screening_id   | INT           | ●        | FK → screenings.id, ON DELETE RESTRICT |
// | used_at        | TIMESTAMP     | ●        | DEFAULT NOW()                     |
