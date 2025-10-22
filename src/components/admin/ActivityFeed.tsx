'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Calendar, 
  Video,
  MessageSquare,
  Settings
} from 'lucide-react';

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
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'USER_REGISTERED':
      return <User className="h-4 w-4" />;
    case 'INTERVIEW_COMPLETED':
      return <Video className="h-4 w-4" />;
    case 'FEEDBACK_PROVIDED':
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'USER_REGISTERED':
      return 'bg-green-100 text-green-800';
    case 'INTERVIEW_COMPLETED':
      return 'bg-blue-100 text-blue-800';
    case 'FEEDBACK_PROVIDED':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>
          Latest user activities in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {getActivityIcon(activity.activityType)}
                </div>
                <div>
                  <p className="font-medium text-sm">{activity.user.name || activity.user.email}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className={getActivityColor(activity.activityType)}>
                      {activity.activityType.replace(/_/g, ' ').toLowerCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}