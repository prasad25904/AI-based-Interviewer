import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Download, Search } from 'lucide-react';
import { ActivityType, UserActivity, User } from '@prisma/client';
import Link from 'next/link';

type ActivityWithUser = UserActivity & {
  user: Pick<User, 'name' | 'email'>;
};

interface WhereClause {
  activityType?: ActivityType;
  OR?: Array<{
    description?: { contains: string; mode: 'insensitive' };
    user?: { 
      name?: { contains: string; mode: 'insensitive' };
      email?: { contains: string; mode: 'insensitive' };
    };
  }>;
}

export default async function AdminActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await searchParams before using it
  const params = await searchParams;
  
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') redirect('/dashboard');

  // Use the awaited params object
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 50;
  const activityTypeParam = params.type as string;
  const searchQuery = params.search as string;

  // Build where clause with multiple conditions
  const whereClause: WhereClause = {};

  // Filter by activity type if provided and valid
  if (activityTypeParam && Object.values(ActivityType).includes(activityTypeParam as ActivityType)) {
    whereClause.activityType = activityTypeParam as ActivityType;
  }

  // Search in description if search query provided
  if (searchQuery) {
    whereClause.OR = [
      { description: { contains: searchQuery, mode: 'insensitive' } },
      { user: { name: { contains: searchQuery, mode: 'insensitive' } } },
      { user: { email: { contains: searchQuery, mode: 'insensitive' } } },
    ];
  }

  const [activities, totalCount] = await Promise.all([
    prisma.userActivity.findMany({
      where: whereClause,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }) as Promise<ActivityWithUser[]>,
    prisma.userActivity.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  const getActivityColor = (type: ActivityType) => {
    const colors = {
      [ActivityType.LOGIN]: 'bg-green-100 text-green-800 border-green-200',
      [ActivityType.LOGOUT]: 'bg-gray-100 text-gray-800 border-gray-200',
      [ActivityType.INTERVIEW_STARTED]: 'bg-blue-100 text-blue-800 border-blue-200',
      [ActivityType.INTERVIEW_COMPLETED]: 'bg-purple-100 text-purple-800 border-purple-200',
      [ActivityType.RESUME_UPLOADED]: 'bg-orange-100 text-orange-800 border-orange-200',
      [ActivityType.PROFILE_UPDATED]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [ActivityType.ACCOUNT_CREATED]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatActivityType = (type: ActivityType) => {
    return type.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600">Monitor all user activities in the system</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <form>
                <Input
                  name="search"
                  placeholder="Search activities, users, or emails..."
                  className="pl-10"
                  defaultValue={searchQuery}
                />
              </form>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/admin-activities">
                <Button variant={!activityTypeParam ? "default" : "outline"} size="sm">
                  All Activities
                </Button>
              </Link>
              {Object.values(ActivityType).map((type) => (
                <Link 
                  key={type} 
                  href={`/admin-activities?type=${type}${searchQuery ? `&search=${searchQuery}` : ''}`}
                >
                  <Button 
                    variant={activityTypeParam === type ? "default" : "outline"} 
                    size="sm"
                  >
                    {formatActivityType(type)}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          {(searchQuery || activityTypeParam) && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: &quot;{searchQuery}&quot;
                </Badge>
              )}
              {activityTypeParam && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Type: {formatActivityType(activityTypeParam as ActivityType)}
                </Badge>
              )}
              <Link href="/admin-activities" className="text-blue-600 hover:text-blue-800 text-sm">
                Clear all
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            {totalCount} activities found
            {totalPages > 1 && ` • Page ${page} of ${totalPages}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No activities found matching your criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border">
                        <span className="text-sm font-medium text-gray-600">
                          {activity.user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-sm text-gray-900">
                          {activity.user.name || 'Unknown User'}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={getActivityColor(activity.activityType)}
                        >
                          {formatActivityType(activity.activityType)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Link 
            href={`/admin-activities?page=${Math.max(1, page - 1)}${activityTypeParam ? `&type=${activityTypeParam}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`}
          >
            <Button variant="outline" disabled={page <= 1}>
              Previous
            </Button>
          </Link>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Link 
            href={`/admin-activities?page=${Math.min(totalPages, page + 1)}${activityTypeParam ? `&type=${activityTypeParam}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`}
          >
            <Button variant="outline" disabled={page >= totalPages}>
              Next
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}