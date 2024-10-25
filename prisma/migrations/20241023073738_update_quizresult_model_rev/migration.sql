/*
  Warnings:

  - You are about to drop the column `hatProductId` on the `QuizResult` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `QuizResult` table. All the data in the column will be lost.
  - Made the column `base64ImageMap` on table `QuizResult` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_hatProductId_fkey";

-- AlterTable
ALTER TABLE "QuizResult" DROP COLUMN "hatProductId",
DROP COLUMN "updatedAt",
ADD COLUMN     "audioData" BYTEA,
ALTER COLUMN "trainerName" DROP NOT NULL,
ALTER COLUMN "audioStatus" SET DEFAULT 'pending',
ALTER COLUMN "rankings" DROP NOT NULL,
ALTER COLUMN "base64ImageMap" SET NOT NULL,
ALTER COLUMN "base64ImageMap" SET DEFAULT '{}';
