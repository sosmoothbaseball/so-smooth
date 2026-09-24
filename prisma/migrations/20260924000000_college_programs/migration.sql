-- CreateTable
CREATE TABLE "public"."CollegeProgram" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "link" TEXT NOT NULL DEFAULT '',
    "stats" JSONB NOT NULL,
    "accolades" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollegeProgram_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CollegeProgram_parentId_idx" ON "public"."CollegeProgram"("parentId");

-- CreateIndex
CREATE INDEX "CollegeProgram_createdAt_idx" ON "public"."CollegeProgram"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."CollegeProgram" ADD CONSTRAINT "CollegeProgram_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
