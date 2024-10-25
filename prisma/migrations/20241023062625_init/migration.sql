-- CreateEnum
CREATE TYPE "OptionType" AS ENUM ('radio', 'multi_select', 'text');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('embroidery_front_large', 'embroidery_front', 'embroidery_back', 'embroidery_right', 'embroidery_left', 'mockup');

-- CreateEnum
CREATE TYPE "FileOptionType" AS ENUM ('bool');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "printfulId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "printfulPrice" DOUBLE PRECISION NOT NULL,
    "retailPrice" DOUBLE PRECISION NOT NULL,
    "printfulId" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripePriceId" TEXT,
    "mockupUrl" TEXT,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "shippingDetails" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserUpload" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizResult" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trainerName" TEXT,
    "grassPokemon" JSONB NOT NULL,
    "firePokemon" JSONB NOT NULL,
    "waterPokemon" JSONB NOT NULL,
    "teamSummary" TEXT NOT NULL,
    "audioData" TEXT,
    "audioStatus" TEXT,
    "rankings" JSONB NOT NULL,
    "base64ImageMap" JSONB NOT NULL,
    "pokemonResultPngs" JSONB NOT NULL,
    "svgMap" JSONB,
    "hatProductId" TEXT,

    CONSTRAINT "QuizResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HatProduct" (
    "id" TEXT NOT NULL,
    "printfulId" INTEGER NOT NULL,
    "mainCategoryId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "variantCount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "origin_country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HatProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HatVariant" (
    "id" TEXT NOT NULL,
    "printfulFileId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "retailPrice" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "hatProductId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HatVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "OptionType" NOT NULL,
    "values" JSONB,
    "additional_price" DOUBLE PRECISION,
    "additional_price_breakdown" JSONB NOT NULL,
    "hatProductId" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technique" (
    "key" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL,
    "hatProductId" TEXT NOT NULL,

    CONSTRAINT "Technique_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "title" TEXT NOT NULL,
    "additional_price" DOUBLE PRECISION,
    "hatProductId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileOption" (
    "id" TEXT NOT NULL,
    "type" "FileOptionType" NOT NULL,
    "title" TEXT NOT NULL,
    "additional_price" DOUBLE PRECISION NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "FileOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_printfulId_key" ON "Product"("printfulId");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_printfulId_key" ON "Variant"("printfulId");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_stripePriceId_key" ON "Variant"("stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_hatProductId_fkey" FOREIGN KEY ("hatProductId") REFERENCES "HatProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HatVariant" ADD CONSTRAINT "HatVariant_hatProductId_fkey" FOREIGN KEY ("hatProductId") REFERENCES "HatProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_hatProductId_fkey" FOREIGN KEY ("hatProductId") REFERENCES "HatProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technique" ADD CONSTRAINT "Technique_hatProductId_fkey" FOREIGN KEY ("hatProductId") REFERENCES "HatProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_hatProductId_fkey" FOREIGN KEY ("hatProductId") REFERENCES "HatProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileOption" ADD CONSTRAINT "FileOption_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
