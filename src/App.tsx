import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { BankingProvider } from './context/BankingContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Accounts } from './pages/Accounts';
import { Transfer } from './pages/Transfer';
import { Payments } from './pages/Payments';
import { CardsLoans } from './pages/CardsLoans';
import { Help } from './pages/Help';
import { SearchModal } from './components/modals/SearchModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { ProfileModal } from './components/modals/ProfileModal';
import { KeyboardShortcutsModal } from './components/modals/KeyboardShortcutsModal';

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { setIsKeyboardGuideOpen } = useAccessibility();

  // Global hotkeys: '/' for search, '?' for shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        setIsKeyboardGuideOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsKeyboardGuideOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF] text-[#102451]">
      <ScrollToTop />

      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1458F5] focus:text-white focus:rounded-lg focus:shadow-xl focus:font-bold focus:outline-hidden"
      >
        Skip directly to main content
      </a>

      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 focus:outline-hidden">
        <Routes>
          <Route path="/" element={<Home onOpenSearch={() => setIsSearchOpen(true)} />} />
          <Route path="/accounts" element={<Accounts onOpenProfile={() => setIsProfileOpen(true)} />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/cards-loans" element={<CardsLoans />} />
          <Route path="/help" element={<Help />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Home onOpenSearch={() => setIsSearchOpen(true)} />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <KeyboardShortcutsModal />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <BankingProvider>
          <AppContent />
        </BankingProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  );
}
