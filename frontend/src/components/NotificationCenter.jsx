import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info } from 'lucide-react';
import api from '../api';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      // Ignore if unauthenticated
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-text-secondary hover:text-white transition-colors p-2 rounded-full hover:bg-surface border border-transparent hover:border-border"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
          <div className="p-4 border-b border-border flex items-center justify-between bg-background/50">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="text-white font-bold text-sm">Notifications</h3>
            </div>
            {unreadCount > 0 && (
              <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-semibold">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto custom-scrollbar divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-text-secondary text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  className={`p-4 transition-colors flex items-start gap-3 ${!n.isRead ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-background/40'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${!n.isRead ? 'bg-primary/20 text-primary' : 'bg-border text-text-secondary'}`}>
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs sm:text-sm ${!n.isRead ? 'text-white font-medium' : 'text-text-secondary'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-text-secondary/70">
                        {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!n.isRead && (
                        <button 
                          onClick={() => handleMarkAsRead(n.id)}
                          className="text-primary text-[11px] hover:underline flex items-center gap-1 font-medium"
                        >
                          <Check className="w-3 h-3" /> Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
