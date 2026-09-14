-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN "offersLessons" BOOLEAN NOT NULL DEFAULT false;

-- Coaches who already have weekly hours stay listed as offering.
UPDATE "public"."Profile"
SET "offersLessons" = true
WHERE "role" = 'coach'
  AND "id" IN (SELECT DISTINCT "coachId" FROM "public"."WeeklyHours");
