import React, { useState } from 'react';
import { 
  Lightbulb, 
  ChevronDown, 
  ChevronRight, 
  DollarSign, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter
} from 'lucide-react';
import { OptimizationRecommendation } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Tooltip } from '../ui/Tooltip';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface OptimizationRecommendationsProps {
  data?: OptimizationRecommendation[];
  loading?: boolean;
  error?: string;
}

export const OptimizationRecommendations: React.FC<OptimizationRecommendationsProps> = ({ 
  data, 
  loading = false, 
  error 
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'savings'>('priority');

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Optimization Recommendations</h3>
          <Tooltip content="AI-powered recommendations to reduce your cloud costs">
            <Lightbulb className="w-5 h-5 text-gray-400" />
          </Tooltip>
        </div>
        <LoadingSpinner size="lg" className="py-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Optimization Recommendations</h3>
          <Lightbulb className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading recommendations: {error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Optimization Recommendations</h3>
          <Lightbulb className="w-5 h-5 text-gray-400" />
        </div>
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No optimization recommendations available</p>
        </div>
      </div>
    );
  }

  // Filter and sort data
  const filteredData = data.filter(item => 
    filterType === 'all' || item.type === filterType
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'priority') {
      return a.priority - b.priority;
    } else {
      return b.potentialSavings - a.potentialSavings;
    }
  });

  const totalPotentialSavings = data.reduce((sum, item) => sum + item.potentialSavings, 0);

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: number) => {
    if (priority === 1) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (priority === 2) return <Clock className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rightsizing': return '📏';
      case 'scheduling': return '⏰';
      case 'reserved-instances': return '💰';
      case 'storage-optimization': return '💾';
      default: return '⚡';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Optimization Recommendations</h3>
          <p className="text-sm text-gray-600 mt-1">
            Potential savings: <span className="font-semibold text-green-600">
              {formatCurrency(totalPotentialSavings)}/month
            </span>
          </p>
        </div>
        <Tooltip content="AI-powered recommendations to reduce your cloud costs">
          <Lightbulb className="w-5 h-5 text-gray-400" />
        </Tooltip>
      </div>

      {/* Filters and Sorting */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="rightsizing">Rightsizing</option>
            <option value="scheduling">Scheduling</option>
            <option value="reserved-instances">Reserved Instances</option>
            <option value="storage-optimization">Storage</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'priority' | 'savings')}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="priority">Priority</option>
            <option value="savings">Potential Savings</option>
          </select>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {sortedData.map((recommendation) => (
          <div key={recommendation.id} className="border border-gray-200 rounded-lg">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpanded(recommendation.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    {expandedItems.has(recommendation.id) ? 
                      <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    }
                    <span className="text-lg">{getTypeIcon(recommendation.type)}</span>
                    {getPriorityIcon(recommendation.priority)}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {recommendation.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {recommendation.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(recommendation.potentialSavings)}/month
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEffortColor(recommendation.effort)}`}>
                        {recommendation.effort} effort
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {expandedItems.has(recommendation.id) && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="pt-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">
                    Affected Resources ({recommendation.resources.length})
                  </h5>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {recommendation.resources.map((resourceId) => (
                      <span 
                        key={resourceId}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {resourceId}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="btn-primary text-sm">
                      Implement Recommendation
                    </button>
                    <button className="btn-secondary text-sm">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No recommendations match the current filter</p>
        </div>
      )}
    </div>
  );
};