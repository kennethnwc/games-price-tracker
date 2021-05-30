import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Game } from "./game";
import { User } from "./user";

@Entity()
export class WishList extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game, { nullable: false })
  @JoinColumn({ name: "game_id" })
  game: Game;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ default: true })
  is_present: Boolean;
}
