export type StaffCoach = {
  name: string;
  slug: string;
  role?: string;
  initials: string;
  goal?: string;
  experience?: string[];
  honors?: string[];
};

export const STAFF_COACHES: StaffCoach[] = [
  {
    name: "Carlos Vega",
    slug: "carlos-vega",
    role: "Co-Founder & Head Coach",
    initials: "CV",
    goal: "My goal is to help young athletes grow both as players and as people. Baseball is a great way to teach discipline, accountability, confidence, and the value of hard work. I want every player I work with to leave the field better than when they came in, while building the habits and mindset they need to succeed in baseball, in school, and in life. I want to instill confidence in all of my So Smooth Athletes and want them feeling trusted by me and all the coaches on the staff.",
    experience: [
      "5+ years of travel baseball experience as a Coach",
      "Private lesson, clinic, and camp experience",
      "Played at Mary Star High School",
      "Played college baseball at Cerritos College & California Lutheran University",
      "Played in 2 NCAA Regional Tournaments",
      "2025 NCAA All-Region Defensive Team Infielder",
      "3x First Team All-League at Mary Star High School",
      "Head Coach at Peninsula High School (Frosh)",
      "Varsity Infield Coach at Peninsula High School (Palos Verdes, CA)",
      "Experience developing players from youth baseball through high school",
      "Strong high school and college coaching connections to help players find the right opportunities",
      "Bachelor's degree in Psychology (sports emphasis)",
      "Associates degree in Kinesiology & Exercise Science",
    ],
    honors: ["3x First Team All-League", "2025 NCAA All-Region Defensive Team"],
  },
  {
    name: "Roberto Bueno",
    slug: "roberto-bueno",
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
    slug: "crix-taveras",
    initials: "CT",
  },
  {
    name: "Julio C.",
    slug: "julio-c",
    initials: "JC",
  },
  {
    name: "Alex Howard",
    slug: "alex-howard",
    role: "College Coach & Pitching Coordinator",
    initials: "AH",
    goal: "My journey in baseball has shaped the way I coach today. Having my playing career cut short by a career-ending car accident gave me a completely different perspective on baseball and life. It taught me how quickly things can change and how important it is to make the most of every opportunity.\n\nI gained valuable experience working at Beimel Athletics, a prestigious baseball training facility, where I oversaw the facility and helped manage programs for athletes of all levels, from middle school players to MLB athletes. During my time there, I gained hands-on experience utilizing advanced technology such as TrackMan and HitTrax to evaluate performance, analyze data, and help athletes better understand their development. I am excited to bring this experience, knowledge, and use of technology to the So Smooth athletes and provide them with another level of development both on and off the field.",
    experience: [
      "5+ years of travel baseball experience as a Coach",
      "Private lesson, clinic, and camp experience",
      "Played at Mary Star High School",
      "Collegiate pitcher at Compton College",
      "Recorded a 1.50 ERA during freshman year of college",
      "Playing career was cut short by a career-ending car accident",
      "Current Coach at Los Angeles Mission College",
      "Former employee at Beimel Athletics",
      "Experience coaching youth, travel, middle school, high school, college, and professional athletes",
      "Experience developing players in pitching, fielding, baserunning, and overall baseball IQ",
      "Experience working with athletes on pitching mechanics, movement, arm care, and player development",
    ],
  },
];

export function staffSlugForName(name: string) {
  const match = STAFF_COACHES.find(
    (coach) => coach.name.toLowerCase() === name.trim().toLowerCase(),
  );
  return match?.slug;
}
