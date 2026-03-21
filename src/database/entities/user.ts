// | Colonne       | Type          | NOT NULL | Contrainte / note |
// | ------------- | ------------- | -------- | ----------------- |
// | id            | SERIAL        | ●        | PK                |
// | email         | VARCHAR(255)  | ●        | UNIQUE            |
// | password_hash | VARCHAR(255)  | ●        |                   |
// | role          | VARCHAR(20)   | ●        | DEFAULT 'client'  |
// | balance       | NUMERIC(10,2) | ●        | DEFAULT 0         |
// | first_name    | VARCHAR(100)  | ○        |                   |
// | last_name     | VARCHAR(100)  | ○        |                   |
// | created_at    | TIMESTAMP     | ●        | DEFAULT NOW()     |
// | updated_at    | TIMESTAMP     | ●        | DEFAULT NOW()     |
