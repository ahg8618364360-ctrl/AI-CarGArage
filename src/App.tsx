/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GarageProvider, useGarage } from './context/GarageContext';
import { SplashScreen } from './components/splash/SplashScreen';
import { MobileAppShell } from './components/layout/MobileAppShell';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNavigation } from './components/layout/BottomNavigation';

// Tabs
import { DashboardTab } from './components/dashboard/DashboardTab';
import { CarScannerTab } from './components/scanner/CarScannerTab';
import { GarageTab } from './components/garage/GarageTab';
import { ServicesTab } from './components/services/ServicesTab';
import { ProfileTab } from './components/profile/ProfileTab';

// Modals
import { AuthModal } from './components/auth/AuthModal';
import { ExpenseTrackerModal } from './components/expenses/ExpenseTrackerModal';
import { FuelTrackerModal } from './components/fuel/FuelTrackerModal';
import { DocumentsVaultModal } from './components/documents/DocumentsVaultModal';
import { ServiceBookingModal } from './components/services/ServiceBookingModal';
import { AutoAIAssistantModal } from './components/assistant/AutoAIAssistantModal';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { NotificationCenterModal } from './components/notifications/NotificationCenterModal';
import { AndroidArchitectureModal } from './components/android/AndroidArchitectureModal';
import { AddVehicleModal } from './components/garage/AddVehicleModal';

function MainAppContent() {
  const {
    activeTab,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAssistantOpen,
    setIsAssistantOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    isSearchOpen,
    setIsSearchOpen,
    isAndroidArchitectureOpen,
    setIsAndroidArchitectureOpen,
  } = useGarage();

  // Local state for specific modals
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isFuelLogOpen, setIsFuelLogOpen] = useState(false);
  const [isServiceBookingOpen, setIsServiceBookingOpen] = useState(false);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);

  return (
    <MobileAppShell>
      {/* Top App Header */}
      <TopHeader />

      {/* Main Tab Viewport */}
      <div className="flex-1">
        {activeTab === 'home' && (
          <DashboardTab
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onOpenAddVehicle={() => setIsAddVehicleOpen(true)}
            onOpenFuelLog={() => setIsFuelLogOpen(true)}
            onOpenServiceBooking={() => setIsServiceBookingOpen(true)}
          />
        )}

        {activeTab === 'garage' && (
          <GarageTab
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onOpenAddService={() => setIsServiceBookingOpen(true)}
            onOpenAddDocument={() => setIsAddDocumentOpen(true)}
            onOpenAddFuel={() => setIsFuelLogOpen(true)}
          />
        )}

        {activeTab === 'scan' && <CarScannerTab />}

        {activeTab === 'services' && <ServicesTab />}

        {activeTab === 'profile' && <ProfileTab />}
      </div>

      {/* Modern Bottom Navigation with Elevated AI Scan Button */}
      <BottomNavigation />

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ExpenseTrackerModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />

      <FuelTrackerModal
        isOpen={isFuelLogOpen}
        onClose={() => setIsFuelLogOpen(false)}
      />

      <DocumentsVaultModal
        isOpen={isAddDocumentOpen}
        onClose={() => setIsAddDocumentOpen(false)}
      />

      <ServiceBookingModal
        isOpen={isServiceBookingOpen}
        onClose={() => setIsServiceBookingOpen(false)}
      />

      <AutoAIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <AndroidArchitectureModal
        isOpen={isAndroidArchitectureOpen}
        onClose={() => setIsAndroidArchitectureOpen(false)}
      />

      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
      />
    </MobileAppShell>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <GarageProvider>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <MainAppContent />
      )}
    </GarageProvider>
  );
}
