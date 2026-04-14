// | Colonne     | Type          | NOT NULL | Contrainte / note                        |
// | ----------- | ------------- | -------- | ---------------------------------------- |
// | id          | SERIAL        | ●        | PK                                       |
// | user_id     | INT           | ●        | FK → users.id, ON DELETE RESTRICT        |
// | type        | VARCHAR(20)   | ●        | deposit \| withdrawal \| ticket_purchase |
// | amount      | NUMERIC(10,2) | ●        | + crédit, - débit                        |
// | description | TEXT          | ○        |                                          |
// | created_at  | TIMESTAMP     | ●        | DEFAULT NOW()                            |

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
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", length: 20, nullable: false })
  type: string;

  @Column({
    type: "numeric",
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: {
      to: (value: number): number => value,
      from: (value: string | null): number =>
        value === null ? 0 : parseFloat(value),
    },
  })
  amount: number;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @CreateDateColumn()
  created_at: Date;

  constructor(
    id: number,
    user: User,
    type: string,
    amount: number,
    description: string | null,
    created_at: Date
  ) {
    this.id = id;
    this.user = user;
    this.type = type;
    this.amount = amount;
    this.description = description;
    this.created_at = created_at;
  }
}
