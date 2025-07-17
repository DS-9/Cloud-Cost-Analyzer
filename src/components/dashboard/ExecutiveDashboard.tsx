import React, { useState, useEffect } from 'react';
import { CostSummaryCard } from './CostSummaryCard';
import { ResourceUsageChart } from '../charts/ResourceUsageChart';
import { PlatformComparisonChart } from '../charts/PlatformComparisonChart';
import { OptimizationRecommendations } from './OptimizationRecommendations';
import { FilterPanel } from '../ui/FilterPanel';
import { mockDataService } from '../../services/mockData';
import { CostSummary, TrendData, CostData, OptimizationRecommendation } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertCircle } from 'lucide-react';

interface ExecutiveDashboardProps {
  activeSection: string;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ activeSection }) => {
  const [costSummary, setCostSummary] = useState<CostSummary | undefined>();
  const [trendData, setTrendData] = useState<TrendData[] | undefined>();
  const [costData, setCostData] = useState<CostData[] | undefined>();
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[] | undefined>();
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'aws' | 'azure'>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    setTimeout(() => {
      setCostSummary(mockDataService.getCostSummary());
      setTrendData(mockDataService.generateTrendData());
      setCostData([...mockDataService.generateAWSCostData(), ...mockDataService.generateAzureCostData()]);
      setRecommendations(mockDataService.generateOptimizationRecommendations());
      setLoading(false);
    }, 1000);
  }, []);

  // Filter data based on selected platform
  const filteredCostData = costData?.filter(item => 
    selectedPlatform === 'all' || item.platform === selectedPlatform
  );

  // Executive Summary Cards
  const ExecutiveSummaryCards = () => {
    if (loading || !costSummary || !recommendations) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    const totalSavingsOpportunity = recommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0);
    const highPriorityRecommendations = recommendations.filter(rec => rec.priority === 1).length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Spend</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(costSummary.totalCost)}
              </p>
              <div className={`flex items-center mt-1 ${
                costSummary.monthlyTrend > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {costSummary.monthlyTrend > 0 ? 
                  <TrendingUp className="w-4 h-4 mr-1" /> : 
                  <TrendingDown className="w-4 h-4 mr-1" />
                }
                <span className="text-sm font-medium">
                  {formatPercentage(Math.abs(costSummary.monthlyTrend))}
                </span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Savings Opportunity</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalSavingsOpportunity)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {((totalSavingsOpportunity / costSummary.totalCost) * 100).toFixed(1)}% of spend
              </p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">AWS vs Azure</p>
              <p className="text-lg font-semibold text-gray-900">
                {((costSummary.platformBreakdown.aws / costSummary.totalCost) * 100).toFixed(0)}% / {((costSummary.platformBreakdown.azure / costSummary.totalCost) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Platform distribution
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-3 h-3 bg-aws-500 rounded-full"></div>
              <div className="w-3 h-3 bg-azure-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Action Items</p>
              <p className="text-2xl font-bold text-orange-600">
                {highPriorityRecommendations}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                High priority items
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Executive Summary</h2>
        <p className="text-gray-600">
          High-level overview of your cloud spending and optimization opportunities
        </p>
      </div>

      <ExecutiveSummaryCards />

      <FilterPanel
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceUsageChart 
          data={trendData} 
          loading={loading}
          title="Spending Trends"
        />
        <PlatformComparisonChart 
          data={filteredCostData} 
          loading={loading}
          title="Platform Cost Distribution"
        />
      </div>
    </div>
  );

  const renderCosts = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cost Insights</h2>
        <p className="text-gray-600">
          Detailed financial analysis of your cloud infrastructure spending
        </p>
      </div>

      <ExecutiveSummaryCards />

      <FilterPanel
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CostSummaryCard data={costSummary} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <ResourceUsageChart 
            data={trendData} 
            loading={loading}
            title="Monthly Cost Breakdown"
          />
        </div>
      </div>

      <PlatformComparisonChart 
        data={filteredCostData} 
        loading={loading}
        title="Detailed Platform Analysis"
      />
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Trends</h2>
        <p className="text-gray-600">
          Historical spending patterns and financial forecasting
        </p>
      </div>

      <FilterPanel
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <div className="grid grid-cols-1 gap-6">
        <ResourceUsageChart 
          data={trendData} 
          loading={loading}
          title="30-Day Spending Trend"
          showPlatforms={true}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Financial Metrics</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : trendData ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Daily Spend:</span>
                  <span className="font-medium">
                    {formatCurrency(trendData.reduce((sum, d) => sum + d.total, 0) / trendData.length)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Highest Day:</span>
                  <span className="font-medium">
                    {formatCurrency(Math.max(...trendData.map(d => d.total)))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lowest Day:</span>
                  <span className="font-medium">
                    {formatCurrency(Math.min(...trendData.map(d => d.total)))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projected Monthly:</span>
                  <span className="font-medium">
                    {formatCurrency((trendData.reduce((sum, d) => sum + d.total, 0) / trendData.length) * 30)}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Efficiency</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : costSummary && recommendations ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Optimization Score:</span>
                  <span className="font-medium text-green-600">
                    {Math.max(0, 100 - (recommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0) / costSummary.totalCost * 100)).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waste Reduction:</span>
                  <span className="font-medium text-orange-600">
                    {formatCurrency(recommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ROI Potential:</span>
                  <span className="font-medium text-blue-600">
                    {((recommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0) / costSummary.totalCost) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOptimization = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Savings Opportunities</h2>
        <p className="text-gray-600">
          Strategic recommendations to optimize your cloud spending
        </p>
      </div>

      <FilterPanel
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <OptimizationRecommendations 
            data={recommendations} 
            loading={loading}
          />
        </div>
        <div className="lg:col-span-1">
          <CostSummaryCard data={costSummary} loading={loading} />
        </div>
      </div>
    </div>
  );

  switch (activeSection) {
    case 'costs':
      return renderCosts();
    case 'trends':
      return renderTrends();
    case 'optimization':
      return renderOptimization();
    default:
      return renderOverview();
  }
};