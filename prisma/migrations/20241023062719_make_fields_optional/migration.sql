-- This is an empty migration.

-- AlterTable
-- ALTER TABLE "public"."QuizResult" ALTER COLUMN "svgMap" DROP NOT NULL;
-- ALTER TABLE "public"."QuizResult" ADD COLUMN "hatProductId" TEXT; -- Adjust data type if necessary

-- Drop NOT NULL from svgMap
ALTER TABLE "public"."QuizResult" ALTER COLUMN "svgMap" DROP NOT NULL;

-- Remove or comment out the hatProductId addition
-- ALTER TABLE "public"."QuizResult" ADD COLUMN "hatProductId" TEXT;
