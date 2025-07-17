import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Cloud } from 'lucide-react';
import { CostSummary } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Tooltip } from '../ui/Tooltip';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface CostSummaryCardProps {
  data?: CostSummary;
  loading?: boolean;
  error?: string;
}

export const CostSummaryCard: React.FC<CostSummaryCardProps> = ({ 
  data, 
  loading = false, 
  error 
}) => {
  if (loading) {
    return (
      <div className="card">
        <LoadingSpinner size="lg" className="py-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading cost summary: {error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-gray-500">No cost data available</p>
        </div>
      </div>
    );
  }

  const trendIcon = data.monthlyTrend > 0 ? TrendingUp : TrendingDown;
  const trendColor = data.monthlyTrend > 0 ? 'text-red-600' : 'text-green-600';
  const TrendIcon = trendIcon;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Cost Summary</h3>
        <Tooltip content="Overview of your total cloud spending across all platforms">
          <DollarSign className="w-5 h-5 text-gray-400" />
        </Tooltip>
      </div>

      {/* Total Cost */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Monthly Cost</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(data.totalCost)}
            </p>
          </div>
          <div className={`flex items-center ${trendColor}`}>
            <TrendIcon className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">
              {formatPercentage(data.monthlyTrend)}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {data.monthlyTrend > 0 ? 'Increase' : 'Decrease'} from last month
        </p>
      </div>

      {/* Platform Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Platform Breakdown</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-aws-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">AWS</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(data.platformBreakdown.aws)}
              </p>
              <p className="text-xs text-gray-500">
                {((data.platformBreakdown.aws / data.totalCost) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-azure-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Azure</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(data.platformBreakdown.azure)}
              </p>
              <p className="text-xs text-gray-500">
                {((data.platformBreakdown.azure / data.totalCost) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Cost Drivers */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Top Cost Drivers</h4>
        <div className="space-y-2">
          {data.topCostDrivers.slice(0, 3).map((driver, index) => (
            <div key={driver.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-500 w-4">
                  #{index + 1}
                </span>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900">
                    {driver.resourceName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {driver.platform.toUpperCase()} • {driver.resourceType}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(driver.cost)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};