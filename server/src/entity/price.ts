import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Game } from "./Game";

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ nullable: false, type: "float", default: 0.0 })
  amount!: number;

  @Column({ type: "timestamptz" })
  start_date: Date;

  @ManyToOne(() => Game, (game) => game.prices)
  game: Game;
}
