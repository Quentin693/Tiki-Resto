"use client"

import { BellRing, Filter, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Notification {
  id: number;
  type: 'urgent' | 'warning';
  message: string;
  time: string;
  isRead?: boolean;
}

interface ToolbarProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  markNotificationsAsRead?: () => void;
}

export default function Toolbar({ 
  selectedPeriod, 
  setSelectedPeriod, 
  notifications, 
  showNotifications, 
  setShowNotifications,
  markNotificationsAsRead
}: ToolbarProps) {
  const notificationRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && markNotificationsAsRead) {
      markNotificationsAsRead();
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
      <div className="flex items-center gap-4">
        <div className="flex rounded-lg border border-[#3a3a3a] overflow-hidden">
          <button 
            className={`px-4 py-2 ${selectedPeriod === 'jour' ? 'bg-[#C4B5A2] text-black' : 'bg-[#2a2a2a]'}`}
            onClick={() => setSelectedPeriod('jour')}
          >
            Jour
          </button>
          <button 
            className={`px-4 py-2 ${selectedPeriod === 'semaine' ? 'bg-[#C4B5A2] text-black' : 'bg-[#2a2a2a]'}`}
            onClick={() => setSelectedPeriod('semaine')}
          >
            Semaine
          </button>
          <button 
            className={`px-4 py-2 ${selectedPeriod === 'mois' ? 'bg-[#C4B5A2] text-black' : 'bg-[#2a2a2a]'}`}
            onClick={() => setSelectedPeriod('mois')}
          >
            Mois
          </button>
        </div>

        <div className="relative">
          <button 
            className="flex items-center gap-2 bg-[#2a2a2a] px-4 py-2 rounded-lg border border-[#3a3a3a]"
          >
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      <div className="relative" ref={notificationRef}>
        <button 
          className="relative flex items-center gap-2 bg-[#2a2a2a] px-4 py-2 rounded-lg border border-[#3a3a3a]"
          onClick={handleNotificationClick}
        >
          <BellRing className="w-4 h-4" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] shadow-lg z-50">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Notifications</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center">Aucune notification</p>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-lg ${
                        notification.type === 'urgent' ? 'bg-red-500/10' : 'bg-[#1a1a1a]'
                      } border border-[#3a3a3a]`}
                    >
                      <p className="text-sm mb-1">{notification.message}</p>
                      <p className="text-xs text-gray-400">{notification.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 