import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsEventColumn1714094401024 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE reservations ADD COLUMN "isEvent" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE reservations DROP COLUMN "isEvent"`);
    }
} 