import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateSchema1624703584011 implements MigrationInterface {
    name = 'CreateSchema1624703584011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "price" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "amount" double precision NOT NULL DEFAULT '0', "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "game_id" integer, CONSTRAINT "PK_d163e55e8cce6908b2e0f27cea4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "store_id" character varying NOT NULL, "image_url" character varying, CONSTRAINT "UQ_99db584f1c67d1ce0dd8df363ac" UNIQUE ("store_id"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "google_id" character varying NOT NULL, "expo_push_token" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_7adac5c0b28492eb292d4a93871" UNIQUE ("google_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wish_list" ("id" SERIAL NOT NULL, "is_present" boolean NOT NULL DEFAULT true, "game_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_f8e27bbb59891db7cd9f920c272" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "price" ADD CONSTRAINT "FK_bb8c9e4d6d416943acd90e6dcd4" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "FK_65611934a7c0f6e1ac7818411ff" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "FK_c23debb14a44001e4c5ffb3169d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "FK_c23debb14a44001e4c5ffb3169d"`);
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "FK_65611934a7c0f6e1ac7818411ff"`);
        await queryRunner.query(`ALTER TABLE "price" DROP CONSTRAINT "FK_bb8c9e4d6d416943acd90e6dcd4"`);
        await queryRunner.query(`DROP TABLE "wish_list"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "price"`);
    }

}
