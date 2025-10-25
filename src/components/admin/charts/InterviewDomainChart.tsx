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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

interface InterviewDomainData {
  name: string;
  count: number;
  avgDuration?: number;
  avgScore?: number;
}

interface InterviewDomainChartProps {
  data: InterviewDomainData[];
}

// Add index signature to satisfy Recharts type requirements
interface ChartDataItem {
  name: string;
  value: number;
  avgDuration?: number;
  avgScore?: number;
  [key: string]: string | number | undefined; // Index signature
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
  }>;
}

export function InterviewDomainChart({ data }: InterviewDomainChartProps) {
  // Convert to array of objects for Pie chart
  const chartData: ChartDataItem[] = data && data.length > 0 ? data.map(item => ({
    name: item.name,
    value: item.count,
    avgDuration: item.avgDuration,
    avgScore: item.avgScore
  })) : [{ name: 'No Data', value: 1 }];

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">Interviews: {data.value}</p>
          {data.avgDuration && (
            <p className="text-sm">Avg. Duration: {data.avgDuration}m</p>
          )}
          {data.avgScore && (
            <p className="text-sm">Avg. Score: {data.avgScore}%</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interviews by Domain</CardTitle>
        <CardDescription>
          Distribution of practice sessions across domains
          {data.length === 0 && ' - No data available'}
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
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {data.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-4">
            No interview data available by domain
          </div>
        )}
      </CardContent>
    </Card>
  );
}