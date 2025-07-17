import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { CostData } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Tooltip } from '../ui/Tooltip';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface PlatformComparisonChartProps {
  data?: CostData[];
  loading?: boolean;
  error?: string;
  title?: string;
}

export const PlatformComparisonChart: React.FC<PlatformComparisonChartProps> = ({ 
  data, 
  loading = false, 
  error,
  title = "Platform Cost Comparison"
}) => {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Tooltip content="Compare costs between AWS and Azure platforms">
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </Tooltip>
        </div>
        <LoadingSpinner size="lg" className="py-16" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-center py-16">
          <p className="text-red-600">Error loading comparison data: {error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-center py-16">
          <p className="text-gray-500">No comparison data available</p>
        </div>
      </div>
    );
  }

  // Aggregate data by platform and resource type
  const aggregatedData = data.reduce((acc, item) => {
    const key = `${item.platform}-${item.resourceType}`;
    if (!acc[key]) {
      acc[key] = {
        platform: item.platform.toUpperCase(),
        resourceType: item.resourceType,
        cost: 0,
        count: 0
      };
    }
    acc[key].cost += item.cost;
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(aggregatedData);

  // Platform totals for pie chart
  const platformTotals = data.reduce((acc, item) => {
    acc[item.platform] = (acc[item.platform] || 0) + item.cost;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(platformTotals).map(([platform, cost]) => ({
    name: platform.toUpperCase(),
    value: cost,
    color: platform === 'aws' ? '#ff9900' : '#0078d4'
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">
            {data.name}: {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-gray-500">
            {((data.value / pieData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                chartType === 'bar' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                chartType === 'pie' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PieChartIcon className="w-4 h-4" />
            </button>
          </div>
          <Tooltip content="Compare costs between AWS and Azure platforms">
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </Tooltip>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="resourceType" 
                stroke="#6b7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="cost" 
                fill={(entry: any) => entry.platform === 'AWS' ? '#ff9900' : '#0078d4'}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip content={<PieTooltip />} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Platform Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(platformTotals).map(([platform, cost]) => (
            <div key={platform} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div 
                  className={`w-3 h-3 rounded-full mr-2 ${
                    platform === 'aws' ? 'bg-aws-500' : 'bg-azure-500'
                  }`}
                />
                <span className="text-sm font-medium text-gray-700">
                  {platform.toUpperCase()}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(cost)}
              </p>
              <p className="text-xs text-gray-500">
                {((cost / Object.values(platformTotals).reduce((sum, c) => sum + c, 0)) * 100).toFixed(1)}% of total
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};