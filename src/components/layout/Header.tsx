import React from 'react';
import { Cloud, User } from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  const roles: UserRole[] = [
    { type: 'admin', name: 'Administrator' },
    { type: 'executive', name: 'Executive' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Cloud className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Cloud Cost Analyzer
              </h1>
              <p className="text-sm text-gray-500">
                Multi-cloud cost optimization dashboard
              </p>
            </div>
          </div>

          {/* Role Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <select
                value={currentRole.type}
                onChange={(e) => {
                  const selectedRole = roles.find(role => role.type === e.target.value);
                  if (selectedRole) onRoleChange(selectedRole);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {roles.map(role => (
                  <option key={role.type} value={role.type}>
                    {role.name} View
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};