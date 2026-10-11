import React from 'react';
import { X, Bell, CheckCheck, Wrench, Shield, AlertTriangle, Fuel, Calendar } from 'lucide-react';
import { useGarage } from '../../context/GarageContext';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useGarage();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'service':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'puc':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'insurance':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'fuel':
        return <Fuel className="w-4 h-4 text-emerald-400" />;
      case 'booking':
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col text-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Reminders & Alerts</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No notifications.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition ${
                  n.read
                    ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    : 'bg-slate-900 border-cyan-500/40 text-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs">{n.title}</h4>
                      <span className="text-[10px] text-slate-500">{n.date}</span>
                    </div>
                    <p className="text-[11px] mt-1 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
