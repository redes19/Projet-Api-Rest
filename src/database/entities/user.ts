// | Colonne       | Type          | NOT NULL | Contrainte / note |
// | ------------- | ------------- | -------- | ----------------- |
// | id            | SERIAL        | ●        | PK                |
// | email         | VARCHAR(255)  | ●        | UNIQUE            |
// | password      | VARCHAR(255)  | ●        |                   |
// | role          | VARCHAR(20)   | ●        | DEFAULT 'client'  |
// | balance       | NUMERIC(10,2) | ●        | DEFAULT 0         |
// | first_name    | VARCHAR(100)  | ○        |                   |
// | last_name     | VARCHAR(100)  | ○        |                   |
// | created_at    | TIMESTAMP     | ●        | DEFAULT NOW()     |
// | updated_at    | TIMESTAMP     | ●        | DEFAULT NOW()     |

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Token } from "./token.js";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { unique: true, length: 255, nullable: false })
  email: string;

  @Column("varchar", { length: 255, nullable: false })
  password: string;

  @Column("varchar", { length: 20, nullable: false, default: "client" })
  role: string;

  @Column("numeric", {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number): number => value,
      from: (value: string | null): number =>
        value === null ? 0 : parseFloat(value),
    },
  })
  balance: number;

  @Column("varchar", { length: 100, nullable: true })
  first_name: string | null;

  @Column("varchar", { length: 100, nullable: true })
  last_name: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany("Token", (token: Token) => token.user)
  tokens!: Token[];

  constructor(
    id: number,
    email: string,
    password: string,
    role: string,
    balance: number,
    first_name: string | null,
    last_name: string | null,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
    this.balance = balance;
    this.first_name = first_name;
    this.last_name = last_name;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
