export interface Feature {
  title: string;
  description: string;
}

export interface ChapterData {
  id: number;
  chapterNum: string;
  chapterTitle: string;
  badge: string;
  subtitle: string;
  description: string;
  features: Feature[];
  layout: "classroom" | "workshop" | "lab" | "mission";
}

export const CHAPTERS: ChapterData[] = [
  {
    id: 1,
    chapterNum: "01",
    chapterTitle: "Build the Foundation",
    badge: "Level 1",
    subtitle: "Start your aerospace journey here.",
    description: "Master the physics, architecture, and safety that power every unmanned aircraft flying today.",
    features: [
      { title: "Drone Architecture", description: "Every component that makes flight possible — from frame to flight controller." },
      { title: "Flight Principles", description: "Lift, thrust, drag, and weight — the four forces every pilot understands." },
      { title: "Safety & Operations", description: "Rules of the sky. Safe pre-flight checks and responsible flying." },
    ],
    layout: "classroom",
  },
  {
    id: 2,
    chapterNum: "02",
    chapterTitle: "Build Your First Drone",
    badge: "Level 2",
    subtitle: "Assemble. Test. Fly.",
    description: "Build a complete LEO drone from individual components. Every wire and solder joint teaches you how it works.",
    features: [
      { title: "Frame & Structure", description: "Carbon fibre unibody that holds everything together under stress." },
      { title: "Power & Propulsion", description: "Motors, ESCs, and batteries working together to generate thrust." },
      { title: "Flight Controller", description: "The brain. Gyros, accelerometers, and PID loops keep it stable." },
    ],
    layout: "workshop",
  },
  {
    id: 3,
    chapterNum: "03",
    chapterTitle: "Engineer Intelligence",
    badge: "Level 3",
    subtitle: "Code. Sense. Automate.",
    description: "Program autonomous missions, integrate sensors, and give your drone the ability to see and decide.",
    features: [
      { title: "Autonomous Flight", description: "Mission planning, waypoint navigation, and computer vision." },
      { title: "Sensor Fusion", description: "LIDAR, GPS, IMU — combining data for precise positioning." },
      { title: "AI & Telemetry", description: "Real-time data links and onboard intelligence for smart decisions." },
    ],
    layout: "lab",
  },
  {
    id: 4,
    chapterNum: "04",
    chapterTitle: "Create Autonomous Systems",
    badge: "Level 4",
    subtitle: "Solve real problems at scale.",
    description: "Design, deploy, and lead professional drone operations solving real-world engineering challenges.",
    features: [
      { title: "Swarm Coordination", description: "Multiple drones communicating and cooperating in real time." },
      { title: "Mission Planning", description: "Autonomous delivery, search & rescue, and environmental mapping." },
      { title: "Industry Deployment", description: "Take your skills from the lab to production-grade operations." },
    ],
    layout: "mission",
  },
];
