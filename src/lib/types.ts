export interface NavLink {
  label: string;
  href: string;
}

export interface LearningLevel {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
}

export interface DroneComponent {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ApplicationCard {
  title: string;
  description: string;
  icon: string;
  color: string;
}
