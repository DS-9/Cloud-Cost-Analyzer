import React from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { RoleSelector } from './components/dashboard/RoleSelector';
import './index.css';

function App() {
  return (
    <AppLayout>
      <RoleSelector />
    </AppLayout>
  );
}

export default App;