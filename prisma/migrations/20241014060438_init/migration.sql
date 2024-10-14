-- CreateTable
CREATE TABLE "QuizResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grassPokemon" TEXT NOT NULL,
    "firePokemon" TEXT NOT NULL,
    "waterPokemon" TEXT NOT NULL,
    "teamSummary" TEXT NOT NULL
);
