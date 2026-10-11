import React, { useState } from 'react';
import {
  Wrench,
  MapPin,
  Star,
  Phone,
  Navigation,
  Calendar,
  Clock,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Plus,
  IndianRupee,
} from 'lucide-react';
import { useGarage } from '../../context/GarageContext';
import { AVAILABLE_SERVICES_CATALOG } from '../../data/mockData';
import { ServiceBookingModal } from './ServiceBookingModal';

export const ServicesTab: React.FC = () => {
  const {
    garages,
    togglePreferredGarage,
    bookings,
    cancelServiceBooking,
    activeVehicle,
  } = useGarage();

  const [subTab, setSubTab] = useState<'catalog' | 'garages' | 'bookings'>('catalog');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedGarageId, setSelectedGarageId] = useState<string | undefined>();
  const [selectedServiceName, setSelectedServiceName] = useState<string | undefined>();

  const handleBookService = (serviceName?: string, garageId?: string) => {
    setSelectedServiceName(serviceName);
    setSelectedGarageId(garageId);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <span>Service & Maintenance</span>
          </h2>
          <p className="text-xs text-slate-400">
            Certified Indian garages & transparent ₹ INR pricing
          </p>
        </div>

        <button
          onClick={() => handleBookService()}
          className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-md shadow-cyan-600/30 transition"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Now</span>
        </button>
      </div>

      {/* Sub-Tab Navigation Pill */}
      <div className="grid grid-cols-3 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setSubTab('catalog')}
          className={`py-2 rounded-xl transition ${
            subTab === 'catalog'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Services (₹)
        </button>
        <button
          onClick={() => setSubTab('garages')}
          className={`py-2 rounded-xl transition ${
            subTab === 'garages'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Garages ({garages.length})
        </button>
        <button
          onClick={() => setSubTab('bookings')}
          className={`py-2 rounded-xl transition ${
            subTab === 'bookings'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Bookings ({bookings.length})
        </button>
      </div>

      {/* SUB-TAB 1: SERVICES CATALOG WITH ₹ INR ESTIMATES */}
      {subTab === 'catalog' && (
        <div className="space-y-3">
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">
              Active: <span className="text-white font-bold">{activeVehicle?.brand} {activeVehicle?.model}</span>
            </span>
            <span className="text-cyan-400 font-mono font-semibold">
              Standard Indian Rates (₹)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {AVAILABLE_SERVICES_CATALOG.map((srv) => (
              <div
                key={srv.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition shrink-0">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                      {srv.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{srv.duration}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">Est. Cost</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {srv.priceRange}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookService(srv.name)}
                    className="p-2 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-600 hover:text-white transition"
                    title="Book this service"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: VERIFIED SERVICE CENTRES / GARAGES */}
      {subTab === 'garages' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Top rated multi-brand garages and service stations near you:
          </p>

          <div className="space-y-3">
            {garages.map((garage) => (
              <div
                key={garage.id}
                className={`p-4 rounded-3xl bg-slate-900 border transition ${
                  garage.isPreferred
                    ? 'border-cyan-500/50 shadow-md shadow-cyan-950/30'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-white">{garage.name}</h3>
                      {garage.isOpenNow && (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[9px] font-bold border border-emerald-500/30">
                          OPEN
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{garage.area}, {garage.city} • {garage.distanceKm} km away</span>
                    </p>
                  </div>

                  {/* Bookmark Preferred button */}
                  <button
                    onClick={() => togglePreferredGarage(garage.id)}
                    className={`p-1.5 rounded-xl border transition ${
                      garage.isPreferred
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                    title="Save as Preferred Garage"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Rating & Review */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg text-amber-400 text-[11px] font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{garage.rating}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    ({garage.reviewCount} verified reviews)
                  </span>
                </div>

                {/* Service Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {garage.services.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Contact & Booking Actions */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  {/* Call Button */}
                  <a
                    href={`tel:${garage.phone}`}
                    className="py-2 px-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 flex items-center justify-center gap-1 font-semibold transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Call</span>
                  </a>

                  {/* Directions Button */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      garage.name + ' ' + garage.address
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 flex items-center justify-center gap-1 font-semibold transition"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Map</span>
                  </a>

                  {/* Book Service Button */}
                  <button
                    onClick={() => handleBookService(undefined, garage.id)}
                    className="py-2 px-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white rounded-xl font-bold flex items-center justify-center gap-1 transition"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MY APPOINTMENTS & BOOKINGS */}
      {subTab === 'bookings' && (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-2">
              <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">No active service appointments booked yet.</p>
              <button
                onClick={() => handleBookService()}
                className="mt-2 text-xs font-bold text-cyan-400 underline"
              >
                Schedule Your Next Service
              </button>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-xs space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                      {booking.serviceName}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      {booking.garageName}
                    </h4>
                    <p className="text-[11px] text-slate-400">{booking.vehicleName}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      booking.status === 'Confirmed'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                        : booking.status === 'In Progress'
                        ? 'bg-amber-950 text-amber-400 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-500">Date</span>
                    <p className="font-semibold text-white">{booking.date}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Time Slot</span>
                    <p className="font-semibold text-white">{booking.timeSlot}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Est. Price: <span className="text-emerald-400 font-mono font-bold">{booking.estimatedCostRange}</span>
                  </span>

                  {booking.status === 'Confirmed' && (
                    <button
                      onClick={() => cancelServiceBooking(booking.id)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Booking Modal */}
      <ServiceBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedGarageId={selectedGarageId}
        preselectedServiceName={selectedServiceName}
      />
    </div>
  );
};
