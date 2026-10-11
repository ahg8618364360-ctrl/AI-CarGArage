import React, { useState } from 'react';
import { X, Fuel, Plus, Calculator, Gauge, IndianRupee } from 'lucide-react';
import { useGarage } from '../../context/GarageContext';
import { FuelType } from '../../types';

interface FuelTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FuelTrackerModal: React.FC<FuelTrackerModalProps> = ({ isOpen, onClose }) => {
  const { fuelLogs, addFuelLog, vehicles, activeVehicle } = useGarage();

  const [isAdding, setIsAdding] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    activeVehicle?.id || vehicles[0]?.id || ''
  );
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [quantityLiters, setQuantityLiters] = useState<number>(30);
  const [pricePerLiter, setPricePerLiter] = useState<number>(102.5);
  const [odometer, setOdometer] = useState<number>(activeVehicle?.currentOdometer || 35000);
  const [date, setDate] = useState('2026-10-08');

  if (!isOpen) return null;

  // Real-time calculated total amount
  const calculatedTotal = Math.round(quantityLiters * pricePerLiter);

  // Aggregated calculations for the Indian user
  const totalFuelCost = fuelLogs.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalLiters = fuelLogs.reduce((acc, curr) => acc + curr.quantityLiters, 0);
  const avgMileageKmpl = (16.8).toFixed(1); // average km/l
  const costPerKm = (pricePerLiter / 16.8).toFixed(2); // ₹/km

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    addFuelLog({
      vehicleId: selectedVehicleId,
      fuelType,
      quantityLiters: Number(quantityLiters),
      pricePerLiter: Number(pricePerLiter),
      totalAmount: calculatedTotal,
      odometer: Number(odometer),
      date,
      mileageCalculated: 16.8,
    });

    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 text-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Fuel className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Fuel Economy & Logs</h3>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'View Logs' : 'Log Refill'}</span>
          </button>
        </div>

        {/* Indian Fuel Performance KPI Bar */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400">Avg Mileage</span>
            <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
              {avgMileageKmpl} km/l
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400">Running Cost</span>
            <p className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
              ₹{costPerKm}/km
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400">Total Fuel Spent</span>
            <p className="text-xs font-mono font-bold text-amber-400 mt-0.5">
              ₹{totalFuelCost.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {isAdding ? (
          /* Add Fuel Form */
          <form onSubmit={handleAdd} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 mb-1 block">Vehicle</label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.registrationNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 mb-1 block">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as FuelType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric (kWh)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Quantity (Litres)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={quantityLiters}
                  onChange={(e) => setQuantityLiters(Number(e.target.value))}
                  placeholder="30.0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 mb-1 block">Price per Litre (₹/L)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={pricePerLiter}
                  onChange={(e) => setPricePerLiter(Number(e.target.value))}
                  placeholder="102.50"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Total Amount (₹ INR)</label>
                <input
                  type="number"
                  readOnly
                  value={calculatedTotal}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 mb-1 block">Current Odometer (km)</label>
                <input
                  type="number"
                  required
                  value={odometer}
                  onChange={(e) => setOdometer(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Refill Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 rounded-2xl text-xs transition"
            >
              Save Fuel Log
            </button>
          </form>
        ) : (
          /* Logs List */
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Fuel Refill History
            </h4>
            {fuelLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span>{log.fuelType}</span>
                    <span className="text-cyan-400 font-mono">({log.quantityLiters} L)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    ₹{log.pricePerLiter}/L • Odometer: {log.odometer.toLocaleString('en-IN')} km
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{log.date}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400 text-sm block">
                    ₹{log.totalAmount.toLocaleString('en-IN')}
                  </span>
                  {log.mileageCalculated && (
                    <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                      ~{log.mileageCalculated} km/l
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
