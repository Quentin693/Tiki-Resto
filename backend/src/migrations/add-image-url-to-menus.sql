-- Ajoute une colonne imageUrl à la table menus et transfère les données de pdfUrl vers imageUrl
ALTER TABLE "menus" ADD COLUMN "imageUrl" character varying NULL;
UPDATE "menus" SET "imageUrl" = "pdfUrl" WHERE "pdfUrl" IS NOT NULL;
ALTER TABLE "menus" DROP COLUMN "pdfUrl"; 