// | Colonne     | Type          | NOT NULL | Contrainte / note                        |
// | ----------- | ------------- | -------- | ---------------------------------------- |
// | id          | SERIAL        | ●        | PK                                       |
// | user_id     | INT           | ●        | FK → users.id, ON DELETE RESTRICT        |
// | type        | VARCHAR(20)   | ●        | deposit \| withdrawal \| ticket_purchase |
// | amount      | NUMERIC(10,2) | ●        | + crédit, - débit                        |
// | description | TEXT          | ○        |                                          |
// | created_at  | TIMESTAMP     | ●        | DEFAULT NOW()                            |
