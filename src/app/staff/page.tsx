import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { StaggerGroup, StaggerItem } from "@/components/ui/Stagger";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Staff | So Smooth",
  description:
    "Meet the So Smooth coaching staff: Carlos Vega, Roberto Bueno, Crix Taveras, Julio C., and Ryan Howard.",
};

type Coach = {
  name: string;
  role?: string;
  initials: string;
  goal?: string;
  experience?: string[];
  honors?: string[];
};

const COACHES: Coach[] = [
  {
    name: "Carlos Vega",
    role: "Co-Founder & Head Coach",
    initials: "CV",
    goal: "My goal is to help young athletes grow both as players and as people. Baseball is a great way to teach discipline, accountability, confidence, and the value of hard work. I want every player I work with to leave the field better than when they came in, while building the habits and mindset they need to succeed in baseball, in school, and in life. I want to instill confidence in all of my So Smooth Athletes and want them feeling trusted by me and all the coaches on the staff.",
    experience: [
      "5+ years of travel baseball experience as a Coach",
      "Private lesson, clinic, and camp experience",
      "Played at Mary Star High School",
      "Played college baseball at Cerritos College & California Lutheran University",
      "2025 NCAA All-Region Defensive Team Infielder",
      "3x First Team All-League at Mary Star High School",
      "Head Coach at Peninsula High School (Frosh)",
      "Varsity Infield Coach at Peninsula High School (Palos Verdes, CA)",
      "Experience developing players from youth baseball through high school",
      "Strong high school and college coaching connections to help players find the right opportunities",
      "Bachelor's degree in Psychology (sports emphasis)",
      "Associates degree in Kinesiology & Exercise Science",
    ],
    honors: [
      "3x First Team All-League",
      "2025 NCAA All-Region Defensive Team",
    ],
  },
  {
    name: "Roberto Bueno",
    role: "Co-Founder & Head Coach",
    initials: "RB",
    goal: "My goal is to develop more than just baseball players. I want to help young athletes become responsible, disciplined, confident, and hardworking individuals. I push every player to be the best version of themselves, both on and off the field, while preparing them for the demands of high school, college, and life.",
    experience: [
      "6+ years of travel baseball coaching experience",
      "Played college baseball at Compton College & CSUSB",
      "Coach for the 2029 Franklin Scout Team",
      "Franklin Scout Team features 10+ future Division I players",
      "Experience developing players from youth baseball through high school",
      "Strong high school and college coaching connections to help players find the right opportunities",
      "Associate's degree in Exercise Science",
      "Bachelor's degree in Kinesiology with an emphasis in Pedagogy",
    ],
    honors: [
      "2023 All-Conference Honors",
      "2026 USA Junior Olympics Gold Medal Champs - Head Coach (Franklin Scout Team)",
    ],
  },
  {
    name: "Crix Taveras",
    initials: "CT",
  },
  {
    name: "Julio C.",
    initials: "JC",
  },
  {
    name: "Ryan Howard",
    initials: "RH",
  },
];

function CoachCard({ coach }: { coach: Coach }) {
  const filled = Boolean(coach.goal || coach.experience?.length || coach.honors?.length);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_24px_50px_-28px_rgba(7,16,12,0.35)]">
      <div className="relative bg-green-800 px-8 py-10">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-yellow-500/15 blur-3xl" />
        <div className="relative flex flex-col items-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-ink text-bone ring-2 ring-yellow-500">
            <span className="font-display text-4xl">{coach.initials}</span>
          </div>
          <h2 className="mt-6 font-display text-4xl uppercase tracking-wide text-bone sm:text-5xl">
            {coach.name}
          </h2>
          {coach.role ? (
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-yellow-400">
              {coach.role}
            </p>
          ) : (
            <div className="mt-3 h-2.5 w-36 rounded bg-bone/20" />
          )}
        </div>
      </div>

      {filled ? (
        <div className="flex flex-1 flex-col p-7 sm:p-8">
          {coach.goal && (
            <p className="text-sm leading-relaxed text-ink/70">{coach.goal}</p>
          )}

          {coach.experience && coach.experience.length > 0 && (
            <>
              <h3 className="mt-8 font-display text-xl uppercase tracking-wide text-ink">
                Baseball Career & Experience
              </h3>
              <ul className="mt-4 space-y-2.5">
                {coach.experience.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {coach.honors && coach.honors.length > 0 && (
            <div className="mt-auto pt-8">
              <h3 className="font-display text-xl uppercase tracking-wide text-ink">
                Awards & Honors
              </h3>
              <ul className="mt-4 space-y-2.5">
                {coach.honors.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col p-7 sm:p-8">
          <div className="h-2.5 w-full rounded bg-ink/5" />
          <div className="mt-2 h-2.5 w-5/6 rounded bg-ink/5" />
          <div className="mt-2 h-2.5 w-2/3 rounded bg-ink/5" />
          <div className="mt-8 h-4 w-1/2 rounded bg-ink/10" />
          <div className="mt-4 h-2.5 w-full rounded bg-ink/5" />
          <div className="mt-2 h-2.5 w-4/5 rounded bg-ink/5" />
          <div className="mt-2 h-2.5 w-3/4 rounded bg-ink/5" />
          <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-ink/35">
            Bio drops in later
          </p>
        </div>
      )}
    </article>
  );
}

export default function StaffPage() {
  return (
    <>
      <PageHero
        eyebrow="Coaches"
        title={
          <>
            Meet The <span className="text-green-400">Staff</span>
          </>
        }
      />

      <section className="bg-bone py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <StaggerGroup className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
            {COACHES.map((coach) => (
              <StaggerItem key={coach.name} className="h-full">
                <CoachCard coach={coach} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <CTASection
        eyebrow="Join The Staff"
        title={
          <>
            Want To <span className="text-yellow-400">Coach Here?</span>
          </>
        }
        description="If you can run a cage, teach a standard, and stay in the work, send the form."
        primary={{ href: "/careers", label: "Apply Now" }}
        secondary={{ href: "/training", label: "View Training" }}
      />
    </>
  );
}
