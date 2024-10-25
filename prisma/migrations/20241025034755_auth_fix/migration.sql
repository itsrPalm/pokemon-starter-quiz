/*
  Warnings:

  - You are about to drop the column `accessToken` on the `AccessCode` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `AccessCode` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `AccessCode` table. All the data in the column will be lost.
  - Added the required column `access_token` to the `AccessCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `AccessCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token` to the `AccessCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessCode" DROP COLUMN "accessToken",
DROP COLUMN "expiresAt",
DROP COLUMN "refreshToken",
ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "expires_at" INTEGER NOT NULL,
ADD COLUMN     "refresh_token" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;
