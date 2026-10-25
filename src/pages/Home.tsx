import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyholeLogo } from '../components/KeyholeLogo';
import { QuickActionCard } from '../components/QuickActionCard';
import { AccountCard } from '../components/AccountCard';
import { TransactionTable } from '../components/TransactionTable';
import { AccountDetailsModal } from '../components/modals/AccountDetailsModal';
import { BankAccount } from '../types';
import { useBanking } from '../context/BankingContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { Mic, ArrowRight, ShieldCheck, ChevronRight, Eye, Volume2, Sparkles } from 'lucide-react';

interface HomeProps {
  onOpenSearch: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenSearch }) => {
  const navigate = useNavigate();
  const { accounts, isBalanceVisible, toggleBalanceVisibility, formatCurrency } = useBanking();
  const { announce } = useAccessibility();
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);

  return (
    <div className="space-y-12">
      {/* Hero Section (Wide Two-Column as in reference) */}
      <section className="bg-gradient-to-b from-[#EDF5FF] to-[#F5F8FF] border-b border-[#DCE8FA] -mt-6 sm:-mt-8 py-10 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DCE8FA] text-[#1458F5] text-xs font-bold tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#1458F5] animate-pulse"></span>
              ACCESSIBLE DIGITAL BANKING
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#082B78] tracking-tight leading-[1.15]">
              Banking made <br className="hidden sm:inline" />
              <span className="text-[#1458F5]">simple for everyone</span>
            </h1>

            <p className="text-sm sm:text-base text-[#64748B] max-w-xl leading-relaxed">
              Safe. Secure. Accessible. Experience a smarter way to bank with{' '}
              <strong className="text-[#102451] font-semibold">SBI NETRA</strong> — designed for your convenience, today and always.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  announce('Navigating to accounts overview');
                  navigate('/accounts');
                }}
                className="px-6 py-3.5 bg-[#1458F5] hover:bg-[#082B78] text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  announce('Opening Voice Banking Assistant');
                  navigate('/help');
                }}
                className="px-6 py-3.5 bg-white hover:bg-[#EDF5FF] text-[#1458F5] border border-[#DCE8FA] rounded-xl text-sm font-bold transition-all shadow-xs flex items-center gap-2 focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
              >
                <Mic className="w-4 h-4 text-[#1458F5]" />
                <span>Try Voice Banking</span>
              </button>
            </div>

            {/* Accessibility trust markers */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-[#64748B] border-t border-[#DCE8FA]/60">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Protected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#1458F5]" />
                <span>5 Indian Regional Languages</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#082B78]" />
                <span>Screen-Reader Tested</span>
              </div>
            </div>
          </div>

          {/* Right Column: Blue Abstract Banking Artwork */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-[#082B78] via-[#1458F5] to-[#3679FF] p-8 text-white shadow-2xl flex flex-col justify-between overflow-hidden border border-white/20 group">
              {/* Concentric layered translucent rings */}
              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border-8 border-white/10 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute -right-28 -top-28 w-96 h-96 rounded-full border border-white/10" />
              <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-blue-400/20 blur-xl" />

              {/* Top Row: Keyhole symbol badge */}
              <div className="flex justify-between items-start relative z-10">
                <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-inner">
                  <KeyholeLogo size={46} variant="white" />
                </div>
                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-widest text-blue-200 block font-bold">
                    DIGITAL INDIA
                  </span>
                  <span className="text-xs font-semibold text-white/90">
                    Accessible Suite
                  </span>
                </div>
              </div>

              {/* Center graphic: Total Balance preview on card */}
              <div className="relative z-10 my-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                <div className="flex items-center justify-between text-xs text-blue-100 mb-1">
                  <span>Total Liquid Balance</span>
                  <button
                    type="button"
                    onClick={toggleBalanceVisibility}
                    className="hover:text-white underline text-[11px]"
                  >
                    {isBalanceVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="text-3xl font-extrabold tracking-tight tabular-nums font-mono text-white">
                  {formatCurrency(totalBalance)}
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-blue-200 pt-2 border-t border-white/15">
                  <span>3 Accounts Active</span>
                  <span className="font-semibold text-emerald-300">● Safe & KYC Verified</span>
                </div>
              </div>

              {/* Bottom text */}
              <div className="relative z-10 pt-2 border-t border-white/20 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Inclusive Banking</h4>
                  <p className="text-xs text-blue-100">For a Brighter Tomorrow</p>
                </div>
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Quick Actions (6 Cards) */}
        <section aria-labelledby="quick-actions-heading">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="quick-actions-heading" className="text-lg font-extrabold text-[#082B78]">
                Quick Actions
              </h2>
              <p className="text-xs text-[#64748B]">Frequently used services for speedy operations</p>
            </div>
            <button
              onClick={() => navigate('/payments')}
              className="text-xs font-bold text-[#1458F5] hover:underline flex items-center gap-1"
            >
              <span>All Services</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <QuickActionCard
              id="qa-1"
              title="Check Balance"
              subtitle="View all accounts"
              iconName="Eye"
              path="/accounts"
            />
            <QuickActionCard
              id="qa-2"
              title="Transfer Money"
              subtitle="UPI, IMPS, NEFT"
              iconName="Send"
              path="/transfer"
            />
            <QuickActionCard
              id="qa-3"
              title="Pay Bills"
              subtitle="Electricity, Gas"
              iconName="Zap"
              path="/payments"
            />
            <QuickActionCard
              id="qa-4"
              title="Recharge"
              subtitle="Prepaid & DTH"
              iconName="Smartphone"
              path="/payments"
            />
            <QuickActionCard
              id="qa-5"
              title="Card Services"
              subtitle="Manage limits & PIN"
              iconName="CreditCard"
              path="/cards-loans"
            />
            <QuickActionCard
              id="qa-6"
              title="More Services"
              subtitle="Search & Support"
              iconName="Layers"
              path="/"
              onClick={onOpenSearch}
            />
          </div>
        </section>

        {/* Your Accounts Section */}
        <section aria-labelledby="your-accounts-heading">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="your-accounts-heading" className="text-lg font-extrabold text-[#082B78]">
                Your Accounts
              </h2>
              <p className="text-xs text-[#64748B]">Manage deposits, active balances and statements</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/accounts')}
              className="text-xs font-bold text-[#1458F5] hover:underline flex items-center gap-1"
            >
              <span>View Accounts Page</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {accounts.map((acc) => (
              <AccountCard
                key={acc.id}
                account={acc}
                onViewDetails={(a) => setSelectedAccount(a)}
              />
            ))}
          </div>
        </section>

        {/* Voice Banking Banner */}
        <section aria-labelledby="voice-banner-heading">
          <div className="bg-gradient-to-r from-[#EDF5FF] via-[#E2EFFF] to-[#EDF5FF] border border-[#DCE8FA] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs relative overflow-hidden">
            {/* Subtle waveform graphic in background */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none hidden lg:block">
              <svg width="240" height="80" viewBox="0 0 240 80" fill="none">
                <path
                  d="M10 40 Q 25 10, 40 40 T 70 40 T 100 40 T 130 10 T 160 70 T 190 20 T 220 40"
                  stroke="#1458F5"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
            </div>

            <div className="flex items-start sm:items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#1458F5] text-white flex items-center justify-center shrink-0 shadow-md">
                <Mic className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 id="voice-banner-heading" className="text-xl font-extrabold text-[#082B78]">
                    Need help? Try Voice Banking
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#1458F5] text-white text-[10px] font-bold">
                    Signature NETRA
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Ask questions, check balance, transfer money — just speak! Supported in English, Hindi, Bengali, Tamil & Telugu.
                </p>
              </div>
            </div>

            <div className="relative z-10 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  announce('Opening Voice Banking Experience');
                  navigate('/help');
                }}
                className="w-full md:w-auto px-6 py-3 bg-[#1458F5] hover:bg-[#082B78] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>Try Voice Banking Now</span>
              </button>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section aria-labelledby="recent-activity-heading">
          <TransactionTable limit={5} showFilters={false} title="Recent Activity" />
          <div className="text-center mt-3">
            <button
              onClick={() => navigate('/accounts')}
              className="text-xs font-bold text-[#1458F5] hover:underline"
            >
              View Full Statement & Transaction History →
            </button>
          </div>
        </section>
      </div>

      {/* Account Details Modal */}
      <AccountDetailsModal
        account={selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />
    </div>
  );
};
