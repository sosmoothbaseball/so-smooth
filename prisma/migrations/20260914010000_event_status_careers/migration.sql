-- AlterTable
ALTER TABLE "public"."Profile" ALTER COLUMN "password" SET DEFAULT '';

-- AlterTable
ALTER TABLE "public"."UpcomingEvent" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'open';

-- CreateTable
CREATE TABLE "public"."CareerSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL,
    "availability" TEXT NOT NULL DEFAULT '',
    "experience" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT NOT NULL DEFAULT '',
    "resumeUrl" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerSubmission_pkey" PRIMARY KEY ("id")
);
