import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { KeyholeLogo } from './KeyholeLogo';
import { Search, Bell, User, Mic, Menu, X, Shield, PhoneCall } from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { useAccessibility } from '../context/AccessibilityContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const navigate = useNavigate();
  const { activeNotificationsCount } = useBanking();
  const { announce } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Accounts', path: '/accounts' },
    { name: 'Transfer', path: '/transfer' },
    { name: 'Payments', path: '/payments' },
    { name: 'Cards & Loans', path: '/cards-loans' },
    { name: 'Help', path: '/help' },
  ];

  return (
    <>
      {/* Top prototype accessibility banner */}
      <div className="bg-[#EDF5FF] border-b border-[#DCE8FA] px-4 py-1.5 text-xs text-[#082B78] flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-[#1458F5]"></span>
            <span>Student prototype — not an official State Bank of India service.</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <span className="text-[#64748B]">Toll Free 24x7:</span>
            <a href="tel:1800112211" className="font-semibold text-[#1458F5] hover:underline">
              1800 11 2211
            </a>
            <span className="text-slate-300">|</span>
            <Link to="/help" className="hover:text-[#1458F5] font-medium flex items-center gap-1">
              <Mic className="w-3.5 h-3.5 text-[#1458F5]" />
              Voice Mode
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white border-b border-[#DCE8FA] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Brand Lockup */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-hidden focus:ring-2 focus:ring-[#1458F5] rounded-lg p-1"
              aria-label="SBI NETRA Homepage"
              onClick={() => announce('Navigated to Home')}
            >
              <KeyholeLogo size={38} variant="blue" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-[#082B78]">
                    SBI <span className="text-[#1458F5]">NETRA</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-[#EDF5FF] text-[#1458F5] border border-[#DCE8FA]">
                    Accessible
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#64748B] tracking-tight">
                  Banking for a Better Tomorrow
                </span>
              </div>
            </Link>

            {/* Center: Desktop Navigation (Top Bar Contract: 6 clean text links) */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shrink-0 relative ${
                      isActive
                        ? 'text-[#1458F5] bg-[#EDF5FF]'
                        : 'text-[#102451] hover:text-[#1458F5] hover:bg-[#F5F8FF]'
                    }`
                  }
                  onClick={() => announce(`Navigating to ${link.name}`)}
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.name}</span>
                      {isActive && (
                        <span
                          className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1458F5] rounded-full"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2.5 text-[#102451] hover:text-[#1458F5] hover:bg-[#EDF5FF] rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
                aria-label="Search banking services or transactions"
                title="Search (Press /)"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notification Bell */}
              <button
                type="button"
                onClick={onOpenNotifications}
                className="p-2.5 text-[#102451] hover:text-[#1458F5] hover:bg-[#EDF5FF] rounded-lg transition-colors relative focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
                aria-label={`Notifications, ${activeNotificationsCount} unread`}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {activeNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeNotificationsCount}
                  </span>
                )}
              </button>

              {/* User Profile */}
              <button
                type="button"
                onClick={onOpenProfile}
                className="p-2 text-[#102451] hover:text-[#1458F5] hover:bg-[#EDF5FF] rounded-lg transition-colors flex items-center gap-2 focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
                aria-label="Account Profile and Settings"
                title="Profile & KYC"
              >
                <div className="w-8 h-8 rounded-full bg-[#EDF5FF] border border-[#DCE8FA] flex items-center justify-center text-[#1458F5] font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              </button>

              {/* Need Help / Voice CTA */}
              <button
                type="button"
                onClick={() => navigate('/help')}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#1458F5] hover:bg-[#082B78] text-white rounded-lg text-sm font-semibold transition-all shadow-xs hover:shadow-md focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#1458F5]"
              >
                <Mic className="w-4 h-4" />
                <span>Need Help?</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#102451] hover:bg-[#EDF5FF] rounded-lg lg:hidden focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#DCE8FA] bg-white px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive
                      ? 'text-[#1458F5] bg-[#EDF5FF]'
                      : 'text-[#102451] hover:bg-[#F5F8FF]'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            <div className="pt-3 border-t border-[#DCE8FA] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/help');
                }}
                className="w-full py-3 bg-[#1458F5] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>Launch Voice Banking</span>
              </button>
              <div className="text-center text-xs text-[#64748B] py-1">
                Toll Free: 1800 11 2211 (24x7 Accessible Support)
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Navigation Bar for quick accessibility */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#DCE8FA] px-2 py-1 flex items-center justify-around shadow-lg">
        {navLinks.slice(0, 5).map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-2 rounded-md text-[11px] font-semibold transition-colors ${
                isActive ? 'text-[#1458F5]' : 'text-[#64748B]'
              }`
            }
          >
            <span>{link.name}</span>
          </NavLink>
        ))}
        <NavLink
          to="/help"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1.5 px-2 rounded-md text-[11px] font-semibold transition-colors ${
              isActive ? 'text-[#1458F5]' : 'text-[#1458F5]'
            }`
          }
        >
          <div className="w-6 h-6 rounded-full bg-[#1458F5] text-white flex items-center justify-center">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <span>Voice</span>
        </NavLink>
      </div>
    </>
  );
};
