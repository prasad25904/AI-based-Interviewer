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
import { Clock, Cpu, Database, Users } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ActivityTypeData {
  name: string;
  value: number;
}

interface SystemMetricsProps {
  activityData: ActivityTypeData[];
  avgDuration: number | null;
}

interface SystemStat {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}

export function SystemMetrics({ activityData, avgDuration }: SystemMetricsProps) {
  const systemStats: SystemStat[] = [
    { label: 'CPU Usage', value: 45, icon: Cpu },
    { label: 'Memory', value: 68, icon: Database },
    { label: 'Active Sessions', value: 23, icon: Users },
    { label: 'Uptime', value: 99.9, icon: Clock },
  ];

  // Convert data to proper format for Pie chart
  const pieData = activityData.map(item => ({
    name: item.name,
    value: item.value
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Current system performance metrics</CardDescription>
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
                  {stat.label !== 'Uptime' 
                    ? `${stat.value}%`
                    : `${stat.value}%`
                  }
                </span>
              </div>
              {stat.label !== 'Uptime' && (
                <Progress value={stat.value} className="h-2" />
              )}
            </div>
          ))}
          {avgDuration && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg. Interview Duration</span>
                <span className="text-sm font-medium">
                  {Math.round(avgDuration / 60)} minutes
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Types</CardTitle>
          <CardDescription>Distribution of user activities</CardDescription>
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
                <Tooltip 
                  formatter={(value: number) => [`${value} activities`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}