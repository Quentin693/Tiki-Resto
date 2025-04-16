-- Commencer une transaction
BEGIN;

-- Supprimer la table existante avec ses dépendances
DROP TABLE IF EXISTS "reservation" CASCADE;

-- Créer la nouvelle table avec la structure correcte
CREATE TABLE "reservation" (
  "id" SERIAL PRIMARY KEY,
  "date" DATE NOT NULL,
  "time" VARCHAR(255) NOT NULL,
  "guests" INTEGER NOT NULL,
  "special_requests" VARCHAR(255),
  "customerName" VARCHAR(255) NOT NULL,
  "customerPhone" VARCHAR(255) NOT NULL,
  "customerEmail" VARCHAR(255) NOT NULL,
  "user_id" INTEGER NOT NULL,
  CONSTRAINT "FK_user_reservation" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Créer les index nécessaires
CREATE INDEX "IDX_user_reservation" ON "reservation" ("user_id");

-- Valider les modifications
COMMIT; 