import React, { useState } from 'react';
import {
  Scan,
  Car,
  Calendar,
  IndianRupee,
  PlusCircle,
  Wrench,
  Fuel,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FileText,
  Sparkles,
  ArrowUpRight,
  Volume2,
  Activity,
  Globe,
  Palette,
} from 'lucide-react';
import { useGarage } from '../../context/GarageContext';
import { SoundScannerModal } from '../scanner/SoundScannerModal';

interface DashboardTabProps {
  onOpenAddExpense: () => void;
  onOpenAddVehicle: () => void;
  onOpenFuelLog: () => void;
  onOpenServiceBooking: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  onOpenAddExpense,
  onOpenAddVehicle,
  onOpenFuelLog,
  onOpenServiceBooking,
}) => {
  const {
    vehicles,
    activeVehicle,
    services,
    expenses,
    fuelLogs,
    setActiveTab,
    setSelectedVehicleDetailId,
    setIsAssistantOpen,
  } = useGarage();

  const [analyticsView, setAnalyticsView] = useState<'month' | 'year'>('month');
  const [isSoundScannerOpen, setIsSoundScannerOpen] = useState(false);

  // Calculations
  const totalVehiclesCount = vehicles.length;

  const totalServiceCost = services.reduce((acc, curr) => acc + curr.cost, 0);
  const totalFuelCost = fuelLogs.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalExpensesAllTime = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // This month calculations (October 2026)
  const thisMonthExpenses = expenses
    .filter((e) => e.date.startsWith('2026-10'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Service due countdown for active vehicle
  const getDaysUntil = (dateStr: string) => {
    try {
      const target = new Date(dateStr);
      const now = new Date('2026-10-08T01:11:38'); // current local time
      const diffTime = target.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 12;
    }
  };

  const daysToNextService = activeVehicle ? getDaysUntil(activeVehicle.nextServiceDate) : 12;
  const daysToInsurance = activeVehicle ? getDaysUntil(activeVehicle.insuranceExpiry) : 18;
  const daysToPuc = activeVehicle ? getDaysUntil(activeVehicle.pucExpiry) : 9;

  return (
    <div className="p-4 space-y-4">
      {/* 1. HERO ACTIVE VEHICLE BANNER CARD */}
      {activeVehicle && (
        <div
          onClick={() => {
            setSelectedVehicleDetailId(activeVehicle.id);
            setActiveTab('garage');
          }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-850 border border-slate-800 p-4 shadow-xl cursor-pointer group hover:border-cyan-500/50 transition-all duration-200"
        >
          {/* Subtle vehicle backdrop image */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 group-hover:opacity-35 transition overflow-hidden">
            <img
              src={activeVehicle.imageUrl}
              alt={activeVehicle.model}
              className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
          </div>

          <div className="relative z-10">
            {/* Top row tags */}
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                ACTIVE VEHICLE
              </span>

              {/* Indian Registration Plate Badge */}
              <div className="inline-flex items-center border border-amber-400/80 bg-amber-400/10 px-2.5 py-0.5 rounded-md font-mono text-xs font-bold text-amber-300 tracking-wider shadow-sm">
                <span className="text-[9px] mr-1 text-blue-400 font-sans">IND</span>
                {activeVehicle.registrationNumber}
              </div>
            </div>

            {/* Car Name & Specs with Nation Badge */}
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition flex items-center gap-1.5">
                {activeVehicle.brand} {activeVehicle.model}
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-700 text-[10px] font-semibold text-slate-200">
                {activeVehicle.nation || 'India 🇮🇳'}
              </span>
            </div>

            {/* Color Swatch & Finish ("Color Everything") */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800">
                <span
                  className="w-3 h-3 rounded-full border border-slate-600 shrink-0"
                  style={{ backgroundColor: activeVehicle.colorDetails?.hexCode || '#64748B' }}
                />
                {activeVehicle.colorDetails?.secondaryHex && (
                  <span
                    className="w-3 h-3 rounded-full border border-slate-600 shrink-0 -ml-1"
                    style={{ backgroundColor: activeVehicle.colorDetails.secondaryHex }}
                  />
                )}
                <span className="text-[11px] text-cyan-300 font-medium">
                  {activeVehicle.colorDetails?.name || activeVehicle.colour} ({activeVehicle.colorDetails?.finish || 'Metallic'})
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {activeVehicle.variant} • {activeVehicle.year}
              </span>
            </div>

            {/* Pricing Intelligence: Original Launch Price & Est. Current Resale */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/70 p-2 rounded-xl border border-slate-800/80 mb-3">
              <div>
                <span className="text-[9px] text-slate-500 uppercase block font-semibold">Ex-Showroom Launch</span>
                <span className="font-mono font-bold text-white block truncate">
                  {activeVehicle.originalLaunchPriceINR || '₹8.15 Lakh'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-500 uppercase block font-semibold">Est. Current Resale</span>
                <span className="font-mono font-bold text-emerald-400 block truncate">
                  {activeVehicle.currentResaleValueINR || '₹11.80 Lakh'}
                </span>
              </div>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-800/80">
              <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
                <p className="text-[10px] text-slate-400">Odometer</p>
                <p className="text-xs font-mono font-bold text-slate-200">
                  {activeVehicle.currentOdometer.toLocaleString('en-IN')} km
                </p>
              </div>
              <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
                <p className="text-[10px] text-slate-400">Fuel Type</p>
                <p className="text-xs font-semibold text-cyan-400">{activeVehicle.fuelType}</p>
              </div>
              <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
                <p className="text-[10px] text-slate-400">Next Service</p>
                <p className="text-xs font-semibold text-amber-400">
                  {daysToNextService > 0 ? `${daysToNextService}d` : 'Due'}
                </p>
              </div>
            </div>

            {/* Acoustic Sound Diagnostic Quick Action Button */}
            <div className="pt-2.5 mt-2.5 border-t border-slate-800/80">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSoundScannerOpen(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-between transition shadow-sm"
              >
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Engine Sound & Acoustic Check</span>
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>97% Health</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CARD A: AI CAR SCANNER (Highlighted Primary Feature) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/40 p-4 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI CAR SCANNER</span>
            </div>
            <h3 className="text-base font-extrabold text-white">Identify Any Car Instantaneously</h3>
            <p className="text-xs text-slate-300 max-w-[210px] leading-relaxed">
              Scan front, rear, or badges to recognize make, model, variant, year & specs.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('scan')}
            className="shrink-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-lg shadow-cyan-500/30 transition transform active:scale-95 text-xs"
          >
            <Scan className="w-5 h-5 text-slate-950" />
            <span>Scan Car</span>
          </button>
        </div>
      </div>

      {/* 3. QUICK ACTIONS GRID (5 actions from prompt) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Quick Actions
          </h4>
          <span className="text-[11px] text-cyan-400 font-medium">One-Tap Management</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {/* Quick Action 1: Scan Car */}
          <button
            onClick={() => setActiveTab('scan')}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center mb-1 group-hover:scale-105 transition">
              <Scan className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-[10px] font-medium text-slate-300">Scan Car</span>
          </button>

          {/* Quick Action 2: Add Vehicle */}
          <button
            onClick={onOpenAddVehicle}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-500/40 flex items-center justify-center mb-1 group-hover:scale-105 transition">
              <PlusCircle className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-[10px] font-medium text-slate-300">Add Car</span>
          </button>

          {/* Quick Action 3: Book Service */}
          <button
            onClick={onOpenServiceBooking}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-500/40 flex items-center justify-center mb-1 group-hover:scale-105 transition">
              <Wrench className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[10px] font-medium text-slate-300">Book Service</span>
          </button>

          {/* Quick Action 4: Add Expense */}
          <button
            onClick={onOpenAddExpense}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center mb-1 group-hover:scale-105 transition">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] font-medium text-slate-300">Expense</span>
          </button>

          {/* Quick Action 5: View Garage */}
          <button
            onClick={() => setActiveTab('garage')}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center mb-1 group-hover:scale-105 transition">
              <Car className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-[10px] font-medium text-slate-300">My Garage</span>
          </button>
        </div>
      </div>

      {/* 4. DASHBOARD CARDS: B (My Garage), C (Upcoming Service), D (Expense Summary) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card B: MY GARAGE OVERVIEW */}
        <div
          onClick={() => setActiveTab('garage')}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">My Garage</span>
              <Car className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-extrabold text-white">
              {totalVehiclesCount} {totalVehiclesCount === 1 ? 'Car' : 'Cars'}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              Active: {activeVehicle ? activeVehicle.model : 'None'}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Total Service:</span>
            <span className="font-semibold text-cyan-400">₹{totalServiceCost.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Card D: EXPENSE SUMMARY */}
        <div
          onClick={onOpenAddExpense}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Expense Summary</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-extrabold text-emerald-400">
              ₹{thisMonthExpenses.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">This Month (Oct 2026)</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">All-time:</span>
            <span className="font-semibold text-slate-200">₹{totalExpensesAllTime.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Card C: UPCOMING SERVICE & CRITICAL REMINDERS */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Upcoming Service & Deadlines
            </h4>
          </div>
          <button
            onClick={onOpenServiceBooking}
            className="text-[11px] text-cyan-400 hover:underline font-semibold"
          >
            Book Now
          </button>
        </div>

        <div className="space-y-2">
          {/* Service Due Row */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Periodic Service Due</p>
                <p className="text-[10px] text-slate-400">
                  Target: {activeVehicle?.nextServiceOdometer.toLocaleString('en-IN') || '36,000'} km
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30">
                in {daysToNextService} days
              </span>
            </div>
          </div>

          {/* PUC Warning */}
          {daysToPuc <= 15 && (
            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">PUC Certificate Expiry</p>
                  <p className="text-[10px] text-slate-400">Renewal required at nearest pump</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[11px] border border-rose-500/30">
                {daysToPuc} days left
              </span>
            </div>
          )}

          {/* Insurance Warning */}
          {daysToInsurance <= 30 && (
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Insurance Policy Renewal</p>
                  <p className="text-[10px] text-slate-400">
                    {activeVehicle?.insuranceProvider?.split(' ')[0] || 'Motor'} Policy
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[11px] border border-blue-500/30">
                {daysToInsurance} days
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 5. SECTION 19: HOME DASHBOARD ANALYTICS & CHARTS */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Garage Analytics & Spending
            </h4>
            <p className="text-[10px] text-slate-400">Indian Rupee (₹) Expense Breakdown</p>
          </div>
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] font-semibold">
            <button
              onClick={() => setAnalyticsView('month')}
              className={`px-2 py-1 rounded-md transition ${
                analyticsView === 'month' ? 'bg-cyan-600 text-white' : 'text-slate-400'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setAnalyticsView('year')}
              className={`px-2 py-1 rounded-md transition ${
                analyticsView === 'year' ? 'bg-cyan-600 text-white' : 'text-slate-400'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Visual Multi-Segment Bar for Category Proportions */}
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
            <div
              style={{ width: `${(totalFuelCost / (totalExpensesAllTime || 1)) * 100}%` }}
              className="bg-emerald-500 h-full transition-all"
              title="Fuel"
            />
            <div
              style={{ width: `${(totalServiceCost / (totalExpensesAllTime || 1)) * 100}%` }}
              className="bg-cyan-500 h-full transition-all"
              title="Service"
            />
            <div
              style={{
                width: `${
                  Math.max(
                    0,
                    100 -
                      ((totalFuelCost + totalServiceCost) / (totalExpensesAllTime || 1)) * 100
                  )
                }%`,
              }}
              className="bg-purple-500 h-full transition-all"
              title="Other"
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Fuel (₹{totalFuelCost.toLocaleString('en-IN')})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>Service (₹{totalServiceCost.toLocaleString('en-IN')})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Repairs / Wash</span>
            </div>
          </div>
        </div>

        {/* Monthly Trend Mini Visual Bars */}
        <div className="pt-2 border-t border-slate-800/80">
          <p className="text-[11px] font-semibold text-slate-300 mb-2">Monthly Expenditure (2026)</p>
          <div className="grid grid-cols-5 gap-2 items-end h-20 pt-4">
            {[
              { m: 'Jun', amt: 5200, pct: 45 },
              { m: 'Jul', amt: 6400, pct: 55 },
              { m: 'Aug', amt: 8100, pct: 70 },
              { m: 'Sep', amt: 9600, pct: 82 },
              { m: 'Oct', amt: 11450, pct: 98, current: true },
            ].map((bar) => (
              <div key={bar.m} className="flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[9px] font-mono text-slate-400">₹{(bar.amt / 1000).toFixed(1)}k</span>
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    bar.current
                      ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_8px_#38bdf8]'
                      : 'bg-slate-800'
                  }`}
                  style={{ height: `${bar.pct}%` }}
                />
                <span className={`text-[10px] ${bar.current ? 'font-bold text-cyan-400' : 'text-slate-500'}`}>
                  {bar.m}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating AutoAI Assistant Teaser */}
      <div
        onClick={() => setIsAssistantOpen(true)}
        className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/60 border border-cyan-500/30 flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Ask AutoAI Assistant</p>
            <p className="text-[10px] text-slate-400">
              “What service does my car need at 35,000 km?”
            </p>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
      </div>

      {/* Sound Scanner Modal for Engine Sound Diagnostic */}
      <SoundScannerModal
        isOpen={isSoundScannerOpen}
        onClose={() => setIsSoundScannerOpen(false)}
        targetVehicle={activeVehicle}
      />
    </div>
  );
};
