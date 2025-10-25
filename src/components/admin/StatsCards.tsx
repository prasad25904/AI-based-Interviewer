'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, BarChart3, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardsProps {
  totalUsers: number;
  totalInterviews: number;
  todayActivities: number;
  activeUsersToday: number;
  completedInterviewsToday: number;
  userGrowthPercentage: number;
  interviewTrend: number;
  activeUsersTrend: number;
  avgDuration: number | null;
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
  trend: number;
  trendType: 'positive' | 'negative' | 'neutral';
  color: string;
}

export function StatsCards({ 
  totalUsers, 
  totalInterviews, 
  todayActivities,
  activeUsersToday,
  completedInterviewsToday,
  userGrowthPercentage,
  interviewTrend,
  activeUsersTrend,
  avgDuration 
}: StatsCardsProps) {
  
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '0m';
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const stats: StatCard[] = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      description: 'Registered users in system',
      icon: Users,
      trend: userGrowthPercentage,
      trendType: userGrowthPercentage >= 0 ? 'positive' : 'negative',
      color: 'blue'
    },
    {
      title: 'Total Interviews',
      value: totalInterviews.toLocaleString(),
      description: 'Practice sessions conducted',
      icon: BarChart3,
      trend: interviewTrend,
      trendType: interviewTrend >= 0 ? 'positive' : 'negative',
      color: 'green'
    },
    {
      title: 'Active Today',
      value: activeUsersToday.toLocaleString(),
      description: `${todayActivities} total activities`,
      icon: Activity,
      trend: activeUsersTrend,
      trendType: 'positive',
      color: 'purple'
    },
    {
      title: 'Avg. Session',
      value: formatDuration(avgDuration),
      description: `${completedInterviewsToday} completed today`,
      icon: Clock,
      trend: 0,
      trendType: 'neutral',
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

  const getTrendIcon = (trendType: 'positive' | 'negative' | 'neutral') => {
    switch (trendType) {
      case 'positive':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <TrendingUp className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendText = (trend: number, trendType: 'positive' | 'negative' | 'neutral') => {
    if (trendType === 'neutral') return 'No change';
    
    const absoluteTrend = Math.abs(trend);
    const direction = trendType === 'positive' ? 'up' : 'down';
    
    return `${absoluteTrend}% ${direction} from last week`;
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
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${getColorClass(stat.color)}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                {getTrendIcon(stat.trendType)}
                <p className={`text-xs ${
                  stat.trendType === 'positive' ? 'text-green-600' : 
                  stat.trendType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {getTrendText(stat.trend, stat.trendType)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}