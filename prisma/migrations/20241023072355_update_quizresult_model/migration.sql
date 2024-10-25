/*
  Warnings:

  - You are about to drop the column `audioData` on the `QuizResult` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `QuizResult` table without a default value. This is not possible if the table is not empty.
  - Made the column `trainerName` on table `QuizResult` required. This step will fail if there are existing NULL values in that column.
  - Made the column `audioStatus` on table `QuizResult` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_hatProductId_fkey";

-- AlterTable
ALTER TABLE "QuizResult" DROP COLUMN "audioData",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "trainerName" SET NOT NULL,
ALTER COLUMN "audioStatus" SET NOT NULL,
ALTER COLUMN "base64ImageMap" DROP NOT NULL,
ALTER COLUMN "pokemonResultPngs" DROP NOT NULL,
ALTER COLUMN "svgMap" DROP NOT NULL,
ALTER COLUMN "hatProductId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_hatProductId_fkey" FOREIGN KEY ("hatProductId") REFERENCES "HatProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
