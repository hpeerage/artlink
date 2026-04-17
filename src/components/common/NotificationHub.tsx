'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, CreditCard, Heart, Info, X } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'payment' | 'subscription' | 'system' | 'favorite';
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

const NotificationHub = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/my/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.isRead).length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // 30초마다 갱신 (간이 폴링)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id?: string) => {
    try {
      const res = await fetch('/api/my/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment': return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'subscription': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'favorite': return <Heart className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all group"
      >
        <Bell className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Notifications</h3>
              <button 
                onClick={() => markAsRead()} 
                className="text-[10px] font-bold text-primary hover:underline"
              >
                Mark all as read
              </button>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors relative group ${!n.isRead ? 'bg-primary/[0.02]' : ''}`}
                    onClick={() => {
                      if (!n.isRead) markAsRead(n.id);
                      if (n.link) setIsOpen(false);
                    }}
                  >
                    <div className="flex gap-4">
                      <div className="mt-1 shrink-0">{getIcon(n.type)}</div>
                      <div className="flex-1">
                        <p className={`text-xs leading-relaxed ${!n.isRead ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                          {n.message}
                        </p>
                        <p className="text-[10px] text-gray-300 mt-2 font-medium">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!n.isRead && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                      )}
                    </div>
                    {n.link && (
                      <Link href={n.link} className="absolute inset-0"></Link>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-300">
                  <Bell className="h-8 w-8 mx-auto mb-3 opacity-20" />
                  <p className="text-xs font-bold italic">새로운 알림이 없습니다.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50/50 text-center">
               <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">
                  Close Center
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationHub;
