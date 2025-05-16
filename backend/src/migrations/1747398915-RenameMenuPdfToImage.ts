import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameMenuPdfToImage1747398915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ajoute une nouvelle colonne imageUrl
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "imageUrl" character varying NULL`,
    );
    
    // Transfère les données de pdfUrl vers imageUrl
    await queryRunner.query(
      `UPDATE "menus" SET "imageUrl" = "pdfUrl" WHERE "pdfUrl" IS NOT NULL`,
    );
    
    // Supprime l'ancienne colonne pdfUrl
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "pdfUrl"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restaure la colonne pdfUrl
    await queryRunner.query(
      `ALTER TABLE "menus" ADD "pdfUrl" character varying NULL`,
    );
    
    // Transfère les données de imageUrl vers pdfUrl
    await queryRunner.query(
      `UPDATE "menus" SET "pdfUrl" = "imageUrl" WHERE "imageUrl" IS NOT NULL`,
    );
    
    // Supprime la colonne imageUrl
    await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "imageUrl"`);
  }
} 