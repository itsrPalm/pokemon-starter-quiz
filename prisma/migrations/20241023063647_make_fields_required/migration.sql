/*
  Warnings:

  - Made the column `svgMap` on table `QuizResult` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hatProductId` on table `QuizResult` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_hatProductId_fkey";

-- AlterTable
ALTER TABLE "QuizResult" ALTER COLUMN "svgMap" SET NOT NULL,
ALTER COLUMN "hatProductId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_hatProductId_fkey" FOREIGN KEY ("hatProductId") REFERENCES "HatProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
