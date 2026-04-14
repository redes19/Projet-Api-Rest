// | Colonne        | Type          | NOT NULL | Contrainte / note                 |
// | -------------- | ------------- | -------- | --------------------------------- |
// | id             | SERIAL        | ●        | PK                                |
// | user_id        | INT           | ●        | FK → users.id, ON DELETE RESTRICT |
// | type           | VARCHAR(10)   | ●        | 'normal' | 'super'                |
// | remaining_uses | INT           | ●        | CHECK ≥ 0                         |
// | purchased_at   | TIMESTAMP     | ●        | DEFAULT NOW()                     |

// | Colonne        | Type          | NOT NULL | Contrainte / note                 |
// | -------------- | ------------- | -------- | --------------------------------- |
// | id             | SERIAL        | ●        | PK                                |
// | ticket_id      | INT           | ●        | FK → tickets.id, ON DELETE RESTRICT |
// | screening_id   | INT           | ●        | FK → screenings.id, ON DELETE RESTRICT |
// | used_at        | TIMESTAMP     | ●        | DEFAULT NOW()                     |

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.js";
import { Screening } from "./screening.js";

export enum TicketType {
  NORMAL = "normal",
  SUPER = "super",
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "enum", enum: TicketType, nullable: false })
  type: TicketType;

  @Column({ type: "int", nullable: false })
  remaining_uses: number;

  @Column({
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  purchased_at: Date;

  constructor(
    id: number,
    user: User,
    type: TicketType,
    remaining_uses: number,
    purchased_at: Date
  ) {
    this.id = id;
    this.user = user;
    this.type = type;
    this.remaining_uses = remaining_uses;
    this.purchased_at = purchased_at;
  }
}

@Entity()
export class TicketUsage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ticket, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "ticket_id" })
  ticket: Ticket;

  @ManyToOne(() => Screening, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "screening_id" })
  screening: Screening;

  @Column({
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  used_at: Date;

  constructor(id: number, ticket: Ticket, screening: Screening, used_at: Date) {
    this.id = id;
    this.ticket = ticket;
    this.screening = screening;
    this.used_at = used_at;
  }
}
