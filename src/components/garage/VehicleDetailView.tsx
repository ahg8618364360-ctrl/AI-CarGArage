import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Shield,
  FileText,
  Wrench,
  Fuel,
  IndianRupee,
  Clock,
  PlusCircle,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Edit2,
  Trash2,
  Globe,
  Palette,
  Volume2,
  Activity,
  Zap,
} from 'lucide-react';
import { useGarage } from '../../context/GarageContext';
import { Vehicle } from '../../types';
import { SoundScannerModal } from '../scanner/SoundScannerModal';

interface VehicleDetailViewProps {
  vehicleId: string;
  onBack: () => void;
  onOpenAddService: () => void;
  onOpenAddExpense: () => void;
  onOpenAddDocument: () => void;
  onOpenAddFuel: () => void;
}

export const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({
  vehicleId,
  onBack,
  onOpenAddService,
  onOpenAddExpense,
  onOpenAddDocument,
  onOpenAddFuel,
}) => {
  const { vehicles, services, expenses, documents, fuelLogs, updateVehicle, deleteVehicle } = useGarage();
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  const [activeTab, setActiveTab] = useState<'info' | 'maintenance' | 'insurance' | 'documents' | 'expenses'>('info');
  const [isSoundScannerOpen, setIsSoundScannerOpen] = useState(false);

  if (!vehicle) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-slate-400">Vehicle not found in garage.</p>
        <button onClick={onBack} className="text-xs text-cyan-400 font-bold underline">
          Return to My Garage
        </button>
      </div>
    );
  }

  // Filter records for this car
  const carServices = services.filter((s) => s.vehicleId === vehicleId);
  const carExpenses = expenses.filter((e) => e.vehicleId === vehicleId);
  const carDocs = documents.filter((d) => d.vehicleId === vehicleId);
  const carFuelLogs = fuelLogs.filter((f) => f.vehicleId === vehicleId);

  const totalCarExpense = carExpenses.reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Garage</span>
        </button>

        {/* Indian Registration Plate Pill */}
        <div className="border border-amber-400/80 bg-amber-400/10 px-2.5 py-1 rounded-md font-mono text-xs font-bold text-amber-300 tracking-wider">
          <span className="text-[9px] mr-1 text-blue-400 font-sans">IND</span>
          {vehicle.registrationNumber}
        </div>
      </div>

      {/* Vehicle Hero Card with Image */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
        <div className="h-44 w-full relative">
          <img
            src={vehicle.imageUrl}
            alt={vehicle.model}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="p-4 relative -mt-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  {vehicle.brand}
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-slate-950/90 border border-slate-800 text-[10px] text-slate-300">
                  {vehicle.nation || 'India 🇮🇳'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white">
                {vehicle.model}
              </h2>
              <p className="text-xs text-slate-300">
                {vehicle.variant} • {vehicle.year}
              </p>
              {/* Color swatch */}
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="w-3 h-3 rounded-full border border-slate-700 shadow-sm shrink-0"
                  style={{ backgroundColor: vehicle.colorDetails?.hexCode || '#64748B' }}
                />
                <span className="text-[11px] text-cyan-300 font-medium">
                  {vehicle.colorDetails?.name || vehicle.colour} ({vehicle.colorDetails?.finish || 'Metallic'})
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-200">
              {vehicle.fuelType}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center">
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
              <span className="text-[10px] text-slate-400">Odometer</span>
              <p className="text-xs font-mono font-bold text-white">
                {vehicle.currentOdometer.toLocaleString('en-IN')} km
              </p>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
              <span className="text-[10px] text-slate-400">Total Spent</span>
              <p className="text-xs font-mono font-bold text-emerald-400">
                ₹{totalCarExpense.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/50">
              <span className="text-[10px] text-slate-400">Transmission</span>
              <p className="text-xs font-semibold text-slate-200 truncate">{vehicle.transmission}</p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK SOUND DIAGNOSTIC ACTION BAR */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/60 border border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Volume2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Engine Sound & Exhaust Health</p>
            <p className="text-[10px] text-slate-400">
              {vehicle.soundSignature?.healthStatus || '97% Acoustic Health Score'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSoundScannerOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
        >
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Scan Sound</span>
        </button>
      </div>

      {/* Detail Section Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
        {[
          { id: 'info', label: 'Vehicle Info', icon: FileText },
          { id: 'maintenance', label: 'Maintenance', icon: Wrench },
          { id: 'insurance', label: 'Insurance & PUC', icon: Shield },
          { id: 'documents', label: 'Documents Vault', icon: FileText },
          { id: 'expenses', label: 'Expenses Ledger', icon: IndianRupee },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: VEHICLE INFORMATION */}
      {activeTab === 'info' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Registration & Core Specifications
          </h4>

          {/* Pricing & Valuation Snapshot */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-emerald-400" />
              <span>Launch Price & Current Valuation</span>
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[9px] text-slate-500 block">Ex-Showroom Base</span>
                <span className="font-mono font-bold text-white text-[11px] block truncate">
                  {vehicle.originalLaunchPriceINR || '₹8.15 Lakh'}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block">Original On-Road</span>
                <span className="font-mono font-bold text-cyan-400 text-[11px] block truncate">
                  {vehicle.originalOnRoadPriceINR || '₹14.20 Lakh'}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block">Current Est. Resale</span>
                <span className="font-mono font-bold text-emerald-400 text-[11px] block truncate">
                  {vehicle.currentResaleValueINR || '₹11.80 Lakh'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400">Make / Manufacturer</span>
              <p className="font-bold text-white">{vehicle.brand}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400">Nation / Country of Origin</span>
              <p className="font-bold text-amber-300">{vehicle.nation || 'India 🇮🇳'}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400">Model</span>
              <p className="font-bold text-white">{vehicle.model}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400">Variant / Trim</span>
              <p className="font-bold text-white">{vehicle.variant}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400">Registration Number</span>
              <p className="font-mono font-bold text-amber-300">{vehicle.registrationNumber}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400">Manufacturing Year</span>
              <p className="font-bold text-white">{vehicle.year}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400">Exterior Paint & Finish</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-slate-700"
                  style={{ backgroundColor: vehicle.colorDetails?.hexCode || '#4B5563' }}
                />
                <p className="font-bold text-white truncate">{vehicle.colorDetails?.name || vehicle.colour}</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400">Fuel Type</span>
              <p className="font-bold text-cyan-400">{vehicle.fuelType}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400">Transmission</span>
              <p className="font-bold text-white">{vehicle.transmission}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 col-span-2">
              <span className="text-[10px] text-slate-400">Chassis / VIN</span>
              <p className="font-mono text-xs font-semibold text-slate-300">
                {vehicle.vinChassis || 'MAT623490P2K98761'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400">Launch Ex-Showroom Price</span>
              <p className="font-mono text-xs font-bold text-white">
                {vehicle.originalLaunchPriceINR || '₹8.15 Lakh (Ex-Showroom)'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400">Current Resale Valuation</span>
              <p className="font-mono text-xs font-bold text-emerald-400">
                {vehicle.currentResaleValueINR || '₹11.80 Lakh'}
              </p>
            </div>
            {vehicle.purchasePrice && (
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 col-span-2">
                <span className="text-[10px] text-slate-400">Original Invoice Purchase Price</span>
                <p className="font-mono text-sm font-bold text-emerald-400">
                  ₹{vehicle.purchasePrice.toLocaleString('en-IN')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MAINTENANCE */}
      {activeTab === 'maintenance' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Service Schedules & History
            </h4>
            <button
              onClick={onOpenAddService}
              className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 rounded-xl"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Service</span>
            </button>
          </div>

          {/* Next Service Due Card */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase">Upcoming Target</span>
              <p className="text-sm font-bold text-white mt-0.5">
                Next Service on {vehicle.nextServiceDate}
              </p>
              <p className="text-[11px] text-slate-400">
                Odometer Target: {vehicle.nextServiceOdometer.toLocaleString('en-IN')} km
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
              12 Days
            </span>
          </div>

          {/* Service History Records */}
          <div className="space-y-2">
            {carServices.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No service records logged yet.</p>
            ) : (
              carServices.map((record) => (
                <div
                  key={record.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white">{record.serviceName}</p>
                      <p className="text-[11px] text-cyan-400">{record.serviceCentre}</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      ₹{record.cost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>Date: {record.date}</span>
                    <span>Odometer: {record.odometer.toLocaleString('en-IN')} km</span>
                  </div>
                  {record.notes && (
                    <p className="text-[11px] text-slate-400 italic pt-1">{record.notes}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INSURANCE & PUC */}
      {activeTab === 'insurance' && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Comprehensive Motor Insurance
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Insurance Provider</span>
                <p className="font-bold text-white">{vehicle.insuranceProvider || 'ICICI Lombard Motor Insurance'}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Policy Number</span>
                <p className="font-mono font-bold text-cyan-400">{vehicle.insurancePolicyNumber || '3001/2498711/00/000'}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400">Policy Expiry Date</span>
                  <p className="font-bold text-white">{vehicle.insuranceExpiry}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold">
                  Expires in 18 days
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Pollution Under Control (PUC)
            </h4>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-rose-500/30 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400">PUC Expiry Date</span>
                <p className="font-bold text-white">{vehicle.pucExpiry}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold">
                Expires in 9 days!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DOCUMENTS VAULT */}
      {activeTab === 'documents' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Vehicle Documents Vault
            </h4>
            <button
              onClick={onOpenAddDocument}
              className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 rounded-xl"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Document</span>
            </button>
          </div>

          <div className="space-y-2">
            {carDocs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No documents uploaded.</p>
            ) : (
              carDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{doc.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Doc: {doc.fileNumber}</p>
                      {doc.expiryDate && (
                        <p className="text-[10px] text-amber-400">Expires: {doc.expiryDate}</p>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                    VERIFIED
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: EXPENSES LEDGER */}
      {activeTab === 'expenses' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Vehicle Expense Ledger
            </h4>
            <div className="flex gap-1.5">
              <button
                onClick={onOpenAddFuel}
                className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-1 rounded-lg"
              >
                <Fuel className="w-3 h-3" />
                <span>+ Fuel</span>
              </button>
              <button
                onClick={onOpenAddExpense}
                className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-2 py-1 rounded-lg"
              >
                <PlusCircle className="w-3 h-3" />
                <span>+ Expense</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {carExpenses.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No expenses recorded for this car.</p>
            ) : (
              carExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">
                      {exp.category}
                    </span>
                    <p className="font-semibold text-white">{exp.description}</p>
                    <p className="text-[10px] text-slate-500">{exp.date}</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Sound Scanner Modal for this car */}
      <SoundScannerModal
        isOpen={isSoundScannerOpen}
        onClose={() => setIsSoundScannerOpen(false)}
        targetVehicle={vehicle}
      />
    </div>
  );
};
