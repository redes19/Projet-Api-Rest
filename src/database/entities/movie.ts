// | Colonne          | Type         | NOT NULL | Contrainte / note |
// | ---------------- | ------------ | -------- | ----------------- |
// | id               | SERIAL       | ●        | PK                |
// | title            | VARCHAR(255) | ●        |                   |
// | description      | TEXT         | ○        |                   |
// | duration         | INT          | ●        |                   |
// | genre            | VARCHAR(100) | ○        |                   |
// | poster_url       | TEXT         | ○        |                   |
// | release_date     | DATE         | ○        |                   |
// | created_at       | TIMESTAMP    | ●        | DEFAULT NOW()     |
// | updated_at       | TIMESTAMP    | ●        | DEFAULT NOW()     |

import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "int", nullable: false })
  duration: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  genre: string | null;

  @Column({ type: "text", nullable: true })
  poster_url: string | null;

  @Column({ type: "date", nullable: true })
  release_date: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(
    id: number,
    title: string,
    description: string | null,
    duration: number,
    genre: string | null,
    poster_url: string | null,
    release_date: Date | null,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.genre = genre;
    this.poster_url = poster_url;
    this.release_date = release_date;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
