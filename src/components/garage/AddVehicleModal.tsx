import React, { useState } from 'react';
import { X, Car, Plus, IndianRupee } from 'lucide-react';
import { useGarage } from '../../context/GarageContext';
import { FuelType, TransmissionType } from '../../types';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingVehicleId?: string | null;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  editingVehicleId,
}) => {
  const { vehicles, addVehicle, updateVehicle } = useGarage();

  const editingVehicle = editingVehicleId
    ? vehicles.find((v) => v.id === editingVehicleId)
    : null;

  const [brand, setBrand] = useState(editingVehicle?.brand || 'Tata');
  const [model, setModel] = useState(editingVehicle?.model || 'Nexon');
  const [variant, setVariant] = useState(editingVehicle?.variant || 'Creative+');
  const [registrationNumber, setRegistrationNumber] = useState(
    editingVehicle?.registrationNumber || 'KA 01 AB 1234'
  );
  const [year, setYear] = useState(editingVehicle?.year || '2024');
  const [colour, setColour] = useState(editingVehicle?.colour || 'Blue');
  const [colorFinish, setColorFinish] = useState<'Metallic' | 'Pearl' | 'Matte' | 'Gloss' | 'Dual-Tone'>(
    editingVehicle?.colorDetails?.finish || 'Metallic'
  );
  const [colorHex, setColorHex] = useState(
    editingVehicle?.colorDetails?.hexCode || '#2563EB'
  );
  const [secondaryColorHex, setSecondaryColorHex] = useState(
    editingVehicle?.colorDetails?.secondaryHex || '#0F172A'
  );
  const [fuelType, setFuelType] = useState<FuelType>(editingVehicle?.fuelType || 'Petrol');
  const [transmission, setTransmission] = useState<TransmissionType>(
    editingVehicle?.transmission || 'Manual'
  );
  const [nation, setNation] = useState(editingVehicle?.nation || 'India 🇮🇳');
  const [originalLaunchPriceINR, setOriginalLaunchPriceINR] = useState(
    editingVehicle?.originalLaunchPriceINR || '₹8.15 Lakh (Ex-Showroom)'
  );
  const [currentResaleValueINR, setCurrentResaleValueINR] = useState(
    editingVehicle?.currentResaleValueINR || '₹11.80 Lakh'
  );
  const [currentOdometer, setCurrentOdometer] = useState(
    editingVehicle?.currentOdometer || 15000
  );
  const [insuranceExpiry, setInsuranceExpiry] = useState(
    editingVehicle?.insuranceExpiry || '2027-10-15'
  );
  const [pucExpiry, setPucExpiry] = useState(editingVehicle?.pucExpiry || '2027-04-15');
  const [nextServiceDate, setNextServiceDate] = useState(
    editingVehicle?.nextServiceDate || '2027-02-15'
  );
  const [purchasePrice, setPurchasePrice] = useState(
    editingVehicle?.purchasePrice || 1250000
  );
  const [imageUrl, setImageUrl] = useState(
    editingVehicle?.imageUrl ||
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingVehicleId) {
      updateVehicle(editingVehicleId, {
        brand,
        model,
        variant,
        registrationNumber: registrationNumber.toUpperCase(),
        year,
        colour,
        colorDetails: {
          name: colour,
          hexCode: colorHex,
          secondaryHex: colorFinish === 'Dual-Tone' ? secondaryColorHex : undefined,
          finish: colorFinish,
          paletteFamily: 'Custom',
        },
        nation,
        originCountry: nation.split(' ')[0] || 'India',
        flagEmoji: nation.match(/\p{Extended_Pictographic}/u)?.[0] || '🇮🇳',
        originalLaunchPriceINR,
        currentResaleValueINR,
        fuelType,
        transmission,
        currentOdometer: Number(currentOdometer),
        insuranceExpiry,
        pucExpiry,
        nextServiceDate,
        purchasePrice: Number(purchasePrice),
        imageUrl,
      });
    } else {
      addVehicle({
        brand,
        model,
        variant,
        registrationNumber: registrationNumber.toUpperCase(),
        year,
        colour,
        colorDetails: {
          name: colour,
          hexCode: colorHex,
          secondaryHex: colorFinish === 'Dual-Tone' ? secondaryColorHex : undefined,
          finish: colorFinish,
          paletteFamily: 'Custom',
        },
        nation,
        originCountry: nation.split(' ')[0] || 'India',
        flagEmoji: nation.match(/\p{Extended_Pictographic}/u)?.[0] || '🇮🇳',
        originalLaunchPriceINR,
        currentResaleValueINR,
        fuelType,
        transmission,
        currentOdometer: Number(currentOdometer),
        insuranceExpiry,
        pucExpiry,
        nextServiceDate,
        nextServiceOdometer: Number(currentOdometer) + 10000,
        purchasePrice: Number(purchasePrice),
        imageUrl,
        status: 'Active',
      });
    }

    onClose();
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

        <div className="flex items-center gap-2 mb-4">
          <Car className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">
            {editingVehicleId ? 'Edit Vehicle Information' : 'Add Vehicle to Garage'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400">Brand / Make</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Tata, Mahindra"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400">Model</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Nexon, XUV700"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400">Variant</label>
              <input
                type="text"
                required
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder="e.g. Fearless+ S"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400">Indian Reg. Number</label>
              <input
                type="text"
                required
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="KA 01 AB 1234"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-300 font-mono font-bold uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-slate-400">Year</label>
              <input
                type="text"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400">Fuel</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
          </div>

          {/* Nation / Origin */}
          <div>
            <label className="text-slate-400">Nation / Country of Origin</label>
            <select
              value={nation}
              onChange={(e) => setNation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            >
              <option value="India 🇮🇳">India 🇮🇳 (Homegrown Pride)</option>
              <option value="Japan 🇯🇵">Japan 🇯🇵 (Japanese Reliability)</option>
              <option value="South Korea 🇰🇷">South Korea 🇰🇷 (Korean Technology)</option>
              <option value="Germany 🇩🇪">Germany 🇩🇪 (German Precision)</option>
              <option value="United States 🇺🇸">United States 🇺🇸 (American Muscle)</option>
              <option value="United Kingdom 🇬🇧">United Kingdom 🇬🇧 (British Heritage)</option>
              <option value="Sweden 🇸🇪">Sweden 🇸🇪 (Scandinavian Safety)</option>
              <option value="Czech Republic 🇨🇿">Czech Republic 🇨🇿 (European Dynamics)</option>
              <option value="France 🇫🇷">France 🇫🇷 (French Comfort)</option>
              <option value="Italy 🇮🇹">Italy 🇮🇹 (Italian Passion)</option>
            </select>
          </div>

          {/* Color Details & Paint Finish ("Color Everything") */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold uppercase text-[10px]">OEM Paint & Color Swatch</span>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-4 h-4 rounded-full border border-slate-700 shadow-sm"
                  style={{ backgroundColor: colorHex }}
                  title="Body Color"
                />
                {colorFinish === 'Dual-Tone' && (
                  <span
                    className="w-4 h-4 rounded-full border border-slate-700 shadow-sm"
                    style={{ backgroundColor: secondaryColorHex }}
                    title="Roof Color"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-500 text-[10px]">Paint Shade Name</label>
                <input
                  type="text"
                  required
                  value={colour}
                  onChange={(e) => setColour(e.target.value)}
                  placeholder="Daytona Grey"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-slate-500 text-[10px]">Finish Type</label>
                <select
                  value={colorFinish}
                  onChange={(e) => setColorFinish(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white text-xs"
                >
                  <option value="Metallic">Metallic</option>
                  <option value="Pearl">Pearl</option>
                  <option value="Gloss">Gloss</option>
                  <option value="Matte">Matte</option>
                  <option value="Dual-Tone">Dual-Tone</option>
                </select>
              </div>
              <div>
                <label className="text-slate-500 text-[10px]">Body Hex</label>
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-full h-8 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer p-0.5"
                />
              </div>
            </div>

            {colorFinish === 'Dual-Tone' && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">Contrast Roof Color</span>
                <input
                  type="color"
                  value={secondaryColorHex}
                  onChange={(e) => setSecondaryColorHex(e.target.value)}
                  className="w-20 h-7 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer p-0.5"
                />
              </div>
            )}
          </div>

          {/* Pricing Intelligence: Original Price & Resale */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400">Launch Price (Ex-Showroom)</label>
              <input
                type="text"
                value={originalLaunchPriceINR}
                onChange={(e) => setOriginalLaunchPriceINR(e.target.value)}
                placeholder="₹8.15 Lakh (Ex-Showroom)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400">Est. Current Resale</label>
              <input
                type="text"
                value={currentResaleValueINR}
                onChange={(e) => setCurrentResaleValueINR(e.target.value)}
                placeholder="₹11.80 Lakh"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400">Insurance Expiry</label>
              <input
                type="date"
                required
                value={insuranceExpiry}
                onChange={(e) => setInsuranceExpiry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400">PUC Expiry</label>
              <input
                type="date"
                required
                value={pucExpiry}
                onChange={(e) => setPucExpiry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400">Purchase Price (₹ INR)</label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              placeholder="1250000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-2xl text-xs shadow-lg shadow-cyan-600/30 transition"
          >
            {editingVehicleId ? 'Save Changes' : 'Add Vehicle to Garage'}
          </button>
        </form>
      </div>
    </div>
  );
};
