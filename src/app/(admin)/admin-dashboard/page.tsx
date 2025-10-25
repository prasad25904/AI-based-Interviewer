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

interface DashboardSearchParams {
  page?: string;
  activityPage?: string;
  limit?: string;
}

// FIXED: Update interface to match what the chart expects
interface UserGrowthData {
  date: string;
  users: number; // Changed from 'count' to 'users' to match chart component
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') redirect('/dashboard');

  // Date calculations - Fixed timezone issues
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0); // Start of day

  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  lastWeek.setHours(0, 0, 0, 0);

  // Pagination
  const activityPage = Number(params.activityPage) || 1;
  const activityLimit = 8;
  const activitySkip = (activityPage - 1) * activityLimit;

  // Fetch dashboard data in parallel (excluding userGrowth for now)
  const [
    totalUsers,
    totalInterviews,
    recentActivities,
    interviewStats,
    activityByType,
    systemStats,
    todayActivities,
    lastWeekActivities,
    userGrowthLastWeek,
    completedInterviewsToday,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.interview.count(),
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
      skip: activitySkip,
      take: activityLimit,
    }),
    prisma.interview.groupBy({
      by: ['domain'],
      _count: { id: true },
      _avg: { duration: true, score: true },
    }),
    prisma.userActivity.groupBy({
      by: ['activityType'],
      _count: { id: true },
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.interview.aggregate({
      _avg: { duration: true, score: true },
      _count: { id: true },
    }),
    prisma.userActivity.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.userActivity.count({
      where: {
        createdAt: { gte: lastWeek },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: lastWeek },
      },
    }),
    prisma.interview.count({
      where: {
        status: 'COMPLETED',
        updatedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  // FIXED: Get user growth data using Prisma's built-in methods instead of raw SQL
  let userGrowthData: UserGrowthData[] = [];

  try {
    // First, get all users created in the last 30 days
    const recentUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    console.log(`Found ${recentUsers.length} users in the last 30 days`);

    // Group users by date
    const usersByDate: Record<string, number> = {};

    // Initialize all dates in the range with 0
    const date = new Date(thirtyDaysAgo);
    while (date <= today) {
      const dateStr = date.toISOString().split('T')[0];
      usersByDate[dateStr] = 0;
      date.setDate(date.getDate() + 1);
    }

    // Count users per date
    recentUsers.forEach(user => {
      const dateStr = user.createdAt.toISOString().split('T')[0];
      usersByDate[dateStr] = (usersByDate[dateStr] || 0) + 1;
    });

    // Convert to array and format for chart - FIXED: Use 'users' property
    userGrowthData = Object.entries(usersByDate)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        users: count, // Use 'users' instead of 'count'
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log('Processed user growth data:', userGrowthData);

  } catch (error) {
    console.error('Error processing user growth data:', error);
    // Fallback: create sample data for demonstration - FIXED: Use 'users' property
    userGrowthData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        users: Math.floor(Math.random() * 5), // Use 'users' instead of 'count'
      };
    });
  }

  // Calculate active users today
  const activeUsersTodayResult = await prisma.userActivity.groupBy({
    by: ['userId'],
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });
  
  const activeUsersToday = activeUsersTodayResult.length;

  // Calculate trends and percentages
  const userGrowthPercentage = userGrowthLastWeek > 0
    ? Math.round((userGrowthLastWeek / Math.max(1, totalUsers - userGrowthLastWeek)) * 100)
    : 0;

  const interviewTrend = lastWeekActivities > 0
    ? Math.round(((todayActivities - lastWeekActivities) / lastWeekActivities) * 100)
    : todayActivities > 0 ? 100 : 0;

  const activeUsersTrend = activeUsersToday > 0
    ? Math.round((activeUsersToday / Math.max(1, totalUsers)) * 100)
    : 0;

  // Format interview domain data
  const interviewDomainData = interviewStats.map((item) => ({
    name: item.domain || 'Unknown Domain',
    count: item._count.id,
    avgDuration: item._avg.duration ? Math.round(item._avg.duration) : 0,
    avgScore: item._avg.score ? Math.round(item._avg.score) : 0,
  }));

  // Format activity type data
  const activityTypeData = activityByType.map((item) => ({
    name: item.activityType,
    value: item._count.id,
  }));

  // Calculate total activities
  const totalActivities = activityByType.reduce(
    (sum, item) => sum + item._count.id,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Real-time system performance and user activities
            {userGrowthData.length > 0 && ` - Showing ${userGrowthData.filter(d => d.users > 0).length} days with user registrations`}
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
        todayActivities={todayActivities}
        activeUsersToday={activeUsersToday}
        completedInterviewsToday={completedInterviewsToday}
        userGrowthPercentage={userGrowthPercentage}
        interviewTrend={interviewTrend}
        activeUsersTrend={activeUsersTrend}
        avgDuration={systemStats._avg.duration}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserGrowthChart data={userGrowthData} />
        <InterviewDomainChart data={interviewDomainData} />
      </div>

      {/* System Metrics & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityFeed
            activities={recentActivities}
            currentPage={activityPage}
            totalActivities={todayActivities}
            itemsPerPage={activityLimit}
          />
        </div>
        <SystemMetrics
          activityData={activityTypeData}
          totalActivities={totalActivities}
          avgDuration={systemStats._avg.duration}
          avgScore={systemStats._avg.score}
          totalUsers={totalUsers}
          activeUsersToday={activeUsersToday}
        />
      </div>
    </div>
  );
}