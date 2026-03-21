// | Colonne          | Type         | NOT NULL | Contrainte / note |
// | ---------------- | ------------ | -------- | ----------------- |
// | id               | SERIAL       | ●        | PK                |
// | title            | VARCHAR(255) | ●        |                   |
// | description      | TEXT         | ○        |                   |
// | duration_minutes | INT          | ●        | CHECK > 0         |
// | genre            | VARCHAR(100) | ○        |                   |
// | poster_url       | TEXT         | ○        |                   |
// | release_date     | DATE         | ○        |                   |
// | created_at       | TIMESTAMP    | ●        | DEFAULT NOW()     |
// | updated_at       | TIMESTAMP    | ●        | DEFAULT NOW()     |
