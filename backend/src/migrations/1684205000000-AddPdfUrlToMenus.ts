import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPdfUrlToMenus1684205000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "pdfUrl" character varying NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "pdfUrl"`);
  }
} 