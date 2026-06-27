export interface ChapterData {
  id: number;
  label: string;
  number: string;
  question: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: { icon: string; text: string }[];
  blocks: RevealBlock[];
}

export interface RevealBlock {
  key: string;
  heading: string;
  type: "outcomes" | "equipment" | "assessment" | "projects" | "deliverables" | "technologies" | "industry";
  data: string[] | { label: string; value: number }[] | { name: string; desc: string }[];
}

export const CHAPTERS: ChapterData[] = [
  /* ─── Level 1 ─── */
  {
    id: 1,
    label: "Level 1",
    number: "01",
    question: "What will I learn?",
    title: "Drone Systems\nFundamentals",
    subtitle: "Start your journey into the world of unmanned aerial systems.",
    description:
      "Build a strong STEM foundation while exploring flight principles, drone architecture, safety regulations, and real-world applications. No prior experience needed.",
    highlights: [
      { icon: "flight", text: "Understand how drones fly and what makes them stay in the air" },
      { icon: "memory", text: "Identify every major component and its function in the system" },
      { icon: "verified", text: "Learn safety protocols and industry best practices from day one" },
    ],
    blocks: [
      {
        key: "outcomes",
        heading: "Learning Outcomes",
        type: "outcomes",
        data: [
          "Understand drone structure and aerodynamics",
          "Identify major components and their roles",
          "Explain principles of flight and stability",
          "Apply safety guidelines in practical scenarios",
          "Explore real-world drone applications across industries",
        ],
      },
      {
        key: "equipment",
        heading: "Equipment",
        type: "equipment",
        data: [
          { name: "Educational Mini Drone", desc: "Safe indoor flyer for hands-on practice" },
          { name: "Flight Simulator", desc: "Realistic physics-based training software" },
          { name: "Drone Components Kit", desc: "Full set of parts for assembly exercises" },
          { name: "Safety Kit", desc: "Goggles, landing pad, and charging station" },
        ],
      },
      {
        key: "assessment",
        heading: "Assessment",
        type: "assessment",
        data: [
          { label: "Theory", value: 20 },
          { label: "Practical", value: 30 },
          { label: "Mini Project", value: 30 },
          { label: "Presentation", value: 20 },
        ],
      },
      {
        key: "projects",
        heading: "Mini Project",
        type: "projects",
        data: [
          "Drone Application Analysis — Research where drones solve real problems",
          "Present findings with visual case studies and industry examples",
        ],
      },
      {
        key: "deliverables",
        heading: "Deliverables",
        type: "deliverables",
        data: ["Certificate of Completion", "Mini Project Report", "Portfolio Entry", "Knowledge Assessment"],
      },
    ],
  },

  /* ─── Level 2 ─── */
  {
    id: 2,
    label: "Level 2",
    number: "02",
    question: "What will I build?",
    title: "LEO Educational\nDrone",
    subtitle: "Assemble, test, and fly your own fully functional drone.",
    description:
      "Build a complete drone from individual components. Every screw, wire, and solder joint teaches you how a flying machine really works.",
    highlights: [
      { icon: "build", text: "Assemble a complete drone from frame to flight controller" },
      { icon: "bolt", text: "Wire motors, ESCs, and power systems with confidence" },
      { icon: "flight_takeoff", text: "Calibrate, test, and fly your own creation" },
    ],
    blocks: [
      {
        key: "outcomes",
        heading: "What You'll Build",
        type: "outcomes",
        data: [
          "Fully assembled LEO educational drone",
          "Properly wired power distribution board",
          "Calibrated flight controller with stable PID tuning",
          "Flight-ready system with tested performance",
        ],
      },
      {
        key: "equipment",
        heading: "Components",
        type: "equipment",
        data: [
          { name: "LEO Drone Kit", desc: "Complete frame, arms, and hardware" },
          { name: "Flight Controller", desc: "Programmable brain of the drone" },
          { name: "Brushless Motors", desc: "2205 2300KV with titanium shaft" },
          { name: "Electronic Speed Controllers", desc: "32-bit 60A 4-in-1 ESC" },
          { name: "Propellers", desc: "5.1 inch tri-blade composite set" },
          { name: "LiPo Battery", desc: "6S 1300mAh graphene pack" },
          { name: "GPS Module", desc: "Ublox M9N multi-constellation" },
          { name: "Radio Transmitter", desc: "Full-range 2.4 GHz control link" },
        ],
      },
      {
        key: "assessment",
        heading: "Assessment",
        type: "assessment",
        data: [
          { label: "Theory", value: 20 },
          { label: "Build Project", value: 40 },
          { label: "Flight Test", value: 20 },
          { label: "Documentation", value: 20 },
        ],
      },
      {
        key: "deliverables",
        heading: "Deliverables",
        type: "deliverables",
        data: [
          "Assembled LEO Drone",
          "System Check Report",
          "Flight Performance Log",
          "Troubleshooting Journal",
          "Build Reflection",
        ],
      },
    ],
  },

  /* ─── Level 3 ─── */
  {
    id: 3,
    label: "Level 3",
    number: "03",
    question: "What technologies will I master?",
    title: "Advanced Drone\nTechnology",
    subtitle: "Program autonomous missions and integrate intelligent systems.",
    description:
      "Move from assembly to programming. Code autonomous flight paths, integrate sensors, and build drones that see, think, and decide.",
    highlights: [
      { icon: "terminal", text: "Program flight controllers and autonomous mission logic" },
      { icon: "sensors", text: "Integrate obstacle detection, telemetry, and data links" },
      { icon: "psychology", text: "Apply AI and computer vision to real drone systems" },
    ],
    blocks: [
      {
        key: "technologies",
        heading: "Technologies You'll Master",
        type: "technologies",
        data: [
          "Embedded Systems & ESP32 Programming",
          "ArduPilot / Pixhawk Flight Stack",
          "Sensor Integration & Data Fusion",
          "Telemetry Radio Communication",
          "Computer Vision & Object Detection",
          "Autonomous Mission Planning",
        ],
      },
      {
        key: "equipment",
        heading: "Advanced Equipment",
        type: "equipment",
        data: [
          { name: "ESP32 Drone Kit", desc: "Programmable micro-controller based system" },
          { name: "Pixhawk Flight Controller", desc: "Professional-grade autopilot hardware" },
          { name: "Obstacle Sensors", desc: "LIDAR and ultrasonic ranging modules" },
          { name: "Telemetry Radio", desc: "Real-time data link for mission control" },
          { name: "FPV Camera System", desc: "First-person view with video transmission" },
          { name: "GPS / RTK Module", desc: "Centimeter-accurate positioning" },
        ],
      },
      {
        key: "projects",
        heading: "Innovation Projects",
        type: "projects",
        data: [
          "Autonomous Waypoint Navigation — Program a drone to fly a mission autonomously",
          "Search & Rescue Simulation — Use computer vision to locate targets from the air",
        ],
      },
      {
        key: "assessment",
        heading: "Assessment",
        type: "assessment",
        data: [
          { label: "Theory", value: 20 },
          { label: "Programming", value: 30 },
          { label: "Innovation Project", value: 30 },
          { label: "Presentation", value: 20 },
        ],
      },
      {
        key: "deliverables",
        heading: "Deliverables",
        type: "deliverables",
        data: [
          "Advanced Drone Prototype",
          "Mission Code Repository",
          "Technical Documentation",
          "Field Test Report",
          "Project Presentation",
        ],
      },
    ],
  },

  /* ─── Level 4 ─── */
  {
    id: 4,
    label: "Level 4",
    number: "04",
    question: "What problems will I solve?",
    title: "Expert Drone\nEngineering",
    subtitle: "Design professional autonomous systems that solve real challenges.",
    description:
      "Combine everything you've learned to build industry-grade solutions. Work on real-world problems and graduate with a portfolio that proves your expertise.",
    highlights: [
      { icon: "rocket_launch", text: "Design and deploy professional autonomous drone systems" },
      { icon: "groups", text: "Collaborate on real-world industry projects and challenges" },
      { icon: "stadia_controller", text: "Master swarm coordination, AI, and advanced telemetry" },
    ],
    blocks: [
      {
        key: "technologies",
        heading: "Advanced Capabilities",
        type: "technologies",
        data: [
          "Swarm Coordination & Multi-Drone Systems",
          "AI-Powered Object Tracking & Analytics",
          "Real-Time Telemetry & Data Visualization",
          "Secure Communication & Cyber Security",
          "Payload Design & Mission Planning",
        ],
      },
      {
        key: "projects",
        heading: "Real-World Projects",
        type: "projects",
        data: [
          "Autonomous Delivery System — Design a drone that delivers payloads to GPS coordinates",
          "Swarm Communication Network — Coordinate multiple drones for area coverage",
          "Environmental Mapping — Generate high-resolution terrain maps from aerial data",
        ],
      },
      {
        key: "industry",
        heading: "Industry Focus",
        type: "industry",
        data: [
          "Work on industry-sponsored projects with real requirements",
          "Receive mentorship from experienced aerospace engineers",
          "Build career-ready skills for drone, aviation, and robotics sectors",
        ],
      },
      {
        key: "deliverables",
        heading: "Graduation Deliverables",
        type: "deliverables",
        data: [
          "Professional-Grade Drone System",
          "Complete Technical Portfolio",
          "Industry Project Report",
          "Flight Hours Logbook",
          "Expert Certification",
        ],
      },
    ],
  },
];
