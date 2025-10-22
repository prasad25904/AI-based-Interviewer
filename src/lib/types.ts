// lib/types.ts
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
}

export interface Session {
  user: User;
}

export interface Interview {
  id: string;
  title: string;
  domain: string;
  level: string;
  status: string;
  createdAt: Date;
}

export interface DashboardProps {
  session: Session;
  user: {
    role: string;
  } | null;
  recentInterviews: Interview[];
  resumeCount: number;
  totalInterviews: number;
}