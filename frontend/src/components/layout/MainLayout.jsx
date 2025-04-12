import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

const MainLayout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="layout-main-container">
      <Topbar toggleSidebar={toggleSidebar} />
      <Sidebar visible={sidebarVisible} />
      <div className={`layout-main ${sidebarVisible ? '' : 'layout-main-full'}`}>
        <div className="layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
