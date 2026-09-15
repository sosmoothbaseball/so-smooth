-- CreateTable
CREATE TABLE "public"."Testimonial" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "roleLabel" TEXT NOT NULL,
    "featuredSlot" INTEGER,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Testimonial_featuredSlot_key" ON "public"."Testimonial"("featuredSlot");

-- CreateIndex
CREATE INDEX "Testimonial_createdAt_idx" ON "public"."Testimonial"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Testimonial" ADD CONSTRAINT "Testimonial_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Keep homepage spots at 0–3.
ALTER TABLE "public"."Testimonial" ADD CONSTRAINT "Testimonial_featuredSlot_check" CHECK ("featuredSlot" IS NULL OR "featuredSlot" IN (1, 2, 3));

-- Current homepage quotes. Additive only — no deletes.
INSERT INTO "public"."Testimonial" ("id", "quote", "displayName", "roleLabel", "featuredSlot", "parentId", "createdAt")
VALUES
  (
    'seed_testimonial_jessica',
    'My son''s confidence and fundamentals have improved so much since joining. The coaches balance fun with serious skill-building.',
    'Jessica R.',
    'Parent, 14U Player',
    1,
    NULL,
    CURRENT_TIMESTAMP
  ),
  (
    'seed_testimonial_marcus',
    'You can tell the staff really cares about what they''re teaching. Real coaches, real attention, real development.',
    'Marcus T.',
    'Parent, 9U Player',
    2,
    NULL,
    CURRENT_TIMESTAMP
  ),
  (
    'seed_testimonial_jason_mia',
    'The team-first culture is what sold us. It''s competitive, but it never loses sight of teaching kids to love the game.',
    'Jason & Mia L.',
    'Parents, 12U Player',
    3,
    NULL,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("id") DO NOTHING;
