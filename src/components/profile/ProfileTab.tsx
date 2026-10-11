import React, { useState } from 'react';
import {
  User,
  Settings,
  Bell,
  Globe,
  IndianRupee,
  Moon,
  Sun,
  Shield,
  HelpCircle,
  Info,
  LogOut,
  RotateCcw,
  Code2,
  CheckCircle2,
} from 'lucide-react';
import { useGarage } from '../../context/GarageContext';

export const ProfileTab: React.FC = () => {
  const {
    user,
    updateUser,
    resetToDemoData,
    setIsAuthModalOpen,
    setIsAndroidArchitectureOpen,
  } = useGarage();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(user.language);
  const [selectedCurrency, setSelectedCurrency] = useState('INR – Indian Rupee (₹)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1800);
  };

  const handleToggleTheme = () => {
    const nextDark = !user.darkMode;
    updateUser({ darkMode: nextDark });
    showToast(nextDark ? 'Dark theme enabled' : 'Light theme enabled');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 border border-cyan-500/50 rounded-full text-xs font-semibold text-cyan-300 shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          <span>Account Profile</span>
        </h2>
        <p className="text-xs text-slate-400">
          Personal garage preferences & system configuration
        </p>
      </div>

      {/* User Info Card */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-3.5 shadow-md">
        <img
          src={user.profilePic}
          alt={user.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-md"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white truncate">{user.name}</h3>
          <p className="text-xs text-slate-400 truncate">{user.email}</p>
          <p className="text-xs text-cyan-400 font-mono font-medium">{user.mobile}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
            {user.city}
          </span>
        </div>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-cyan-400 font-semibold rounded-xl"
        >
          Edit
        </button>
      </div>

      {/* Settings Sections */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden text-xs">
        {/* Notifications Toggle */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Push Notifications</p>
              <p className="text-[11px] text-slate-400">Service, PUC & Insurance reminders</p>
            </div>
          </div>
          <button
            onClick={() => {
              setNotificationsEnabled(!notificationsEnabled);
              showToast(
                !notificationsEnabled ? 'Notifications enabled' : 'Notifications muted'
              );
            }}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              notificationsEnabled ? 'bg-cyan-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Currency Setting */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Default Currency</p>
              <p className="text-[11px] text-slate-400">Standard Indian Rupee (₹)</p>
            </div>
          </div>
          <span className="font-mono font-bold text-emerald-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg">
            ₹ INR
          </span>
        </div>

        {/* Language Selector */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">App Language</p>
              <p className="text-[11px] text-slate-400">Indian regional localizations</p>
            </div>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              updateUser({ language: e.target.value });
              showToast(`Language set to ${e.target.value}`);
            }}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500"
          >
            <option value="English (India)">English (India)</option>
            <option value="हिन्दी (Hindi)">हिन्दी (Hindi)</option>
            <option value="ಕನ್ನಡ (Kannada)">ಕನ್ನಡ (Kannada)</option>
            <option value="मराठी (Marathi)">मराठी (Marathi)</option>
            <option value="தமிழ் (Tamil)">தமிழ் (Tamil)</option>
            <option value="తెలుగు (Telugu)">తెలుగు (Telugu)</option>
          </select>
        </div>

        {/* Dark / Light Mode */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              {user.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <p className="font-bold text-white">App Appearance</p>
              <p className="text-[11px] text-slate-400">Material Design 3 Theme</p>
            </div>
          </div>
          <button
            onClick={handleToggleTheme}
            className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-semibold hover:text-white"
          >
            {user.darkMode ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>

        {/* Native Android Project Architecture Guide */}
        <div
          onClick={() => setIsAndroidArchitectureOpen(true)}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Android Jetpack Compose Code</p>
              <p className="text-[11px] text-slate-400">View native Kotlin architecture & APK build instructions</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-cyan-400">View Code →</span>
        </div>

        {/* Security & Privacy */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Privacy & Local Storage</p>
              <p className="text-[11px] text-slate-400">Private client-side vehicle vault</p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">Protected</span>
        </div>

        {/* Help & Support */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Help & Support</p>
              <p className="text-[11px] text-slate-400">RTO formats, diagnostics & FAQ</p>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">24x7 AI Help</span>
        </div>

        {/* About AutoVision Garage */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">About AutoVision Garage</p>
              <p className="text-[11px] text-slate-400">v2.4.0 (Build 2026.10)</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">Made for India 🇮🇳</span>
        </div>
      </div>

      {/* Danger Zone: Reset to Clean Demo Data */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <div>
          <p className="font-bold text-white">Demo Data Controls</p>
          <p className="text-[11px] text-slate-400">Reset vehicles, expenses & bookings</p>
        </div>
        <button
          onClick={() => {
            if (confirm('Reset to initial realistic demo vehicles and transactions?')) {
              resetToDemoData();
              showToast('Reset to demo state successfully');
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-rose-500/30 hover:border-rose-500 text-rose-400 font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
};
