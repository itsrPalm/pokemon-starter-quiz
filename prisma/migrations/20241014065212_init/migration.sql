-- CreateTable
CREATE TABLE "QuizResult" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trainerName" TEXT,
    "grassPokemon" JSONB NOT NULL,
    "firePokemon" JSONB NOT NULL,
    "waterPokemon" JSONB NOT NULL,
    "teamSummary" TEXT NOT NULL,

    CONSTRAINT "QuizResult_pkey" PRIMARY KEY ("id")
);
