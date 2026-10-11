import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';
import { useGarage } from '../../context/GarageContext';

interface MobileAppShellProps {
  children: React.ReactNode;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({ children }) => {
  const { isPhoneFrame } = useGarage();

  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (!isPhoneFrame) {
    // Full screen responsive view
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
        <main className="flex-1 w-full max-w-4xl mx-auto pb-24">{children}</main>
      </div>
    );
  }

  // Realistic Android Phone Frame Mockup
  return (
    <div className="min-h-screen bg-slate-950/80 md:bg-slate-900/90 flex items-center justify-center p-0 md:p-6 transition-all duration-300">
      <div className="w-full max-w-md bg-slate-950 md:rounded-[44px] md:border-[10px] md:border-slate-800 md:shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.15)] flex flex-col h-screen md:h-[920px] max-h-screen overflow-hidden relative">
        {/* Android Top Status Bar */}
        <div className="h-9 bg-slate-950 px-5 flex items-center justify-between text-xs font-semibold text-slate-300 select-none z-30 shrink-0">
          {/* Time & Carrier */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-white">{currentTime}</span>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Jio 5G</span>
          </div>

          {/* Android Punch Hole Camera */}
          <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
          </div>

          {/* Icons: 5G Signal, Wi-Fi, Battery */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono">92%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Inner Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col pb-20">
          {children}
        </div>

        {/* Android Gesture Pill Bar */}
        <div className="h-4 bg-slate-950/95 flex items-center justify-center z-30 shrink-0 pointer-events-none">
          <div className="w-32 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
