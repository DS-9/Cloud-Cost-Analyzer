import React, { useState, useEffect } from 'react';
import { CostSummaryCard } from './CostSummaryCard';
import { ResourceUsageChart } from '../charts/ResourceUsageChart';
import { PlatformComparisonChart } from '../charts/PlatformComparisonChart';
import { OptimizationRecommendations } from './OptimizationRecommendations';
import { ResourceInventoryTable } from './ResourceInventoryTable';
import { FilterPanel } from '../ui/FilterPanel';
import { mockDataService } from '../../services/mockData';
import { CostSummary, TrendData, CostData, CloudResource, OptimizationRecommendation } from '../../types';

interface AdminDashboardProps {
  activeSection: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeSection }) => {
  const [costSummary, setCostSummary] = useState<CostSummary | undefined>();
  const [trendData, setTrendData] = useState<TrendData[] | undefined>();
  const [costData, setCostData] = useState<CostData[] | undefined>();
  const [resources, setResources] = useState<CloudResource[] | undefined>();
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
      setResources(mockDataService.generateCloudResources());
      setRecommendations(mockDataService.generateOptimizationRecommendations());
      setLoading(false);
    }, 1000);
  }, []);

  // Filter data based on selected platform
  const filteredCostData = costData?.filter(item => 
    selectedPlatform === 'all' || item.platform === selectedPlatform
  );

  const filteredResources = resources?.filter(item => 
    selectedPlatform === 'all' || item.platform === selectedPlatform
  );

  const renderOverview = () => (
    <div className="space-y-6">
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
            title="Daily Cost Trends"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformComparisonChart 
          data={filteredCostData} 
          loading={loading}
        />
        <OptimizationRecommendations 
          data={recommendations} 
          loading={loading}
        />
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      <FilterPanel
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <ResourceInventoryTable 
        data={filteredResources} 
        loading={loading}
      />
    </div>
  );

  const renderCosts = () => (
    <div className="space-y-6">
      <FilterPanel
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostSummaryCard data={costSummary} loading={loading} />
        <PlatformComparisonChart 
          data={filteredCostData} 
          loading={loading}
        />
      </div>

      <ResourceUsageChart 
        data={trendData} 
        loading={loading}
        title="Cost Analysis Over Time"
      />
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
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
          title="Cost Trends Analysis"
          showPlatforms={true}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResourceUsageChart 
            data={trendData} 
            loading={loading}
            title="AWS Trends"
            showPlatforms={false}
          />
          <ResourceUsageChart 
            data={trendData} 
            loading={loading}
            title="Azure Trends"
            showPlatforms={false}
          />
        </div>
      </div>
    </div>
  );

  const renderOptimization = () => (
    <div className="space-y-6">
      <FilterPanel
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OptimizationRecommendations 
            data={recommendations} 
            loading={loading}
          />
        </div>
        <div className="lg:col-span-1">
          <CostSummaryCard data={costSummary} loading={loading} />
        </div>
      </div>

      <ResourceInventoryTable 
        data={filteredResources} 
        loading={loading}
      />
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Platform Filter
            </label>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="all">All Platforms</option>
              <option value="aws">AWS</option>
              <option value="azure">Azure</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refresh Interval
            </label>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="notifications"
              className="mr-2"
            />
            <label htmlFor="notifications" className="text-sm text-gray-700">
              Enable cost alert notifications
            </label>
          </div>

          <div className="pt-4">
            <button className="btn-primary">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  switch (activeSection) {
    case 'resources':
      return renderResources();
    case 'costs':
      return renderCosts();
    case 'trends':
      return renderTrends();
    case 'optimization':
      return renderOptimization();
    case 'settings':
      return renderSettings();
    default:
      return renderOverview();
  }
};