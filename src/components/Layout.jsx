import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ChatWidget from './ChatWidget';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loggedIn = localStorage.getItem('agrispike_logged_in') === 'true';

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="main-area">
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}
