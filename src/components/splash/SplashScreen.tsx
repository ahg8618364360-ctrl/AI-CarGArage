import React, { useEffect, useState } from 'react';
import { Scan, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Vision Engine...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
          return 100;
        }
        const next = prev + 12;
        if (next > 30 && next <= 60) {
          setStatusText('Calibrating Indian Automotive Models...');
        } else if (next > 60 && next <= 90) {
          setStatusText('Syncing Digital Garage & Reminders...');
        } else if (next > 90) {
          setStatusText('Ready for Inspection!');
        }
        return next;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* Background ambient automotive glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

      {/* Top branding badge */}
      <div className="w-full flex justify-between items-center z-10 pt-4">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full text-xs font-mono text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>v2.4 • INDIA MOTOR EDITION</span>
        </div>
        <button
          onClick={onFinish}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-full border border-slate-800/80 transition"
        >
          Skip <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Hero Logo & AI Scanning Graphic */}
      <div className="flex flex-col items-center text-center z-10 my-auto">
        {/* Animated Scanner Hex/Shield Icon */}
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-amber-500 p-0.5 shadow-2xl shadow-cyan-500/20 animate-pulse-ring">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
              {/* Internal Laser Scanner Line */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-scan-laser" />

              {/* Automotive Car & AI scanner icon */}
              <div className="relative flex flex-col items-center justify-center">
                <Scan className="w-12 h-12 text-cyan-400" />
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-lg shadow-md">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating diagnostic badge */}
          <div className="absolute -bottom-3 inset-x-0 flex justify-center">
            <span className="bg-slate-900/95 border border-cyan-500/40 text-[11px] font-semibold text-cyan-300 px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" /> AI SCANNER
            </span>
          </div>
        </div>

        {/* App Title & Tagline */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-2">
          AutoVision <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">Garage</span>
        </h1>
        <p className="text-base text-slate-300 font-medium mt-2 max-w-xs">
          “Scan. Identify. Manage Your Car.”
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Smart Vehicle Intelligence & Digital Garage for India 🇮🇳
        </p>
      </div>

      {/* Bottom Loading Progress and Status */}
      <div className="w-full max-w-xs flex flex-col items-center z-10 pb-6">
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden mb-3 p-0.5">
          <div
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-400 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_#38bdf8]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="w-full flex justify-between text-[11px] font-mono text-slate-400 px-1">
          <span className="truncate">{statusText}</span>
          <span className="text-cyan-400 font-semibold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
