/*
  Warnings:

  - Added the required column `selectedOptions` to the `HatVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HatVariant" ADD COLUMN     "selectedOptions" JSONB NOT NULL;
