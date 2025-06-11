import React from 'react';
import Sidebar from './SideBar';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 p-4"> {/* Push content to the right of fixed Sidebar */}
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
