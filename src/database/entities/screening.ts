// | Colonne    | Type      | NOT NULL | Contrainte / note                  |
// | ---------- | --------- | -------- | ---------------------------------- |
// | id         | SERIAL    | ●        | PK                                 |
// | movie_id   | INT       | ●        | FK → movies.id, ON DELETE RESTRICT |
// | room_id    | INT       | ●        | FK → rooms.id, ON DELETE RESTRICT  |
// | start_time | TIMESTAMP | ●        |                                    |
// | end_time   | TIMESTAMP | ●        | CHECK > start_time                 |
// | created_at | TIMESTAMP | ●        | DEFAULT NOW()                      |
// | updated_at | TIMESTAMP | ●        | DEFAULT NOW()                      |
