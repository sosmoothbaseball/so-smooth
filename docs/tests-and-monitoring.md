# Tests and error monitoring

Pick this up later. The portal already works by using the site. This file is the outline so we do not start from scratch.

Goal: if sign-in or booking breaks, we find out in CI or by email, not from a parent.

## 1. Automated tests

A script that walks the real flows and **fails the build** (or a GitHub check) when they break.

### What to cover first (portal)

These match how families actually use the site:

1. Parent sign in → lands on `/portal/parent`
2. Wrong password → stays on `/portal` with an error (does not crash)
3. Book an open lesson this week → slot shows booked
4. Two parents try the same slot → only one wins, the other gets “just taken”
5. Cancel that lesson → slot is open again
6. Coach cannot book as a parent; parent cannot open coach tools

Second pass, same idea:

- Event signup + cancel
- Password reset link lands on `/portal/update-password`
- Coach saves weekly hours → times show on `/lessons`

### How (when we implement)

| Layer | Tool | What it is |
| --- | --- | --- |
| Fast checks | Vitest | Call `claimLessonSlot` / `bookLessonAction` against a throwaway test database. No browser. |
| Real clicks | Playwright | One Chromium run: sign in, book, cancel. Hits a local or preview URL. |
| When it runs | GitHub Action on PRs to `main` | `npm test` then Playwright. Red X on the PR if anything fails. |

Keep one dedicated **test database** (second Supabase project, or a branch). Never point tests at production. Never run `db:seed` / `ALLOW_DB_SEED` against live.

Suggested files when we build it:

- `src/lib/portal/booking.test.ts` — claim / overlap / past / this-week-only
- `e2e/portal-book-cancel.spec.ts` — sign in, book, cancel
- `.github/workflows/test.yml` — install, migrate test DB, run both

Do not try to screenshot the whole marketing site. Portal booking is the part that can lose a family a slot.

## 2. Error monitoring

If login or booking dies at 2am, something should email Connor. Vercel and Supabase dashboards are only useful if someone opens them.

### What to add

**Sentry** on the Next.js app (Vercel integration is the usual path).

Capture:

- Uncaught 500s on `/portal/*`, `/lessons`, `/events`
- Failed server actions (`loginAction`, `bookLessonAction`, `cancelLessonBookingAction`) when they throw, not when they return a normal “wrong password”
- Prisma / database connection errors

Do **not** send passwords, session cookies, or full form bodies.

Alert:

- Email (or Slack) on a new error, or when the same error repeats
- Optional: Vercel spend / crash webhook as a backup

Supabase: turn on email alerts for project pause / auth failures once the org is on a paid plan. That is separate from Sentry.

### Env (later)

Production + Preview:

- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN` if the browser SDK is on
- Auth token only in CI, not in the client

## 3. Order of work

1. Sentry on production (half a day). Immediate payoff if something 500s.
2. Vitest around `src/lib/portal/booking.ts` (half a day). Catches double-book bugs without a browser.
3. One Playwright flow: sign in → book → cancel.
4. GitHub Action so `main` cannot ship if that flow fails.
5. Only then add event signup and password-reset tests.

## 4. Not this file

- Dummy / demo accounts in production (wipe separately; do not seed live)
- Lesson payments, booking emails, “create a coach” admin
- Paying Vercel Pro / Supabase Pro for uptime (Hobby/Free can still pause; that is a plan choice, not a test)

## 5. Done when

- A broken `bookLessonAction` fails CI before it hits families
- A production 500 emails Connor without anyone checking the dashboard
- Tests never write to the live So Smooth database
