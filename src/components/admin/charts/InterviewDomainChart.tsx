'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface InterviewDomainData {
  name: string;
  count: number;
}

interface InterviewDomainChartProps {
  data: InterviewDomainData[];
}

export function InterviewDomainChart({ data }: InterviewDomainChartProps) {
  // Convert to array of objects for Pie chart
  const chartData = data.map(item => ({
    name: item.name,
    value: item.count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interviews by Domain</CardTitle>
        <CardDescription>
          Distribution of practice sessions across domains
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} interviews`, 'Count']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}