-- CreateTable
CREATE TABLE "AccessCode" (
    "id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "expires_at" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessCode_pkey" PRIMARY KEY ("id")
);
