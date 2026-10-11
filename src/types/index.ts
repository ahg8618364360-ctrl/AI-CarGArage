export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
export type TransmissionType = 'Manual' | 'Automatic';

export interface ColorDetails {
  name: string; // e.g. "Daytona Grey Metallic"
  hexCode: string; // e.g. "#4A5568"
  secondaryHex?: string; // for dual-tone roof
  finish: 'Metallic' | 'Pearl' | 'Matte' | 'Gloss' | 'Dual-Tone';
  paletteFamily: string;
}

export interface SoundSignature {
  engineAcousticProfile: string;
  idleRpm: number;
  healthStatus: 'Excellent (Normal)' | 'Mild Tappet Noise' | 'Belt Tension Alert' | 'Exhaust Resonance';
  decibelLevel: number; // e.g. 64 dB
  acousticNote: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  variant: string;
  year: string;
  colour: string;
  colorDetails?: ColorDetails;
  nation: string; // e.g. "India 🇮🇳"
  originCountry: string;
  flagEmoji: string;
  fuelType: FuelType;
  transmission: TransmissionType;
  registrationNumber: string; // e.g. KA 01 AB 1234
  vinChassis?: string;
  currentOdometer: number; // in km
  purchaseDate?: string;
  purchasePrice?: number; // in INR
  originalLaunchPriceINR?: string; // e.g. "₹8.15 Lakh Ex-Showroom"
  originalOnRoadPriceINR?: string; // e.g. "₹9.80 Lakh"
  currentResaleValueINR?: string; // e.g. "₹7.20 Lakh"
  soundSignature?: SoundSignature;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry: string; // ISO date or DD/MM/YYYY
  pucExpiry: string; // ISO date
  nextServiceDate: string; // ISO date
  nextServiceOdometer: number; // km
  imageUrl: string;
  status: 'Active' | 'In Garage' | 'At Service';
  notes?: string;
}

export interface ScannedCarResult {
  brand: string;
  model: string;
  variant: string;
  vehicleType: string;
  colour: string;
  colorDetails?: ColorDetails;
  nation: string;
  originCountry: string;
  flagEmoji: string;
  estimatedYear: string;
  confidence: number;
  fuelOptions: string;
  transmission: string;
  engineCapacity?: string;
  originalLaunchPriceINR?: string;
  originalOnRoadPriceINR?: string;
  currentResaleValueINR?: string;
  estimatedPriceRangeINR?: string;
  soundSignature?: SoundSignature;
  mileageARAI?: string;
  seatingCapacity?: string;
  keyFeatures?: string[];
  commonMaintenanceTips?: string[];
  analysisNotes?: string;
  imagePreviewUrl?: string;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  serviceName: string;
  serviceCentre: string;
  date: string;
  cost: number; // in INR
  odometer: number;
  invoiceNumber?: string;
  notes?: string;
  type: 'General Service' | 'Oil Change' | 'Brake Service' | 'Tyre Service' | 'Battery Check' | 'AC Service' | 'Engine Repair' | 'Car Wash' | 'Dent & Paint';
}

export interface ServiceBooking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  serviceName: string;
  garageId: string;
  garageName: string;
  garageAddress: string;
  date: string;
  timeSlot: string;
  estimatedCostRange: string;
  notes?: string;
  status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface ExpenseRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  category: 'Fuel' | 'Service' | 'Repair' | 'Insurance' | 'Accessories' | 'Tyres' | 'Battery' | 'Car Wash' | 'Other';
  amount: number; // in INR
  date: string;
  description: string;
  odometer?: number;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  fuelType: FuelType;
  quantityLiters: number;
  pricePerLiter: number; // ₹/L
  totalAmount: number; // ₹
  odometer: number;
  date: string;
  mileageCalculated?: number; // km/l
}

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  title: string;
  docType: 'RC' | 'Insurance' | 'PUC' | 'Driving Licence' | 'Service Record' | 'Invoice';
  fileNumber: string;
  issueDate: string;
  expiryDate?: string;
  previewUrl?: string;
  verified: boolean;
}

export interface GarageCenter {
  id: string;
  name: string;
  city: string;
  area: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  services: string[];
  phone: string;
  address: string;
  isPreferred?: boolean;
  isOpenNow: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'service' | 'insurance' | 'puc' | 'fuel' | 'booking' | 'system';
  date: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  city: string;
  profilePic: string;
  preferredCurrency: string;
  language: string;
  darkMode: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}
