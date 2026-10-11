import React, { useState } from 'react';
import {
  Car,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Shield,
  Wrench,
  Fuel,
  ChevronRight,
  Sparkles,
  Volume2,
  Activity,
} from 'lucide-react';
import { useGarage } from '../../context/GarageContext';
import { VehicleDetailView } from './VehicleDetailView';
import { AddVehicleModal } from './AddVehicleModal';
import { SoundScannerModal } from '../scanner/SoundScannerModal';

interface GarageTabProps {
  onOpenAddExpense: () => void;
  onOpenAddService: () => void;
  onOpenAddDocument: () => void;
  onOpenAddFuel: () => void;
}

export const GarageTab: React.FC<GarageTabProps> = ({
  onOpenAddExpense,
  onOpenAddService,
  onOpenAddDocument,
  onOpenAddFuel,
}) => {
  const {
    vehicles,
    activeVehicleId,
    setActiveVehicleId,
    deleteVehicle,
    selectedVehicleDetailId,
    setSelectedVehicleDetailId,
    setActiveTab,
  } = useGarage();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [soundCheckVehicle, setSoundCheckVehicle] = useState<any | null>(null);

  // If a vehicle detail is selected, show full vehicle profile
  if (selectedVehicleDetailId) {
    return (
      <VehicleDetailView
        vehicleId={selectedVehicleDetailId}
        onBack={() => setSelectedVehicleDetailId(null)}
        onOpenAddService={onOpenAddService}
        onOpenAddExpense={onOpenAddExpense}
        onOpenAddDocument={onOpenAddDocument}
        onOpenAddFuel={onOpenAddFuel}
      />
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-cyan-400" />
            <span>My Garage</span>
          </h2>
          <p className="text-xs text-slate-400">
            {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} registered in your digital fleet
          </p>
        </div>

        <button
          onClick={() => {
            setEditingVehicleId(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-md shadow-cyan-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Car</span>
        </button>
      </div>

      {/* Vehicle Cards List */}
      <div className="space-y-3">
        {vehicles.map((car) => {
          const isActive = car.id === activeVehicleId;

          return (
            <div
              key={car.id}
              className={`rounded-3xl overflow-hidden bg-slate-900 border transition-all duration-200 ${
                isActive
                  ? 'border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Car Banner Image with Indian Plate */}
              <div className="h-36 w-full relative overflow-hidden bg-slate-950">
                <img
                  src={car.imageUrl}
                  alt={car.model}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {isActive ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400/80 text-cyan-300 text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      ACTIVE
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveVehicleId(car.id)}
                      className="px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white text-[10px] font-medium"
                    >
                      Set as Active
                    </button>
                  )}
                </div>

                {/* Indian Registration Plate Tag & Nation Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-700 text-[10px] font-semibold text-slate-200">
                    {car.nation || 'India 🇮🇳'}
                  </span>
                  <div className="border border-amber-400/80 bg-amber-400/10 backdrop-blur-md px-2 py-0.5 rounded-md font-mono text-[11px] font-bold text-amber-300 tracking-wider shadow-md">
                    <span className="text-[8px] mr-1 text-blue-400 font-sans">IND</span>
                    {car.registrationNumber}
                  </div>
                </div>

                {/* Car Title overlay */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                      {car.brand}
                    </span>
                    <h3 className="text-lg font-black text-white leading-tight">
                      {car.model}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-slate-600 shrink-0"
                        style={{ backgroundColor: car.colorDetails?.hexCode || '#64748B' }}
                      />
                      <p className="text-[11px] text-cyan-300 font-medium">
                        {car.colorDetails?.name || car.colour} ({car.colorDetails?.finish || 'Metallic'})
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-200 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                    {car.currentOdometer.toLocaleString('en-IN')} km
                  </span>
                </div>
              </div>

              {/* Pricing Intelligence Banner */}
              <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950/90 px-3.5 py-1.5 border-t border-slate-800/80">
                <span className="text-slate-400 truncate">
                  Launch: <strong className="text-white font-mono">{car.originalLaunchPriceINR || '₹8.15 L (Ex-Show)'}</strong>
                </span>
                <span className="text-slate-400 text-right truncate">
                  Resale: <strong className="text-emerald-400 font-mono">{car.currentResaleValueINR || '₹11.80 L'}</strong>
                </span>
              </div>

              {/* Bottom Quick Action Buttons */}
              <div className="p-3 bg-slate-900 flex items-center justify-between gap-2 border-t border-slate-800/80 text-xs">
                {/* View Details Button */}
                <button
                  onClick={() => setSelectedVehicleDetailId(car.id)}
                  className="flex-1 bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-300 font-bold py-2 px-3 rounded-xl border border-cyan-500/30 flex items-center justify-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                {/* Sound Diagnostic Button */}
                <button
                  onClick={() => setSoundCheckVehicle(car)}
                  className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center gap-1.5 transition"
                  title="Run Engine Sound Diagnostic"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sound</span>
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => {
                    setEditingVehicleId(car.id);
                    setIsAddModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 transition"
                  title="Edit Vehicle"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* Delete Button */}
                {vehicles.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${car.brand} ${car.model} from your garage?`)) {
                        deleteVehicle(car.id);
                      }
                    }}
                    className="p-2 text-rose-400 hover:text-rose-300 rounded-xl bg-slate-950 border border-slate-800 hover:bg-rose-950/40 transition"
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Scan Car Invitation Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 to-cyan-950/60 border border-slate-800 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Have a new car to add?</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Use the AI scanner to auto-fill specs from a single photo!
          </p>
        </div>
        <button
          onClick={() => setActiveTab('scan')}
          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shrink-0 transition"
        >
          Scan Car
        </button>
      </div>

      {/* Add / Edit Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingVehicleId(null);
        }}
        editingVehicleId={editingVehicleId}
      />

      {/* Engine Sound Scanner Modal */}
      <SoundScannerModal
        isOpen={!!soundCheckVehicle}
        onClose={() => setSoundCheckVehicle(null)}
        targetVehicle={soundCheckVehicle}
      />
    </div>
  );
};
