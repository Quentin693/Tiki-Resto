-- Commencer une transaction pour garantir que toutes les modifications sont appliquées ensemble
BEGIN;

-- Récupérer la structure actuelle de la table
ALTER TABLE "reservation" ALTER COLUMN "customerName" TYPE VARCHAR(255);
ALTER TABLE "reservation" ALTER COLUMN "customerName" DROP NOT NULL;

-- Supprimer toutes les données existantes si nécessaire (ATTENTION: cela supprime toutes les réservations)
TRUNCATE TABLE "reservation" CASCADE;

-- Ajouter les contraintes nécessaires et modifier la structure
ALTER TABLE "reservation" DROP CONSTRAINT IF EXISTS "PK_48b1f9922368359ab88e8bfa525";
ALTER TABLE "reservation" ADD CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id");

-- Valider les modifications
COMMIT; 
 
BEGIN;

-- Récupérer la structure actuelle de la table
ALTER TABLE "reservation" ALTER COLUMN "customerName" TYPE VARCHAR(255);
ALTER TABLE "reservation" ALTER COLUMN "customerName" DROP NOT NULL;

-- Supprimer toutes les données existantes si nécessaire (ATTENTION: cela supprime toutes les réservations)
TRUNCATE TABLE "reservation" CASCADE;

-- Ajouter les contraintes nécessaires et modifier la structure
ALTER TABLE "reservation" DROP CONSTRAINT IF EXISTS "PK_48b1f9922368359ab88e8bfa525";
ALTER TABLE "reservation" ADD CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id");

-- Valider les modifications
COMMIT; 