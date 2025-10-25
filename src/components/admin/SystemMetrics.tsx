'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Cpu, Database, Users, Target } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

interface ActivityTypeData {
  name: string;
  value: number;
}

interface SystemMetricsProps {
  activityData: ActivityTypeData[];
  totalActivities: number;
  avgDuration: number | null;
  avgScore: number | null;
  totalUsers: number;
  activeUsersToday: number;
}

interface SystemStat {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  format?: (value: number) => string;
}

// Simple interface that matches Recharts expectations
interface PieChartData {
  name: string;
  value: number;
  percentage?: number;
  [key: string]: string | number | undefined; // Index signature for Recharts
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PieChartData;
  }>;
}

export function SystemMetrics({ 
  activityData, 
  totalActivities, 
  avgDuration, 
  avgScore,
  totalUsers,
  activeUsersToday 
}: SystemMetricsProps) {
  
  // Calculate system metrics based on real data
  const activeUserPercentage = totalUsers > 0 ? Math.round((activeUsersToday / totalUsers) * 100) : 0;
  const avgSessionScore = avgScore ? Math.round(avgScore) : 0;
  
  const systemStats: SystemStat[] = [
    { 
      label: 'Active Users', 
      value: activeUserPercentage, 
      icon: Users,
      format: (value) => `${value}%` 
    },
    { 
      label: 'System Load', 
      value: Math.min(100, Math.round((totalActivities / 1000) * 100)), 
      icon: Cpu,
      format: (value) => `${value}%` 
    },
    { 
      label: 'Database', 
      value: Math.min(100, Math.round((totalUsers / 5000) * 100)), 
      icon: Database,
      format: (value) => `${value}%` 
    },
    { 
      label: 'Success Rate', 
      value: avgSessionScore, 
      icon: Target,
      format: (value) => `${value}%` 
    },
  ];

  // Format activity data for pie chart with percentages
  const pieData: PieChartData[] = activityData.map(item => ({
    name: item.name.replace(/_/g, ' '),
    value: item.value,
    percentage: totalActivities > 0 ? Math.round((item.value / totalActivities) * 100) : 0
  }));

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '0m';
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            {data.value} activities ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Real-time performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {systemStats.map((stat) => (
            <div key={stat.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <stat.icon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <span className="text-sm font-medium">
                  {stat.format ? stat.format(stat.value) : `${stat.value}%`}
                </span>
              </div>
              <Progress value={stat.value} className="h-2" />
            </div>
          ))}
          
          <div className="pt-4 border-t space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg. Duration</span>
              <span className="text-sm font-medium">
                {formatDuration(avgDuration)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Activities</span>
              <span className="text-sm font-medium">
                {totalActivities.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Users</span>
              <span className="text-sm font-medium">
                {activeUsersToday} / {totalUsers}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Distribution</CardTitle>
          <CardDescription>User activities by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="truncate">{item.name}</span>
                <span className="text-gray-500">({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}