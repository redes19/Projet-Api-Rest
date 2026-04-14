// | Colonne             | Type         | NOT NULL | Contrainte / note       |
// | ------------------- | ------------ | -------- | ----------------------- |
// | id                  | SERIAL       | ●        | PK                      |
// | name                | VARCHAR(100) | ●        | UNIQUE                  |
// | description         | TEXT         | ○        |                         |
// | image_url           | VARCHAR(255) | ○        |                         |
// | type                | VARCHAR(50)  | ●        | 2D, 3D, IMAX, 4DX, VIP  |
// | capacity            | INT          | ●        | CHECK 15 ≤ x ≤ 30       |
// | has_disabled_access | BOOLEAN      | ●        | DEFAULT FALSE           |
// | is_maintenance      | BOOLEAN      | ●        | DEFAULT FALSE           |
// | created_at          | TIMESTAMP    | ●        | DEFAULT NOW()           |
// | updated_at          | TIMESTAMP    | ●        | DEFAULT NOW()           |

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum RoomType {
  TWO_D = "2D",
  THREE_D = "3D",
  IMAX = "IMAX",
  FOUR_DX = "4DX",
  VIP = "VIP",
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100, nullable: false, unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  image_url: string | null;

  @Column({ type: "enum", enum: RoomType, nullable: false })
  type: RoomType;

  @Column({ type: "integer", nullable: false })
  capacity: number;

  @Column({ type: "boolean", nullable: false, default: false })
  has_disabled_access: boolean;

  @Column({ type: "boolean", nullable: false, default: false })
  is_maintenance: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor(
    id: number,
    name: string,
    description: string | null,
    image_url: string | null,
    type: RoomType,
    capacity: number,
    has_disabled_access: boolean,
    is_maintenance: boolean,
    created_at: Date,
    updated_at: Date
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image_url = image_url;
    this.type = type;
    this.capacity = capacity;
    this.has_disabled_access = has_disabled_access;
    this.is_maintenance = is_maintenance;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
