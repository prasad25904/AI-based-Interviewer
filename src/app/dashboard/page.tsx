// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import DashboardContent from '@/components/dashboard-content';
import { Session } from '@/lib/types';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions) as Session;

  if (!session) {
    redirect('/login');
  }

  const [user, recentInterviews, resumeCount, totalInterviews] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    }),
    prisma.interview.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.resume.count({
      where: { userId: session.user.id },
    }),
    prisma.interview.count({
      where: { userId: session.user.id },
    }),
  ]);

  return (
    <DashboardContent
      session={session}
      user={user}
      recentInterviews={recentInterviews}
      resumeCount={resumeCount}
      totalInterviews={totalInterviews}
    />
  );
}