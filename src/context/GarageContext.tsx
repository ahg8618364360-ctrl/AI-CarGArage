import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Vehicle,
  GarageCenter,
  ServiceRecord,
  ServiceBooking,
  ExpenseRecord,
  FuelLog,
  VehicleDocument,
  AppNotification,
  UserProfile,
  ScannedCarResult,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_VEHICLES,
  INITIAL_GARAGES,
  INITIAL_SERVICES,
  INITIAL_EXPENSES,
  INITIAL_FUEL_LOGS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface GarageContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  vehicles: Vehicle[];
  activeVehicleId: string;
  activeVehicle: Vehicle | undefined;
  setActiveVehicleId: (id: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  garages: GarageCenter[];
  togglePreferredGarage: (id: string) => void;
  services: ServiceRecord[];
  addServiceRecord: (record: Omit<ServiceRecord, 'id'>) => void;
  bookings: ServiceBooking[];
  addServiceBooking: (booking: Omit<ServiceBooking, 'id' | 'createdAt'>) => void;
  cancelServiceBooking: (id: string) => void;
  expenses: ExpenseRecord[];
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  fuelLogs: FuelLog[];
  addFuelLog: (log: Omit<FuelLog, 'id'>) => void;
  documents: VehicleDocument[];
  addDocument: (doc: Omit<VehicleDocument, 'id'>) => void;
  deleteDocument: (id: string) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  activeTab: 'home' | 'garage' | 'scan' | 'services' | 'profile';
  setActiveTab: (tab: 'home' | 'garage' | 'scan' | 'services' | 'profile') => void;
  selectedVehicleDetailId: string | null;
  setSelectedVehicleDetailId: (id: string | null) => void;
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean | ((prev: boolean) => boolean)) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (val: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (val: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
  isAndroidArchitectureOpen: boolean;
  setIsAndroidArchitectureOpen: (val: boolean) => void;
  scannedResult: ScannedCarResult | null;
  setScannedResult: (result: ScannedCarResult | null) => void;
  saveScannedCarToGarage: (result: ScannedCarResult, customData?: Partial<Vehicle>) => Vehicle;
  resetToDemoData: () => void;
}

const GarageContext = createContext<GarageContextType | undefined>(undefined);

export const GarageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or mock
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('autogarage_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('autogarage_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [activeVehicleId, setActiveVehicleId] = useState<string>(() => {
    const saved = localStorage.getItem('autogarage_active_id');
    return saved || 'veh-nexon-01';
  });

  const [garages, setGarages] = useState<GarageCenter[]>(() => {
    const saved = localStorage.getItem('autogarage_garages');
    return saved ? JSON.parse(saved) : INITIAL_GARAGES;
  });

  const [services, setServices] = useState<ServiceRecord[]>(() => {
    const saved = localStorage.getItem('autogarage_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [bookings, setBookings] = useState<ServiceBooking[]>(() => {
    const saved = localStorage.getItem('autogarage_bookings');
    return saved ? JSON.parse(saved) : [
      {
        id: 'book-01',
        vehicleId: 'veh-nexon-01',
        vehicleName: 'Tata Nexon (KA 01 AB 1234)',
        serviceName: 'General Service',
        garageId: 'gar-01',
        garageName: 'AutoCare Master Garage',
        garageAddress: 'Indiranagar, Bengaluru',
        date: '2026-10-20',
        timeSlot: '10:00 AM – 11:30 AM',
        estimatedCostRange: '₹1,500 – ₹3,500',
        notes: 'Pre-monsoon brake check and engine oil flush.',
        status: 'Confirmed',
        createdAt: '2026-10-06T10:00:00Z',
      }
    ];
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('autogarage_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
    const saved = localStorage.getItem('autogarage_fuel');
    return saved ? JSON.parse(saved) : INITIAL_FUEL_LOGS;
  });

  const [documents, setDocuments] = useState<VehicleDocument[]>(() => {
    const saved = localStorage.getItem('autogarage_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('autogarage_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Navigation and UI state
  const [activeTab, setActiveTab] = useState<'home' | 'garage' | 'scan' | 'services' | 'profile'>('home');
  const [selectedVehicleDetailId, setSelectedVehicleDetailId] = useState<string | null>(null);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAndroidArchitectureOpen, setIsAndroidArchitectureOpen] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<ScannedCarResult | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('autogarage_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('autogarage_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('autogarage_active_id', activeVehicleId);
  }, [activeVehicleId]);

  useEffect(() => {
    localStorage.setItem('autogarage_garages', JSON.stringify(garages));
  }, [garages]);

  useEffect(() => {
    localStorage.setItem('autogarage_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('autogarage_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('autogarage_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('autogarage_fuel', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('autogarage_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('autogarage_notifs', JSON.stringify(notifications));
  }, [notifications]);

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addVehicle = (data: Omit<Vehicle, 'id'>): Vehicle => {
    const newVehicle: Vehicle = {
      ...data,
      id: `veh-${Date.now()}`,
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    setActiveVehicleId(newVehicle.id);
    return newVehicle;
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => {
      const remaining = prev.filter((v) => v.id !== id);
      if (activeVehicleId === id && remaining.length > 0) {
        setActiveVehicleId(remaining[0].id);
      }
      return remaining;
    });
  };

  const togglePreferredGarage = (id: string) => {
    setGarages((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isPreferred: !g.isPreferred } : g))
    );
  };

  const addServiceRecord = (record: Omit<ServiceRecord, 'id'>) => {
    const newRecord: ServiceRecord = { ...record, id: `serv-${Date.now()}` };
    setServices((prev) => [newRecord, ...prev]);
    // Also record in expenses
    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      vehicleId: record.vehicleId,
      vehicleName: activeVehicle ? `${activeVehicle.brand} ${activeVehicle.model} (${activeVehicle.registrationNumber})` : 'Vehicle',
      category: 'Service',
      amount: record.cost,
      date: record.date,
      description: `${record.serviceName} at ${record.serviceCentre}`,
      odometer: record.odometer,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const addServiceBooking = (bookingData: Omit<ServiceBooking, 'id' | 'createdAt'>) => {
    const newBooking: ServiceBooking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: '✅ Service Appointment Confirmed',
      message: `Your booking for ${bookingData.serviceName} at ${bookingData.garageName} on ${bookingData.date} is confirmed.`,
      type: 'booking',
      date: 'Just now',
      read: false,
      priority: 'medium',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const cancelServiceBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );
  };

  const addExpense = (data: Omit<ExpenseRecord, 'id'>) => {
    const newExp: ExpenseRecord = { ...data, id: `exp-${Date.now()}` };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const addFuelLog = (data: Omit<FuelLog, 'id'>) => {
    const newLog: FuelLog = { ...data, id: `fuel-${Date.now()}` };
    setFuelLogs((prev) => [newLog, ...prev]);

    // Also auto-add to expenses
    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      vehicleId: data.vehicleId,
      vehicleName: activeVehicle ? `${activeVehicle.brand} ${activeVehicle.model} (${activeVehicle.registrationNumber})` : 'Vehicle',
      category: 'Fuel',
      amount: data.totalAmount,
      date: data.date,
      description: `${data.fuelType} refill: ${data.quantityLiters}L @ ₹${data.pricePerLiter}/L`,
      odometer: data.odometer,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const addDocument = (doc: Omit<VehicleDocument, 'id'>) => {
    const newDoc: VehicleDocument = { ...doc, id: `doc-${Date.now()}` };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Convert scanned result to garage vehicle
  const saveScannedCarToGarage = (
    result: ScannedCarResult,
    customData?: Partial<Vehicle>
  ): Vehicle => {
    // Generate Indian registration format if not supplied
    const randomRTO = ['KA 01', 'MH 12', 'DL 08', 'TN 09', 'TS 07', 'HR 26'][Math.floor(Math.random() * 6)];
    const randomLetters = 'AB CD EF GH JK LM NP RS TU VW XY Z'[Math.floor(Math.random() * 10)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const regNumber = customData?.registrationNumber || `${randomRTO} ${randomLetters} ${randomNum}`;

    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      brand: result.brand,
      model: result.model,
      variant: result.variant || 'Standard Trim',
      year: result.estimatedYear || '2024',
      colour: result.colour || 'Silver',
      colorDetails: result.colorDetails || {
        name: result.colour || 'Silver',
        hexCode: '#94A3B8',
        finish: 'Metallic',
        paletteFamily: 'Silver',
      },
      nation: result.nation || 'India 🇮🇳',
      originCountry: result.originCountry || 'India',
      flagEmoji: result.flagEmoji || '🇮🇳',
      originalLaunchPriceINR: result.originalLaunchPriceINR || '₹8.15 Lakh (Ex-Showroom)',
      originalOnRoadPriceINR: result.originalOnRoadPriceINR || '₹14.20 Lakh (On-Road)',
      currentResaleValueINR: result.currentResaleValueINR || '₹11.80 Lakh',
      soundSignature: result.soundSignature || {
        engineAcousticProfile: '1.2L Engine Balanced Harmonic Idle & Rhythm',
        idleRpm: 840,
        healthStatus: 'Excellent (Normal)',
        decibelLevel: 62,
        acousticNote: 'Harmonious engine firing pulses with clean valve seat clearance.',
      },
      fuelType: (result.fuelOptions?.includes('Diesel') ? 'Diesel' : 'Petrol') as any,
      transmission: (result.transmission?.includes('Auto') ? 'Automatic' : 'Manual') as any,
      registrationNumber: regNumber,
      vinChassis: `IND${Date.now().toString().slice(-8)}`,
      currentOdometer: 12000,
      insuranceProvider: 'Digit / ICICI Lombard Insurance',
      insuranceExpiry: '2027-09-30',
      pucExpiry: '2027-03-31',
      nextServiceDate: '2027-04-15',
      nextServiceOdometer: 20000,
      imageUrl: result.imagePreviewUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
      status: 'Active',
      notes: `Identified via AI Scanner with ${result.confidence}% confidence score. ${result.analysisNotes || ''}`,
      ...customData,
    };

    setVehicles((prev) => [newVehicle, ...prev]);
    setActiveVehicleId(newVehicle.id);

    // Add celebration notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: '🎉 Vehicle Added to Garage',
      message: `${newVehicle.brand} ${newVehicle.model} (${newVehicle.registrationNumber}) has been added to your AutoVision Garage!`,
      type: 'system',
      date: 'Just now',
      read: false,
      priority: 'medium',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newVehicle;
  };

  const resetToDemoData = () => {
    setUser(INITIAL_USER);
    setVehicles(INITIAL_VEHICLES);
    setActiveVehicleId('veh-nexon-01');
    setGarages(INITIAL_GARAGES);
    setServices(INITIAL_SERVICES);
    setExpenses(INITIAL_EXPENSES);
    setFuelLogs(INITIAL_FUEL_LOGS);
    setDocuments(INITIAL_DOCUMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
  };

  return (
    <GarageContext.Provider
      value={{
        user,
        updateUser,
        vehicles,
        activeVehicleId,
        activeVehicle,
        setActiveVehicleId,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        garages,
        togglePreferredGarage,
        services,
        addServiceRecord,
        bookings,
        addServiceBooking,
        cancelServiceBooking,
        expenses,
        addExpense,
        fuelLogs,
        addFuelLog,
        documents,
        addDocument,
        deleteDocument,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        activeTab,
        setActiveTab,
        selectedVehicleDetailId,
        setSelectedVehicleDetailId,
        isPhoneFrame,
        setIsPhoneFrame,
        isAssistantOpen,
        setIsAssistantOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAndroidArchitectureOpen,
        setIsAndroidArchitectureOpen,
        scannedResult,
        setScannedResult,
        saveScannedCarToGarage,
        resetToDemoData,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
};

export const useGarage = () => {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error('useGarage must be used within a GarageProvider');
  }
  return context;
};
