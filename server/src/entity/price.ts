import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Game } from "./game";

@Entity()
export class Price extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ nullable: false, type: "float", default: 0.0 })
  amount!: number;

  @Column({ type: "timestamptz" })
  start_date: Date;

  @ManyToOne(() => Game, (game) => game.prices, { orphanedRowAction: "delete" })
  @JoinColumn({ name: "game_id" })
  game: Game;
}
