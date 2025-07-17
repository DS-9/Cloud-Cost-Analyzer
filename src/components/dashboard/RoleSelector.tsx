import React from 'react';
import { AdminDashboard } from './AdminDashboard';
import { ExecutiveDashboard } from './ExecutiveDashboard';
import { UserRole } from '../../types';

interface RoleSelectorProps {
  currentRole: UserRole;
  activeSection: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  currentRole,
  activeSection
}) => {
  // Role-specific help text
  const getHelpText = () => {
    if (currentRole.type === 'admin') {
      return {
        overview: "Technical overview with detailed metrics and system health indicators",
        resources: "Comprehensive resource inventory with utilization metrics and technical details",
        costs: "Detailed cost analysis with granular breakdowns and technical cost drivers",
        trends: "Advanced trend analysis with platform-specific metrics and forecasting",
        optimization: "Technical optimization recommendations with implementation details",
        settings: "System configuration and administrative settings"
      };
    } else {
      return {
        overview: "Executive summary with high-level business metrics and KPIs",
        costs: "Business-focused cost insights with financial impact analysis",
        trends: "Financial trends and spending patterns for strategic planning",
        optimization: "Strategic savings opportunities with business impact assessment"
      };
    }
  };

  const helpText = getHelpText();
  const currentHelpText = helpText[activeSection as keyof typeof helpText];

  return (
    <div className="space-y-6">
      {/* Role Context Banner */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary-900">
              {currentRole.name} Dashboard
            </h2>
            {currentHelpText && (
              <p className="text-sm text-primary-700 mt-1">
                {currentHelpText}
              </p>
            )}
          </div>

          {/* Quick Role Switch Hint */}
          <div className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
            Switch view in header
          </div>
        </div>
      </div>

      {/* Render appropriate dashboard based on role */}
      {currentRole.type === 'admin' ? (
        <AdminDashboard activeSection={activeSection} />
      ) : (
        <ExecutiveDashboard activeSection={activeSection} />
      )}

      {/* Role-specific onboarding hints */}
      {activeSection === 'overview' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            {currentRole.type === 'admin' ? 'Admin Tips' : 'Executive Tips'}
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            {currentRole.type === 'admin' ? (
              <>
                <p>• Use filters to focus on specific platforms or date ranges</p>
                <p>• Check the Resources section for detailed utilization metrics</p>
                <p>• Review Optimization recommendations for technical improvements</p>
                <p>• Monitor system health and performance indicators</p>
              </>
            ) : (
              <>
                <p>• Focus on the executive summary cards for key business metrics</p>
                <p>• Review cost trends for budget planning and forecasting</p>
                <p>• Prioritize high-impact savings opportunities</p>
                <p>• Use platform comparison for strategic vendor decisions</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};