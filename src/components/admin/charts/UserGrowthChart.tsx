'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface UserGrowthData {
  date: string;
  users: number;
}

interface UserGrowthChartProps {
  data: UserGrowthData[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  // Ensure we have valid data
  const chartData = data && data.length > 0 ? data : [
    { date: 'No Data', users: 0 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth (Last 30 Days)</CardTitle>
        <CardDescription>
          New user registrations over time
          {data.length === 0 && ' - No data available'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [`${value} users`, 'New Users']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar 
                dataKey="users" 
                fill="#0088FE" 
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {data.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-4">
            No user registration data available for the last 30 days
          </div>
        )}
      </CardContent>
    </Card>
  );
}