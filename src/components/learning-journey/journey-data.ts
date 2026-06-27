export interface LevelContent {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  learnItems: string[];
  outcomes: string[];
  stemIntegration?: { subject: string; topics: string[] }[];
  learningMethod: string[];
  assessment: { label: string; value: string }[];
  equipment: string[];
  miniProject: string;
  deliverables: string[];
  extraSections?: { title: string; items: string[] }[];
}

export const LEVELS: LevelContent[] = [
  /* ───── Level 1 ───── */
  {
    id: 1,
    badge: "Level 1",
    title: "Drone Systems Fundamentals",
    subtitle: "Learn • Explore • Understand • Apply",
    description:
      "Level 1 introduces students to the world of drones. Students learn the basics of Unmanned Aerial Systems (UAS), flight principles, drone architecture, safety regulations and real-world applications. The objective is to build curiosity while creating a strong STEM foundation.",
    learnItems: [
      "UAV Architecture & Components",
      "Flight Principles",
      "Safety & Regulations",
      "Basic Drone Operations",
      "Industry Applications",
    ],
    outcomes: [
      "Understand drone structure",
      "Identify major components",
      "Explain principles of flight",
      "Learn safety guidelines",
      "Explore real-world drone applications",
    ],
    stemIntegration: [
      { subject: "Science", topics: ["Aerodynamics", "Flight forces"] },
      { subject: "Technology", topics: ["Drone systems", "Simulation"] },
      { subject: "Engineering", topics: ["Mechanical design", "System integration"] },
      { subject: "Mathematics", topics: ["Measurement", "Angles", "Directions"] },
    ],
    learningMethod: ["Interactive sessions", "Demonstrations", "Group discussions", "Mini projects", "Presentation"],
    assessment: [
      { label: "Theory", value: "20%" },
      { label: "Practical Activities", value: "30%" },
      { label: "Mini Project", value: "30%" },
      { label: "Presentation", value: "20%" },
    ],
    equipment: [
      "Educational Mini Drone",
      "Flight Simulator",
      "Drone Components",
      "Battery & Charger",
      "Safety Accessories",
      "Teaching Kit",
    ],
    miniProject: "Drone Application Analysis Report — Students research where drones are used in the real world.",
    deliverables: ["Certificate", "Mini Project Report", "Portfolio", "Knowledge Assessment"],
    extraSections: [
      {
        title: "Course Details",
        items: ["Duration: 40 hours", "Format: In-person + Simulation", "Prerequisites: None", "Class Size: 12 max"],
      },
    ],
  },

  /* ───── Level 2 ───── */
  {
    id: 2,
    badge: "Level 2",
    title: "LEO Educational Drone",
    subtitle: "Build • Understand • Fly",
    description:
      "Students assemble a complete educational drone from individual components. The emphasis is on mechanical assembly, electrical integration and understanding how every subsystem contributes to flight.",
    learnItems: [
      "Drone Assembly",
      "Mechanical Systems",
      "Electrical Integration",
      "Flight Systems",
      "Testing & Calibration",
      "Maintenance",
    ],
    outcomes: [
      "Assemble the drone",
      "Understand component functions",
      "Perform wiring",
      "Calibrate the flight controller",
      "Test flight performance",
      "Troubleshoot issues",
    ],
    stemIntegration: [
      { subject: "Physics", topics: ["Electronics", "Flight dynamics"] },
      { subject: "Engineering", topics: ["Mechanical", "Systems integration"] },
      { subject: "Mathematics", topics: ["Measurements", "Calculations"] },
    ],
    learningMethod: ["Build", "Understand", "Test", "Calibrate", "Fly"],
    assessment: [
      { label: "Theory", value: "20%" },
      { label: "Practical", value: "30%" },
      { label: "Build Project", value: "30%" },
      { label: "Presentation", value: "20%" },
    ],
    equipment: [
      "LEO Drone Kit",
      "Flight Controller",
      "Brushless Motors",
      "ESC",
      "Propellers",
      "Battery",
      "GPS Module",
      "FPV Camera",
      "Radio Transmitter",
      "Tools",
    ],
    miniProject: "Build, Test and Fly your own drone.",
    deliverables: [
      "Assembled Drone",
      "System Check Report",
      "Flight Report",
      "Troubleshooting Log",
      "Reflection Report",
    ],
  },

  /* ───── Level 3 ───── */
  {
    id: 3,
    badge: "Level 3",
    title: "Advanced Drone Technology & Innovation",
    subtitle: "Code • Integrate • Automate",
    description:
      "Students transition from assembly into programming, autonomous systems and intelligent flight. Focus shifts toward coding, embedded systems and real-world innovation.",
    learnItems: [
      "Advanced Drone Design",
      "Programming & Autonomy",
      "Sensors & Data Analytics",
      "Communication Systems",
      "AI & Computer Vision",
      "Mission Planning",
      "Safety & Ethics",
    ],
    outcomes: [
      "Design advanced drone systems",
      "Program autonomous missions",
      "Integrate sensors",
      "Develop practical drone solutions",
      "Understand regulations",
    ],
    learningMethod: ["Concepts", "Hands-on Workshops", "Coding", "Prototype", "Testing", "Deployment"],
    assessment: [
      { label: "Theory", value: "20%" },
      { label: "Practical", value: "30%" },
      { label: "Project", value: "30%" },
      { label: "Presentation", value: "20%" },
    ],
    equipment: [
      "ESP32 Drone Kit",
      "Pixhawk / Ardupilot",
      "Brushless Motors",
      "ESC",
      "Propellers",
      "Battery",
      "GPS / RTK",
      "Telemetry Radio",
      "FPV Camera",
      "Tools",
    ],
    miniProject: "Program an autonomous mission with sensor integration.",
    deliverables: [
      "Advanced Drone Prototype",
      "Project Documentation",
      "Code",
      "Testing Report",
      "Presentation",
    ],
    extraSections: [
      {
        title: "Innovation Projects",
        items: ["Agriculture Drone", "Search & Rescue", "Environmental Monitoring", "Smart Surveillance"],
      },
      {
        title: "Core Components",
        items: [
          "High Efficiency Motors",
          "Advanced Flight Controller",
          "ESC",
          "LiPo Battery",
          "FPV Camera",
          "Carbon Fiber Frame",
          "GNSS Module",
          "Obstacle Sensors",
          "Telemetry Radio",
        ],
      },
    ],
  },

  /* ───── Level 4 ───── */
  {
    id: 4,
    badge: "Level 4",
    title: "Expert Drone Engineering & Innovation",
    subtitle: "Design • Deploy • Lead",
    description:
      "Students design professional-grade autonomous drone systems capable of solving real-world engineering problems.",
    learnItems: [
      "Embedded Systems",
      "Advanced Controllers",
      "Artificial Intelligence",
      "Autonomous Navigation",
      "Swarm Technology",
      "Telemetry",
      "Advanced Communication",
      "Cyber Security",
      "Payload Design",
      "Mission Planning",
      "Industry Deployment",
    ],
    outcomes: [
      "Professional drone design",
      "AI integration",
      "Swarm communication",
      "Real-time analytics",
      "Industry-ready solutions",
      "Leadership",
    ],
    learningMethod: ["Advanced Concepts", "Design", "Develop", "Optimize", "Deploy"],
    assessment: [
      { label: "Theory", value: "20%" },
      { label: "Practical", value: "30%" },
      { label: "Innovation Project", value: "30%" },
      { label: "Presentation", value: "20%" },
    ],
    equipment: [
      "Brushless Motors",
      "Carbon Frame",
      "ESP32",
      "Flight Controller",
      "GPS / RTK",
      "Telemetry",
      "High Capacity LiPo",
      "4K Camera",
      "High Power ESC",
    ],
    miniProject: "Design and deploy a professional autonomous drone solution.",
    deliverables: [
      "Expert-level Drone System",
      "Technical Documentation",
      "AI/ML Codebase",
      "Field Test Report",
      "Industry Presentation",
    ],
    extraSections: [
      {
        title: "Advanced Projects",
        items: ["Autonomous Delivery", "Swarm Communication", "AI Object Tracking", "Search & Rescue", "Environmental Mapping"],
      },
      {
        title: "Industry Focus",
        items: ["Industry Projects", "Mentorship", "Career Readiness", "Innovation", "Future Technologies"],
      },
    ],
  },
];

export const FINAL_STAGE = {
  headline: "From Curiosity to Innovation.",
  description:
    "Students graduate with practical engineering skills, project experience, programming knowledge and industry-ready confidence.",
  cta: "Explore the Complete Curriculum",
};
