'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Video,
  FileText,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface Activity {
  id: string;
  description: string;
  activityType: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
    image?: string | null;
  };
}

interface ActivityFeedProps {
  activities: Activity[];
  currentPage: number;
  totalActivities: number;
  itemsPerPage: number;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'LOGIN':
      return <LogIn className="h-4 w-4" />;
    case 'LOGOUT':
      return <LogOut className="h-4 w-4" />;
    case 'INTERVIEW_STARTED':
    case 'INTERVIEW_COMPLETED':
      return <Video className="h-4 w-4" />;
    case 'RESUME_UPLOADED':
      return <FileText className="h-4 w-4" />;
    case 'PROFILE_UPDATED':
      return <User className="h-4 w-4" />;
    case 'ACCOUNT_CREATED':
      return <User className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'LOGIN':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'LOGOUT':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'INTERVIEW_STARTED':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'INTERVIEW_COMPLETED':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'RESUME_UPLOADED':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'PROFILE_UPDATED':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'ACCOUNT_CREATED':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatActivityType = (type: string) => {
  return type.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export function ActivityFeed({ activities, currentPage, totalActivities, itemsPerPage }: ActivityFeedProps) {
  const totalPages = Math.ceil(totalActivities / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Showing {activities.length} of {totalActivities.toLocaleString()} activities
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={!hasPrevPage}
          >
            <Link href={`?activityPage=${currentPage - 1}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={!hasNextPage}
          >
            <Link href={`?activityPage=${currentPage + 1}`}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No activities found for this page.
            </div>
          ) : (
            activities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {getActivityIcon(activity.activityType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">
                      {activity.user.name || activity.user.email}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant="secondary" 
                        className={getActivityColor(activity.activityType)}
                      >
                        {formatActivityType(activity.activityType)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={!hasPrevPage}
            >
              <Link href={`?activityPage=${currentPage - 1}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              asChild
              disabled={!hasNextPage}
            >
              <Link href={`?activityPage=${currentPage + 1}`}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}