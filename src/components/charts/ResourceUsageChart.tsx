import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendData } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Tooltip } from '../ui/Tooltip';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { BarChart3 } from 'lucide-react';

interface ResourceUsageChartProps {
  data?: TrendData[];
  loading?: boolean;
  error?: string;
  title?: string;
  showPlatforms?: boolean;
}

export const ResourceUsageChart: React.FC<ResourceUsageChartProps> = ({ 
  data, 
  loading = false, 
  error,
  title = "Resource Usage Trends",
  showPlatforms = true
}) => {
  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Tooltip content="Time-series view of your cloud resource costs over the past 30 days">
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
          <p className="text-red-600">Error loading chart data: {error}</p>
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
          <p className="text-gray-500">No trend data available</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {new Date(label).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Tooltip content="Time-series view of your cloud resource costs over the past 30 days">
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </Tooltip>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            {showPlatforms && <Legend />}
            
            {showPlatforms ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="aws" 
                  stroke="#ff9900" 
                  strokeWidth={2}
                  name="AWS"
                  dot={{ fill: '#ff9900', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ff9900', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="azure" 
                  stroke="#0078d4" 
                  strokeWidth={2}
                  name="Azure"
                  dot={{ fill: '#0078d4', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#0078d4', strokeWidth: 2 }}
                />
              </>
            ) : (
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Total Cost"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Avg Daily Cost</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(data.reduce((sum, d) => sum + d.total, 0) / data.length)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Highest Day</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(Math.max(...data.map(d => d.total)))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Lowest Day</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(Math.min(...data.map(d => d.total)))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};