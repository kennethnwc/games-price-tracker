import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Price } from "./price";

@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  store_id: string;

  @OneToMany(() => Price, (price) => price.game)
  prices: Price[];

  @Column({ nullable: true })
  image_url: string;
}
