-- CreateEnum
CREATE TYPE "StatutInscription" AS ENUM ('EN_ATTENTE', 'CONFIRMEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "StatutFormation" AS ENUM ('ACTIVE', 'COMPLETE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "NiveauIA" AS ENUM ('DEBUTANT', 'INTERMEDIAIRE', 'AVANCE');

-- CreateTable
CREATE TABLE "formations" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objectif" TEXT NOT NULL,
    "modules" JSONB NOT NULL,
    "projet_final" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "heure_debut" TEXT NOT NULL,
    "heure_fin" TEXT NOT NULL,
    "lieu" JSONB NOT NULL,
    "prix" INTEGER NOT NULL,
    "prix_affiche" TEXT NOT NULL,
    "formateur" TEXT NOT NULL,
    "statut" "StatutFormation" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "date_naissance" DATE NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "fonction" TEXT NOT NULL,
    "entreprise" TEXT,
    "niveau_ia" "NiveauIA" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscriptions" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "statut" "StatutInscription" NOT NULL DEFAULT 'EN_ATTENTE',
    "make_notified" BOOLEAN NOT NULL DEFAULT false,
    "make_notified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "participant_id" TEXT NOT NULL,
    "formation_id" TEXT NOT NULL,

    CONSTRAINT "inscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "formations_slug_key" ON "formations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "participants_email_key" ON "participants"("email");

-- CreateIndex
CREATE INDEX "participants_email_idx" ON "participants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "inscriptions_reference_key" ON "inscriptions"("reference");

-- CreateIndex
CREATE INDEX "inscriptions_participant_id_idx" ON "inscriptions"("participant_id");

-- CreateIndex
CREATE INDEX "inscriptions_formation_id_idx" ON "inscriptions"("formation_id");

-- CreateIndex
CREATE INDEX "inscriptions_reference_idx" ON "inscriptions"("reference");

-- CreateIndex
CREATE INDEX "inscriptions_statut_idx" ON "inscriptions"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "inscriptions_participant_id_formation_id_key" ON "inscriptions"("participant_id", "formation_id");

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_formation_id_fkey" FOREIGN KEY ("formation_id") REFERENCES "formations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
