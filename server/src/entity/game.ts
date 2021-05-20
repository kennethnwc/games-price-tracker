import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Price } from "./price";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  store_id: string;

  @OneToMany(() => Price, (price) => price.game)
  prices: Price[];
}
