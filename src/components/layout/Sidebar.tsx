import React from 'react';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Server, 
  Lightbulb,
  Settings
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentRole: UserRole;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentRole, 
  activeSection, 
  onSectionChange 
}) => {
  const adminSections = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'resources', name: 'Resources', icon: Server },
    { id: 'costs', name: 'Cost Analysis', icon: DollarSign },
    { id: 'trends', name: 'Trends', icon: TrendingUp },
    { id: 'optimization', name: 'Optimization', icon: Lightbulb },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const executiveSections = [
    { id: 'overview', name: 'Executive Summary', icon: BarChart3 },
    { id: 'costs', name: 'Cost Insights', icon: DollarSign },
    { id: 'trends', name: 'Financial Trends', icon: TrendingUp },
    { id: 'optimization', name: 'Savings Opportunities', icon: Lightbulb }
  ];

  const sections = currentRole.type === 'admin' ? adminSections : executiveSections;

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {currentRole.name} Dashboard
          </h2>
        </div>
        
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {section.name}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};