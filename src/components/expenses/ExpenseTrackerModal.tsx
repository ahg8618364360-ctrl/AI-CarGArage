import React, { useState } from 'react';
import { X, IndianRupee, Plus, TrendingUp, Filter, Calendar } from 'lucide-react';
import { useGarage } from '../../context/GarageContext';

interface ExpenseTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpenseTrackerModal: React.FC<ExpenseTrackerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { expenses, addExpense, vehicles, activeVehicle } = useGarage();

  const [isAdding, setIsAdding] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    activeVehicle?.id || vehicles[0]?.id || ''
  );
  const [category, setCategory] = useState<any>('Fuel');
  const [amount, setAmount] = useState<number>(2500);
  const [date, setDate] = useState('2026-10-08');
  const [description, setDescription] = useState('Fuel fill-up at IOCL petrol bunk');
  const [odometer, setOdometer] = useState<number>(activeVehicle?.currentOdometer || 35000);

  if (!isOpen) return null;

  // Analytics
  const totalAllTime = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const thisMonth = expenses
    .filter((e) => e.date.startsWith('2026-10'))
    .reduce((acc, curr) => acc + curr.amount, 0);
  const thisYear = expenses
    .filter((e) => e.date.startsWith('2026'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const categories = [
    'Fuel',
    'Service',
    'Repair',
    'Insurance',
    'Accessories',
    'Tyres',
    'Battery',
    'Car Wash',
    'Other',
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find((v) => v.id === selectedVehicleId) || activeVehicle;

    addExpense({
      vehicleId: selectedVehicleId,
      vehicleName: veh ? `${veh.brand} ${veh.model}` : 'Car',
      category,
      amount: Number(amount),
      date,
      description,
      odometer: Number(odometer),
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
            <IndianRupee className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Expenses & Analytics</h3>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'View List' : 'Log Expense'}</span>
          </button>
        </div>

        {/* 3 KPI Summary Cards from Prompt */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400">This Month</span>
            <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
              ₹{thisMonth.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400">This Year</span>
            <p className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
              ₹{thisYear.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400">Total All-Time</span>
            <p className="text-xs font-mono font-bold text-white mt-0.5">
              ₹{totalAllTime.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {isAdding ? (
          /* Add Expense Form */
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
                <label className="text-slate-400 mb-1 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="2500"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 mb-1 block">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Odometer (km)</label>
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 mb-1 block">Description</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Shell V-Power 30L refill"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold py-3 rounded-2xl text-xs transition"
            >
              Record Expense Entry
            </button>
          </form>
        ) : (
          /* Expense History List */
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Logged Transactions ({expenses.length})
            </h4>
            {expenses.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">{item.category}</span>
                    <span className="text-[10px] text-slate-500">• {item.vehicleName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.date}</p>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm shrink-0">
                  ₹{item.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
