import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Mail, 
  User, 
  Heart, 
  Settings, 
  RefreshCw, 
  LogOut,
  Menu,
  X,
  Briefcase
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, isActive, badge, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
      isActive ? 'bg-surface border border-primary text-white' : 'text-text-secondary hover:bg-surface/50 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
    </div>
    {badge && (
      <span className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const role = localStorage.getItem('role');

  const homePath = role === 'EMPLOYER' ? '/employer-dashboard' : role === 'ADMIN' ? '/admin-dashboard' : '/dashboard';

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-screen bg-background border-r border-border z-40 transition-transform duration-300 w-64 flex flex-col shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 cursor-pointer" onClick={() => handleNav(homePath)}>
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path d="M12 2L2 22h20L12 2z" fill="#F59E0B" />
                <path d="M12 8L6 20h12L12 8z" fill="#22C55E" />
                <path d="M12 12l-3 6h6l-3-6z" fill="#5B4CF6" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg cursor-pointer" onClick={() => handleNav(homePath)}>Shivani Tech</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {/* Candidate-only items */}
          {role !== 'EMPLOYER' && (
            <>
              <SidebarItem icon={Home} label="Dashboard" isActive={currentPath === '/dashboard'} onClick={() => handleNav('/dashboard')} />
              <SidebarItem icon={Briefcase} label="Find Jobs" isActive={currentPath === '/jobs'} onClick={() => handleNav('/jobs')} />
              <SidebarItem icon={User} label="My Profile" isActive={currentPath === '/profile'} onClick={() => handleNav('/profile')} />
              <SidebarItem icon={Heart} label="Saved Jobs" onClick={() => handleNav('/jobs')} />
            </>
          )}
          
          {/* Employer-only items */}
          {(role === 'EMPLOYER' || role === 'ADMIN') && (
            <>
              {role !== 'EMPLOYER' && <div className="my-4 border-t border-border"></div>}
              <SidebarItem icon={Settings} label="Employer Console" isActive={currentPath === '/employer-dashboard'} onClick={() => handleNav('/employer-dashboard')} />
              <SidebarItem icon={Briefcase} label="Browse Jobs" isActive={currentPath === '/jobs'} onClick={() => handleNav('/jobs')} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 text-text-secondary hover:text-white hover:bg-surface/50 transition-colors rounded-xl"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
