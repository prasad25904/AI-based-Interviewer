'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, BarChart3, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemStats {
  _avg: {
    duration: number | null;
  };
}

interface ActivityType {
  createdAt: Date;
}

interface StatsCardsProps {
  totalUsers: number;
  totalInterviews: number;
  recentActivities: ActivityType[];
  systemStats: SystemStats;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

interface StatCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  color: string;
}

export function StatsCards({ totalUsers, totalInterviews, recentActivities, systemStats }: StatsCardsProps) {
  const activeToday = recentActivities.filter(activity => 
    new Date(activity.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const avgDuration = systemStats._avg.duration ? `${Math.round(systemStats._avg.duration / 60)}m` : '0m';

  const stats: StatCard[] = [
    {
      title: 'Total Users',
      value: totalUsers,
      description: 'Registered users in system',
      icon: Users,
      trend: '+12%',
      color: 'blue'
    },
    {
      title: 'Interviews',
      value: totalInterviews,
      description: 'Practice sessions conducted',
      icon: BarChart3,
      trend: '+8%',
      color: 'green'
    },
    {
      title: 'Active Today',
      value: activeToday,
      description: 'Activities in last 24 hours',
      icon: Activity,
      trend: '+5%',
      color: 'purple'
    },
    {
      title: 'Avg. Session',
      value: avgDuration,
      description: 'Average interview duration',
      icon: Clock,
      trend: '+2%',
      color: 'orange'
    }
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-green-500';
      case 'purple': return 'text-purple-500';
      case 'orange': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${getColorClass(stat.color)}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <p className="text-xs text-muted-foreground">
                  {stat.trend} from last week
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}