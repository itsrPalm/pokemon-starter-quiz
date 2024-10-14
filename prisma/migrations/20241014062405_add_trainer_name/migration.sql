/*
  Warnings:

  - Added the required column `trainerName` to the `QuizResult` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuizResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trainerName" TEXT NOT NULL,
    "grassPokemon" TEXT NOT NULL,
    "firePokemon" TEXT NOT NULL,
    "waterPokemon" TEXT NOT NULL,
    "teamSummary" TEXT NOT NULL
);
INSERT INTO "new_QuizResult" ("createdAt", "firePokemon", "grassPokemon", "id", "teamSummary", "waterPokemon") SELECT "createdAt", "firePokemon", "grassPokemon", "id", "teamSummary", "waterPokemon" FROM "QuizResult";
DROP TABLE "QuizResult";
ALTER TABLE "new_QuizResult" RENAME TO "QuizResult";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
