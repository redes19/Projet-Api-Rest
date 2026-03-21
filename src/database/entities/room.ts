// | Colonne             | Type         | NOT NULL | Contrainte / note       |
// | ------------------- | ------------ | -------- | ----------------------- |
// | id                  | SERIAL       | ●        | PK                      |
// | name                | VARCHAR(100) | ●        | UNIQUE                  |
// | description         | TEXT         | ○        |                         |
// | image_url           | VARCHAR(255) | ○        |                         |
// | type                | VARCHAR(50)  | ●        | 2D, 3D, IMAX, 4DX, VIP… |
// | capacity            | SMALLINT     | ●        | CHECK 15 ≤ x ≤ 30       |
// | has_disabled_access | BOOLEAN      | ●        | DEFAULT FALSE           |
// | is_maintenance      | BOOLEAN      | ●        | DEFAULT FALSE           |
// | created_at          | TIMESTAMP    | ●        | DEFAULT NOW()           |
// | updated_at          | TIMESTAMP    | ●        | DEFAULT NOW()           |
