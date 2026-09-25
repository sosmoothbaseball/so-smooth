export type StaffCoach = {
  name: string;
  slug: string;
  role?: string;
  initials: string;
  photo?: string;
  photoPosition?: string;
  photoFit?: "cover" | "contain";
  goal?: string;
  experience?: string[];
  honors?: string[];
  instagram?: string;
  link?: { href: string; label: string };
};

export const STAFF_COACHES: StaffCoach[] = [
  {
    name: "Carlos Vega",
    slug: "carlos-vega",
    role: "Co-Founder / Head Coach",
    initials: "CV",
    photo: "/staff/carlos-vega.jpg",
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
    instagram: "https://www.instagram.com/coach.carlosvega",
  },
  {
    name: "Roberto Bueno",
    slug: "roberto-bueno",
    role: "Co-Founder / Head Coach",
    initials: "RB",
    photo: "/staff/roberto-bueno.jpg",
    photoFit: "contain",
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
    instagram: "https://www.instagram.com/buenoo_07",
  },
  {
    name: "Crix Taveras",
    slug: "crix-taveras",
    role: "Player Development / Assistant Coach",
    initials: "CT",
    goal: "My goal as a coach is to give young players as much knowledge as possible while helping them develop both their skills and their understanding of the game. Having played at the college and professional levels, I want to pass down the lessons and experiences I’ve gained throughout my career. I want to see each player strive to get better, build confidence, and reach their full potential. Ultimately, my goal is to help players reach the next level, whether that means becoming a high-level high school player, playing college baseball, or eventually pursuing a career in professional baseball.",
    experience: [
      "Professional baseball player with experience at the high school, college, and professional levels",
      "Played at Long Beach Wilson High School",
      "Played college baseball at Point Park University",
      "Played professionally for the Toronto Maple Leafs and the Evansville Otters",
      "Majored in Marketing at Point Park University",
      "Played professional baseball in the Frontier League and Mexico",
      "Experience competing alongside high-level professional players, including Yasiel Puig & more",
      "24 doubles, 1 triple, and 13 home runs",
      "81 RBIs throughout college career in 98 games",
      "Experience developing players and teaching the game from a player’s perspective",
      "Focus on player development, baseball IQ, confidence, and preparation for the next level",
    ],
    honors: [
      "First Team All-Conference",
      "Multiple-time All-American in college",
      ".347 career college batting average",
      ".434 career on-base percentage",
      ".561 career slugging percentage",
      ".995 career OPS",
    ],
    instagram: "https://www.instagram.com/crixtaveras13",
    link: {
      href: "https://www.baseball-reference.com/register/player.fcgi?id=tavera000cri",
      label: "Baseball Reference",
    },
  },
  {
    name: "Julio C.",
    slug: "julio-c",
    initials: "JC",
  },
  {
    name: "Alex Howard",
    slug: "alex-howard",
    role: "College Coach / Pitching Coordinator",
    initials: "AH",
    photo: "/staff/alex-howard.jpg",
    photoPosition: "object-center",
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
    instagram: "https://www.instagram.com/coach.alexhoward",
  },
];

export function staffSlugForName(name: string) {
  const match = STAFF_COACHES.find(
    (coach) => coach.name.toLowerCase() === name.trim().toLowerCase(),
  );
  return match?.slug;
}
