"use client"

import React, { useState } from 'react';
import { 
  Users, Calendar, Clock, TrendingUp, DollarSign,
  AlertCircle, CheckCircle2, Clock8, Filter, BellRing
} from 'lucide-react';

export default function Toolbar({ selectedPeriod, setSelectedPeriod, notifications, showNotifications, setShowNotifications }) {
    return (
      <div className="bg-[#2a2a2a] rounded-xl p-4 mb-6 border border-[#C4B5A2]/30">
        <div className="flex justify-between items-center">
          {/* Sélecteur de période */}
          <div className="flex space-x-4">
            <div className="flex bg-[#1a1a1a] rounded-lg p-1">
              {['jour', 'semaine', 'mois', 'année'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`
                    px-4 py-1 rounded-lg text-sm transition-colors
                    ${selectedPeriod === period 
                      ? 'bg-[#C4B5A2] text-[#1a1a1a]' 
                      : 'text-[#C4B5A2] hover:bg-[#C4B5A2]/10'
                    }
                  `}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
  
            <button className="flex items-center space-x-2 px-4 py-1 rounded-lg text-[#C4B5A2] hover:bg-[#C4B5A2]/10">
              <Filter size={16} />
              <span>Filtres</span>
            </button>
          </div>
  
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-[#C4B5A2] hover:bg-[#C4B5A2]/10"
            >
              <BellRing size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
  
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#2a2a2a] rounded-xl shadow-lg border border-[#C4B5A2]/30 p-4 z-50">
                <h3 className="text-[#C4B5A2] font-medium mb-3">Notifications</h3>
                <div className="space-y-2">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className="flex items-start justify-between p-2 rounded-lg hover:bg-[#1a1a1a]"
                    >
                      <div className="flex items-start space-x-2">
                        <AlertCircle 
                          size={16} 
                          className={notif.type === 'urgent' ? 'text-red-500' : 'text-yellow-500'} 
                        />
                        <span className="text-white text-sm">{notif.message}</span>
                      </div>
                      <span className="text-[#C4B5A2] text-xs">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  