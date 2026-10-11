import React from 'react';
import { Home, Car, Scan, Wrench, User } from 'lucide-react';
import { useGarage } from '../../context/GarageContext';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedVehicleDetailId } = useGarage();

  const handleTabClick = (tab: 'home' | 'garage' | 'scan' | 'services' | 'profile') => {
    // If switching tabs, clear nested detail view so user lands on top-level
    setSelectedVehicleDetailId(null);
    setActiveTab(tab);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 max-w-md mx-auto md:max-w-none md:inset-x-0">
      <div className="flex items-center justify-around relative">
        {/* Tab 1: Home */}
        <button
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition duration-150 ${
            activeTab === 'home'
              ? 'text-cyan-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Home</span>
          {activeTab === 'home' && (
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-0.5" />
          )}
        </button>

        {/* Tab 2: Garage */}
        <button
          onClick={() => handleTabClick('garage')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition duration-150 ${
            activeTab === 'garage'
              ? 'text-cyan-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <Car className={`w-5 h-5 ${activeTab === 'garage' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Garage</span>
          {activeTab === 'garage' && (
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-0.5" />
          )}
        </button>

        {/* Tab 3: SCAN (Elevated Prominent AI Button) */}
        <div className="relative -top-4">
          <button
            onClick={() => handleTabClick('scan')}
            className={`group relative flex flex-col items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-amber-500 p-0.5 shadow-xl shadow-cyan-500/30 transition-transform active:scale-95 ${
              activeTab === 'scan' ? 'ring-4 ring-cyan-500/30 scale-105' : 'hover:scale-105'
            }`}
            title="Scan Car with AI"
          >
            <div className="w-full h-full bg-slate-950 group-hover:bg-slate-900 rounded-full flex flex-col items-center justify-center transition">
              <Scan className="w-6 h-6 text-cyan-400 group-hover:text-amber-400 transition" />
            </div>
            <span className="absolute -bottom-5 text-[10px] font-bold text-cyan-400 tracking-wide">
              SCAN
            </span>
          </button>
        </div>

        {/* Tab 4: Services */}
        <button
          onClick={() => handleTabClick('services')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition duration-150 ${
            activeTab === 'services'
              ? 'text-cyan-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <Wrench className={`w-5 h-5 ${activeTab === 'services' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Services</span>
          {activeTab === 'services' && (
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-0.5" />
          )}
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition duration-150 ${
            activeTab === 'profile'
              ? 'text-cyan-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Profile</span>
          {activeTab === 'profile' && (
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
