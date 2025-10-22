import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import Link from 'next/link';

// Components
import { StatsCards } from '@/components/admin/StatsCards';
import { UserGrowthChart } from '@/components/admin/charts/UserGrowthChart';
import { InterviewDomainChart } from '@/components/admin/charts/InterviewDomainChart';
import { ActivityFeed } from '@/components/admin/ActivityFeed';
import { SystemMetrics } from '@/components/admin/SystemMetrics';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // ✅ Ensure authentication
  if (!session) {
    redirect('/login');
  }

  // ✅ Ensure admin access
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // ✅ Fetch all dashboard data in parallel
  const [
    totalUsers,
    totalInterviews,
    recentActivities,
    userGrowth,
    interviewStats,
    activityByType,
    systemStats,
  ] = await Promise.all([
    // Total users count
    prisma.user.count(),

    // Total interviews count
    prisma.interview.count(),

    // Recent user activities
    prisma.userActivity.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),

    // ✅ User growth data (last 30 days) - SQLite syntax
    prisma.$queryRawUnsafe(`
      SELECT 
        DATE(createdAt) AS date,
        COUNT(*) AS count
      FROM users
      WHERE createdAt >= DATE('now', '-30 day')
      GROUP BY DATE(createdAt)
      ORDER BY date;
    `) as Promise<{ date: string; count: bigint }[]>,

    // Interview statistics grouped by domain
    prisma.interview.groupBy({
      by: ['domain'],
      _count: { id: true },
    }),

    // Activity type distribution
    prisma.userActivity.groupBy({
      by: ['activityType'],
      _count: { id: true },
    }),

    // Average interview duration
    prisma.interview.aggregate({
      _avg: { duration: true },
    }),
  ]);

  // ✅ Format user growth data for chart display
  const userGrowthData = userGrowth.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    users: Number(item.count),
  }));

  // ✅ Format interview domain data for chart
  const interviewDomainData = interviewStats.map((item) => ({
    name: item.domain,
    count: item._count.id,
  }));

  // ✅ Format activity type data for system metrics
  const activityTypeData = activityByType.map((item) => ({
    name: item.activityType,
    value: item._count.id,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Monitor system performance and user activities
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin-settings">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards
        totalUsers={totalUsers}
        totalInterviews={totalInterviews}
        recentActivities={recentActivities}
        systemStats={systemStats}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserGrowthChart data={userGrowthData} />
        <InterviewDomainChart data={interviewDomainData} />
      </div>

      {/* System Metrics & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityFeed activities={recentActivities} />
        </div>
        <SystemMetrics
          activityData={activityTypeData}
          avgDuration={systemStats._avg.duration}
        />
      </div>
    </div>
  );
}
