import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import useDeadlineNotifications from '@/hooks/useDeadlineNotifications';
import { Toaster } from '@/components/ui/Toaster';

export default function AppLayout({ children, headerTitle }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useDeadlineNotifications();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-accent/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 border-r border-border bg-card">
        <Sidebar className="w-full h-full" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-slow ease-spring lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar 
          className="w-full h-full" 
          onNavigate={() => setIsSidebarOpen(false)} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Toaster />
        <Header 
          title={headerTitle || 'SimpleDesk'} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
