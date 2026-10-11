import React, { useState } from 'react';
import { X, Search, Car, Wrench, FileText, IndianRupee, MapPin } from 'lucide-react';
import { useGarage } from '../../context/GarageContext';
import { AVAILABLE_SERVICES_CATALOG } from '../../data/mockData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { vehicles, garages, expenses, documents, setSelectedVehicleDetailId, setActiveTab } =
    useGarage();

  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const term = searchTerm.toLowerCase().trim();

  // Filter cars
  const matchedCars = term
    ? vehicles.filter(
        (v) =>
          v.brand.toLowerCase().includes(term) ||
          v.model.toLowerCase().includes(term) ||
          v.registrationNumber.toLowerCase().includes(term) ||
          v.colour.toLowerCase().includes(term)
      )
    : [];

  // Filter garages
  const matchedGarages = term
    ? garages.filter(
        (g) =>
          g.name.toLowerCase().includes(term) ||
          g.city.toLowerCase().includes(term) ||
          g.area.toLowerCase().includes(term) ||
          g.services.some((s) => s.toLowerCase().includes(term))
      )
    : [];

  // Filter services
  const matchedServices = term
    ? AVAILABLE_SERVICES_CATALOG.filter((s) => s.name.toLowerCase().includes(term))
    : [];

  // Filter expenses
  const matchedExpenses = term
    ? expenses.filter(
        (e) =>
          e.category.toLowerCase().includes(term) ||
          e.description.toLowerCase().includes(term)
      )
    : [];

  // Filter documents
  const matchedDocuments = term
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(term) ||
          d.docType.toLowerCase().includes(term) ||
          d.fileNumber.toLowerCase().includes(term)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col text-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Cars, Garages, Services, Expenses..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!searchTerm ? (
            <div className="text-center py-8 text-xs text-slate-500 space-y-1">
              <Search className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p>Type keywords to search across your garage</p>
              <p className="text-[10px]">Try: "Nexon", "Oil Change", "Insurance", "Bangalore"</p>
            </div>
          ) : (
            <>
              {/* Cars Section */}
              {matchedCars.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cars ({matchedCars.length})</span>
                  </h4>
                  {matchedCars.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedVehicleDetailId(c.id);
                        setActiveTab('garage');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 flex justify-between items-center text-xs cursor-pointer"
                    >
                      <div>
                        <span className="font-bold text-white">{c.brand} {c.model}</span>
                        <span className="text-[10px] text-slate-400 ml-2">{c.registrationNumber}</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">{c.year}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Garages Section */}
              {matchedGarages.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Garages ({matchedGarages.length})</span>
                  </h4>
                  {matchedGarages.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => {
                        setActiveTab('services');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 flex justify-between items-center text-xs cursor-pointer"
                    >
                      <div>
                        <span className="font-bold text-white">{g.name}</span>
                        <span className="text-[10px] text-slate-400 block">{g.area}, {g.city}</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400">{g.rating} ⭐</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Services Section */}
              {matchedServices.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Services ({matchedServices.length})</span>
                  </h4>
                  {matchedServices.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setActiveTab('services');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 flex justify-between items-center text-xs cursor-pointer"
                    >
                      <span className="font-bold text-white">{s.name}</span>
                      <span className="text-emerald-400 font-mono font-bold text-xs">{s.priceRange}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Expenses Section */}
              {matchedExpenses.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-purple-400" />
                    <span>Expenses ({matchedExpenses.length})</span>
                  </h4>
                  {matchedExpenses.map((e) => (
                    <div
                      key={e.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">{e.category}</span>
                        <p className="text-[10px] text-slate-400">{e.description}</p>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">₹{e.amount}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Documents Section */}
              {matchedDocuments.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>Documents ({matchedDocuments.length})</span>
                  </h4>
                  {matchedDocuments.map((d) => (
                    <div
                      key={d.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs"
                    >
                      <span className="font-bold text-white">{d.title}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">{d.fileNumber}</span>
                    </div>
                  ))}
                </div>
              )}

              {matchedCars.length === 0 &&
                matchedGarages.length === 0 &&
                matchedServices.length === 0 &&
                matchedExpenses.length === 0 &&
                matchedDocuments.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No results found for "{searchTerm}".
                  </p>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
