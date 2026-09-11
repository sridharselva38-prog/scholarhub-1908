import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Calendar,
  Check
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { currentUser, notifications, markNotificationAsRead } = useApp();

  const userNotifs = currentUser
    ? notifications.filter(n => n.userId === currentUser.id)
    : [];

  const unreadCount = userNotifs.filter(n => n.status === 'Unread').length;

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-100">
            <Bell className="w-3.5 h-3.5 text-blue-600" />
            <span>Module 11: Portal Event Notifications</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Notification Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            System updates for application submissions, document verifications, status changes, and upcoming deadlines
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
            {unreadCount} Unread
          </span>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {userNotifs.length === 0 ? (
          <div className="text-center py-16 p-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Notifications</h3>
            <p className="text-xs text-slate-500 mt-1">
              You will receive real-time alerts whenever there is activity on your applications or new scholarships.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {userNotifs.map(n => {
              const isUnread = n.status === 'Unread';
              return (
                <div
                  key={n.id}
                  className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                    isUnread ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        n.title.toLowerCase().includes('approved')
                          ? 'bg-emerald-100 text-emerald-700'
                          : n.title.toLowerCase().includes('rejected')
                          ? 'bg-red-100 text-red-700'
                          : n.title.toLowerCase().includes('pending')
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {n.title.toLowerCase().includes('approved') ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : n.title.toLowerCase().includes('rejected') ? (
                        <XCircle className="w-5 h-5" />
                      ) : n.title.toLowerCase().includes('pending') ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <Bell className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {isUnread && (
                    <button
                      onClick={() => markNotificationAsRead(n.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1 flex-shrink-0"
                    >
                      <Check className="w-3 h-3" />
                      <span>Mark read</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
