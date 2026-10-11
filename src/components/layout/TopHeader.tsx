import React from 'react';
import { Bell, Search, Sparkles, Code2, Smartphone } from 'lucide-react';
import { useGarage } from '../../context/GarageContext';

export const TopHeader: React.FC = () => {
  const {
    user,
    activeVehicle,
    vehicles,
    setActiveVehicleId,
    notifications,
    setIsNotificationsOpen,
    setIsSearchOpen,
    setIsAssistantOpen,
    setIsAndroidArchitectureOpen,
    isPhoneFrame,
    setIsPhoneFrame,
    setIsAuthModalOpen,
  } = useGarage();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Determine greeting based on current hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good Morning'
      : currentHour < 17
      ? 'Good Afternoon'
      : 'Good Evening';

  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left: User Profile & Greeting */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="relative shrink-0 group focus:outline-none"
            title="Account Profile"
          >
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-10 h-10 rounded-2xl object-cover border-2 border-cyan-500/40 group-hover:border-cyan-400 transition shadow-md shadow-cyan-950"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span>{greeting},</span>
              <span className="text-cyan-400 font-semibold truncate max-w-[100px]">
                {user.name.split(' ')[0]}
              </span>
            </div>

            {/* Quick Car Switcher Dropdown */}
            {vehicles.length > 0 && (
              <div className="relative mt-0.5">
                <select
                  value={activeVehicle?.id || ''}
                  onChange={(e) => setActiveVehicleId(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-[11px] font-semibold rounded-lg px-1.5 py-0.5 pr-5 focus:outline-none focus:border-cyan-500 cursor-pointer appearance-none truncate max-w-[155px]"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      🚗 {v.brand} {v.model} ({v.registrationNumber.split(' ').slice(0, 2).join(' ')})
                    </option>
                  ))}
                </select>
                <span className="absolute right-1.5 top-1 pointer-events-none text-[9px] text-slate-500">
                  ▼
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* AI Assistant Quick Pill */}
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/40 rounded-xl text-cyan-300 text-xs font-semibold shadow-sm transition"
            title="Ask AutoAI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">AutoAI</span>
          </button>

          {/* Global Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition"
            title="Search Cars, Garages & Records"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications with Badge */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition"
            title="Reminders & Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-amber-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Android Native Source Code / Architecture viewer */}
          <button
            onClick={() => setIsAndroidArchitectureOpen(true)}
            className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition"
            title="Android Architecture & Kotlin Code"
          >
            <Code2 className="w-4 h-4" />
          </button>

          {/* Toggle Phone Frame vs Full Screen View */}
          <button
            onClick={() => setIsPhoneFrame((prev: boolean) => !prev)}
            className={`p-2 rounded-xl border transition hidden md:flex items-center ${
              isPhoneFrame
                ? 'bg-cyan-950/80 border-cyan-600/60 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isPhoneFrame ? 'Switch to Full Screen View' : 'Switch to Android Phone Shell Frame'}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
