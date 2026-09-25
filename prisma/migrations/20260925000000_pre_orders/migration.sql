-- CreateTable
CREATE TABLE "public"."PreOrder" (
    "id" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gloveSize" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PreOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PreOrder_createdAt_idx" ON "public"."PreOrder"("createdAt");

-- CreateIndex
CREATE INDEX "PreOrder_email_idx" ON "public"."PreOrder"("email");
