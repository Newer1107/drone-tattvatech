import type { NavLink, LearningLevel, DroneComponent, ApplicationCard } from "./types";

export const NAV_LINKS: NavLink[] = [
  { label: "Academy", href: "#academy" },
  { label: "Builder", href: "#builder" },
  { label: "Impact", href: "#impact" },
  { label: "Projects", href: "#projects" },
];

export const LEARNING_LEVELS: LearningLevel[] = [
  {
    id: 1,
    title: "Fundamentals",
    description: "Aerodynamics, physics of flight, and safety protocols.",
    icon: "book_2",
    unlocked: true,
    progress: 100,
  },
  {
    id: 2,
    title: "Build & Mechanics",
    description: "Component selection, soldering, and structural assembly.",
    icon: "build",
    unlocked: false,
  },
  {
    id: 3,
    title: "Programming & Telemetry",
    description: "Flight controllers, PID tuning, and data transmission.",
    icon: "terminal",
    unlocked: false,
  },
  {
    id: 4,
    title: "AI & Autonomy",
    description: "Computer vision, pathfinding, and autonomous missions.",
    icon: "memory",
    unlocked: false,
  },
];

export const DRONE_COMPONENTS: DroneComponent[] = [
  { id: "frame", name: "Carbon Frame", description: "Lightweight 3K carbon fiber unibody chassis", icon: "grid_view" },
  { id: "motors", name: "Brushless Motors", description: "2205 2300KV race-spec motors with titanium shaft", icon: "speed" },
  { id: "esc", name: "Electronic Speed Controllers", description: "32-bit 60A BLHeli_32 4-in-1 ESC", icon: "bolt" },
  { id: "battery", name: "LiPo Battery", description: "6S 1300mAh 100C graphene pack", icon: "battery_std" },
  { id: "camera", name: "4K Camera System", description: "Sony IMX477 12MP with 2-axis mechanical stabilization", icon: "videocam" },
  { id: "gps", name: "GPS Module", description: "Ublox M9N multi-constellation with compass", icon: "satellite_alt" },
  { id: "props", name: "Propellers", description: "5.1x4.6 tri-blade nylon-glass composite", icon: "propeller" },
  { id: "complete", name: "Ready to Fly", description: "Calibrated, tuned, and flight-tested", icon: "check_circle" },
];

export const APPLICATION_CARDS: ApplicationCard[] = [
  {
    title: "Search & Rescue",
    description: "Autonomous thermal imaging sweeps for disaster response teams.",
    icon: "emergency",
    color: "#ff6a00",
  },
  {
    title: "Aerial Cinematography",
    description: "Professional-grade stabilized footage for film and broadcast.",
    icon: "movie",
    color: "#a14000",
  },
  {
    title: "Precision Agriculture",
    description: "Multispectral crop health analysis with autonomous flight paths.",
    icon: "agriculture",
    color: "#fc8a40",
  },
  {
    title: "Infrastructure Inspection",
    description: "AI-driven structural integrity analysis of bridges and towers.",
    icon: "domain",
    color: "#9b4500",
  },
  {
    title: "Environmental Research",
    description: "Wildlife tracking, forest monitoring, and climate data collection.",
    icon: "forest",
    color: "#795835",
  },
  {
    title: "Delivery Logistics",
    description: "Last-mile autonomous package delivery in urban environments.",
    icon: "local_shipping",
    color: "#ff6a00",
  },
];

export const SKILLS_BENTO = [
  {
    title: "Applied Problem Solving",
    description: "Troubleshoot complex hardware and software integrations in real-time. Drones represent the perfect intersection of physical mechanics and digital logic.",
    icon: "psychology",
    span: "col-span-2 row-span-2",
  },
  {
    title: "STEM Core",
    description: "Practical physics, math, and coding.",
    icon: "data_object",
    span: "",
  },
  {
    title: "Innovation",
    description: "Design bespoke solutions for unique challenges.",
    icon: "rocket_launch",
    span: "",
  },
];
