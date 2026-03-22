// | Colonne    | Type         | NOT NULL | Contrainte / note                |
// | ---------- | ------------ | -------- | -------------------------------- |
// | id         | SERIAL       | ●        | PK                               |
// | user_id    | INT          | ●        | FK → users.id, ON DELETE CASCADE |
// | token_hash | VARCHAR(255) | ●        | UNIQUE                           |
// | expires_at | TIMESTAMP    | ●        |                                  |
// | created_at | TIMESTAMP    | ●        | DEFAULT NOW()                    |
// | revoked_at | TIMESTAMP    | ○        | NULL = token actif               |

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.js";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column("varchar", { unique: true, length: 255, nullable: false })
  token_hash: string;

  @Column("timestamp")
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @Column("timestamp", { nullable: true })
  revoked_at: Date | null;

  constructor(
    id: number,
    user: User,
    token_hash: string,
    expires_at: Date,
    created_at: Date,
    revoked_at: Date | null,
  ) {
    this.id = id;
    this.user = user;
    this.token_hash = token_hash;
    this.expires_at = expires_at;
    this.created_at = created_at;
    this.revoked_at = revoked_at;
  }
}
