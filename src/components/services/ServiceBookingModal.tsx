import React, { useState } from 'react';
import { X, Calendar, Clock, Wrench, MapPin, CheckCircle2 } from 'lucide-react';
import { useGarage } from '../../context/GarageContext';
import { AVAILABLE_SERVICES_CATALOG } from '../../data/mockData';

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedGarageId?: string;
  preselectedServiceName?: string;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  isOpen,
  onClose,
  preselectedGarageId,
  preselectedServiceName,
}) => {
  const { vehicles, activeVehicle, garages, addServiceBooking } = useGarage();

  const [selectedVehicleId, setSelectedVehicleId] = useState(
    activeVehicle?.id || vehicles[0]?.id || ''
  );
  const [selectedService, setSelectedService] = useState(
    preselectedServiceName || AVAILABLE_SERVICES_CATALOG[0].name
  );
  const [selectedGarageId, setSelectedGarageId] = useState(
    preselectedGarageId || garages[0]?.id || ''
  );
  const [bookingDate, setBookingDate] = useState('2026-10-20');
  const [timeSlot, setTimeSlot] = useState('10:00 AM – 11:30 AM');
  const [notes, setNotes] = useState('Regular maintenance inspection and pickup required.');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentServiceMeta =
    AVAILABLE_SERVICES_CATALOG.find((s) => s.name === selectedService) ||
    AVAILABLE_SERVICES_CATALOG[0];

  const currentGarage = garages.find((g) => g.id === selectedGarageId) || garages[0];
  const currentVeh = vehicles.find((v) => v.id === selectedVehicleId) || activeVehicle;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVeh || !currentGarage) return;

    addServiceBooking({
      vehicleId: currentVeh.id,
      vehicleName: `${currentVeh.brand} ${currentVeh.model} (${currentVeh.registrationNumber})`,
      serviceName: selectedService,
      garageId: currentGarage.id,
      garageName: currentGarage.name,
      garageAddress: `${currentGarage.area}, ${currentGarage.city}`,
      date: bookingDate,
      timeSlot,
      estimatedCostRange: currentServiceMeta.priceRange,
      notes,
      status: 'Confirmed',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
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

        <div className="flex items-center gap-2 mb-3">
          <Wrench className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Book Car Service</h3>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">Booking Confirmed!</h4>
            <p className="text-xs text-slate-300">
              Your appointment for <span className="text-cyan-400">{selectedService}</span> at{' '}
              <span className="text-white">{currentGarage.name}</span> has been confirmed for{' '}
              <span className="text-amber-300">{bookingDate}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Field 1: Select Vehicle */}
            <div>
              <label className="text-slate-400 font-semibold mb-1 block">1. Select Vehicle</label>
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

            {/* Field 2: Select Service */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400 font-semibold">2. Select Service</label>
                <span className="text-emerald-400 font-mono font-bold">
                  {currentServiceMeta.priceRange}
                </span>
              </div>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              >
                {AVAILABLE_SERVICES_CATALOG.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.priceRange})
                  </option>
                ))}
              </select>
            </div>

            {/* Field 3: Select Garage */}
            <div>
              <label className="text-slate-400 font-semibold mb-1 block">3. Select Garage Centre</label>
              <select
                value={selectedGarageId}
                onChange={(e) => setSelectedGarageId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              >
                {garages.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} – {g.city} ({g.rating} ⭐ • {g.distanceKm} km away)
                  </option>
                ))}
              </select>
            </div>

            {/* Field 4 & 5: Date & Time */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="09:00 AM – 10:30 AM">09:00 AM – 10:30 AM</option>
                  <option value="10:00 AM – 11:30 AM">10:00 AM – 11:30 AM</option>
                  <option value="02:00 PM – 03:30 PM">02:00 PM – 03:30 PM</option>
                  <option value="04:00 PM – 05:30 PM">04:00 PM – 05:30 PM</option>
                </select>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="text-slate-400 font-semibold mb-1 block">Additional Notes / Complaints</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. slight noise over potholes, request pickup & drop"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-500"
              />
            </div>

            {/* Estimated Price Note */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Estimated Cost (INR):</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {currentServiceMeta.priceRange}
              </span>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-amber-500 hover:from-cyan-500 hover:to-amber-400 text-slate-950 font-bold py-3 rounded-2xl text-xs shadow-xl shadow-cyan-600/30 transition"
            >
              Confirm Appointment (Pay at Garage)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
