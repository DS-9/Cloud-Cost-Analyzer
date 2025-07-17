import React from 'react';
import { Calendar, Filter } from 'lucide-react';

interface FilterPanelProps {
  selectedPlatform: 'all' | 'aws' | 'azure';
  onPlatformChange: (platform: 'all' | 'aws' | 'azure') => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedPlatform,
  onPlatformChange,
  dateRange,
  onDateRangeChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        {/* Platform Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Platform:</label>
          <select
            value={selectedPlatform}
            onChange={(e) => onPlatformChange(e.target.value as 'all' | 'aws' | 'azure')}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Platforms</option>
            <option value="aws">AWS</option>
            <option value="azure">Azure</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <label className="text-sm text-gray-600">From:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <label className="text-sm text-gray-600">To:</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );
};