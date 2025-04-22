-- Commencer une transaction
BEGIN;

-- Supprimer les tables existantes si nécessaire
DROP TABLE IF EXISTS "events" CASCADE;
DROP TABLE IF EXISTS "gallery_item" CASCADE;
DROP TABLE IF EXISTS "menus" CASCADE;
DROP TABLE IF EXISTS "personnel" CASCADE;
DROP TABLE IF EXISTS "reservation" CASCADE;
DROP TABLE IF EXISTS "carte_item" CASCADE;
DROP TABLE IF EXISTS "wine" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Table des utilisateurs
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'user',
    "phone_number" VARCHAR(255),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des réservations
CREATE TABLE "reservation" (
    "id" SERIAL PRIMARY KEY,
    "customerName" VARCHAR(255) NOT NULL,
    "customerEmail" VARCHAR(255) NOT NULL,
    "customerPhone" VARCHAR(255) NOT NULL,
    "numberOfGuests" INTEGER NOT NULL,
    "reservationDateTime" TIMESTAMP NOT NULL,
    "specialRequests" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER
);

-- Table des menus
CREATE TABLE "menus" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "price" VARCHAR(255) NOT NULL,
    "items" TEXT NOT NULL,
    "info" TEXT,
    "highlight" BOOLEAN DEFAULT FALSE
);

-- Table des événements
CREATE TABLE "events" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "date" VARCHAR(255) NOT NULL,
    "time" VARCHAR(255) NOT NULL,
    "capacity" VARCHAR(255) NOT NULL,
    "imagePath" VARCHAR(255),
    "type" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table du personnel
CREATE TABLE "personnel" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "bio" TEXT,
    "imagePath" VARCHAR(255)
);

-- Table de la carte des plats
CREATE TABLE "carte_item" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" VARCHAR(255) NOT NULL,
    "highlighted" BOOLEAN DEFAULT FALSE
);

-- Table des vins
CREATE TABLE "wine" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" VARCHAR(255) NOT NULL,
    "region" VARCHAR(255),
    "origin" VARCHAR(255),
    "year" VARCHAR(255)
);

-- Table de la galerie d'images
CREATE TABLE "gallery_item" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "imagePath" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création des index
CREATE INDEX "idx_users_email" ON "users" ("email");
CREATE INDEX "idx_reservation_userId" ON "reservation" ("userId");
CREATE INDEX "idx_events_date" ON "events" ("date");
CREATE INDEX "idx_carte_category" ON "carte_item" ("category");
CREATE INDEX "idx_wine_category" ON "wine" ("category");
CREATE INDEX "idx_gallery_category" ON "gallery_item" ("category");

-- Création des contraintes de clé étrangère
ALTER TABLE "reservation" ADD CONSTRAINT "fk_reservation_user" 
    FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL;

-- Valider la transaction
COMMIT; 