import React from 'react';
import Sidebar from './SideBar';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Outlet /> {/* This will render child routes */}
      </div>
    </div>
  );
}

export default DashboardLayout;
