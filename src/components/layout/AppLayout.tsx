import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { UserRole } from '../../types';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>({ 
    type: 'admin', 
    name: 'Administrator' 
  });
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header 
          currentRole={currentRole} 
          onRoleChange={setCurrentRole} 
        />
        
        <div className="flex">
          <Sidebar 
            currentRole={currentRole}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {React.cloneElement(children as React.ReactElement, {
                currentRole,
                activeSection,
                onSectionChange: setActiveSection
              })}
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};