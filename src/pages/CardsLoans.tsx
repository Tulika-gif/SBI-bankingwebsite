import React, { useState } from 'react';
import { CREDIT_CARDS, LOAN_PRODUCTS } from '../data/mockData';
import { CreditCardProduct, LoanProduct } from '../types';
import { CardDetailsModal } from '../components/modals/CardDetailsModal';
import { LoanEnquiryModal } from '../components/modals/LoanEnquiryModal';
import { EmiCalculator } from '../components/EmiCalculator';
import { CreditCard, Shield, Lock, ArrowRight, Check, Sparkles, UserCheck, Home, Car, Landmark } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const CardsLoans: React.FC = () => {
  const { announce } = useAccessibility();
  const [selectedCreditCard, setSelectedCreditCard] = useState<CreditCardProduct | null>(null);
  const [isDebitModalOpen, setIsDebitModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanProduct | null>(null);

  const getLoanIcon = (category: string) => {
    switch (category) {
      case 'HOME':
        return <Home className="w-5 h-5 text-[#1458F5]" />;
      case 'CAR':
        return <Car className="w-5 h-5 text-emerald-600" />;
      case 'PERSONAL':
      default:
        return <Landmark className="w-5 h-5 text-[#082B78]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B78] tracking-tight">
          Cards & Loans
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1">
          More ways to pay. More dreams to achieve.
        </p>
      </div>

      {/* Debit Card Hero Section */}
      <section aria-labelledby="debit-hero-heading">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#082B78] via-[#1458F5] to-[#3679FF] p-6 sm:p-10 text-white shadow-xl overflow-hidden">
          {/* Ambient circles */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Copy */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] uppercase tracking-widest font-bold text-blue-200">
                SBI GLOBAL DEBIT CARD
              </span>
              <h2 id="debit-hero-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Safe. Simple. Smart.
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-lg leading-relaxed">
                Empowered with contactless EMV chip security, daily purchase protection up to ₹1,00,000, and zero liability against unauthorized transactions.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDebitModalOpen(true)}
                  className="px-5 py-3 bg-white text-[#082B78] hover:bg-[#EDF5FF] text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4 text-[#1458F5]" />
                  <span>Manage Card & Limits</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDebitModalOpen(true)}
                  className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl border border-white/25 transition-all"
                >
                  Change Green PIN
                </button>
              </div>
            </div>

            {/* Fictional Realistic Debit Card Graphic */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm aspect-[1.586/1] rounded-2xl bg-gradient-to-tr from-[#0F172A] via-[#1E40AF] to-[#2563EB] p-5 text-white shadow-2xl flex flex-col justify-between border border-white/20 relative group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase font-bold text-blue-200">
                      STATE BANK OF INDIA
                    </span>
                    <div className="text-xs font-extrabold tracking-wide text-white">
                      GLOBAL CONTACTLESS
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center border border-white/30 text-[9px] font-bold">
                    NFC
                  </div>
                </div>

                {/* EMV Chip */}
                <div>
                  <div className="w-9 h-7 rounded bg-amber-300/80 border border-amber-400 mb-2 flex items-center justify-center">
                    <div className="w-4 h-3 border border-amber-900/30 rounded-xs"></div>
                  </div>
                  <div className="font-mono text-base sm:text-lg tracking-widest font-bold text-white/95">
                    4532 •••• •••• 4892
                  </div>
                </div>

                <div className="flex justify-between items-end text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-blue-200 block">CARDHOLDER</span>
                    <span className="font-bold tracking-wide">SUNITA SHARMA</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-blue-200 block">EXPIRES</span>
                    <span className="font-mono font-bold">09/29</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Cards Section */}
      <section aria-labelledby="credit-cards-heading" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="credit-cards-heading" className="text-xl font-extrabold text-[#082B78]">
              SBI Credit Cards Collection
            </h2>
            <p className="text-xs text-[#64748B]">Tailored for shopping rewards, dining perks, and lifestyle luxury</p>
          </div>
          <span className="text-[11px] text-[#64748B] hidden sm:inline">
            Illustrative benefits for demonstration
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDIT_CARDS.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-[#DCE8FA] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Mini card visual */}
                <div
                  className="w-full h-36 rounded-xl p-4 text-white flex flex-col justify-between mb-4 shadow-sm"
                  style={{ background: card.gradient }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] uppercase tracking-wider font-bold opacity-80">SBI CARD</span>
                    {card.isPopular && (
                      <span className="text-[9px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-full border border-white/30">
                        Top Choice
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-sm tracking-wide">{card.name}</div>
                  <div className="flex justify-between items-end text-[10px]">
                    <span className="font-mono">•••• 9920</span>
                    <span className="font-bold opacity-90">{card.rewardsMultiplier}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#102451]">{card.name}</h3>
                <p className="text-xs text-[#64748B] mt-1 mb-4 leading-relaxed">{card.tagline}</p>

                {/* Benefits */}
                <div className="space-y-2 border-t border-[#DCE8FA] pt-3 text-xs text-[#64748B]">
                  {card.keyFeatures.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-[#1458F5] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#DCE8FA] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#64748B] block">Annual Fee</span>
                  <span className="text-xs font-bold text-[#102451]">{card.annualFee.split('(')[0]}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCreditCard(card)}
                  className="px-3.5 py-2 bg-[#EDF5FF] hover:bg-[#1458F5] hover:text-white text-[#1458F5] text-xs font-bold rounded-xl transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Loans Section */}
      <section aria-labelledby="loans-heading" className="space-y-6">
        <div>
          <h2 id="loans-heading" className="text-xl font-extrabold text-[#082B78]">
            SBI Lending Solutions
          </h2>
          <p className="text-xs text-[#64748B]">
            Low interest rates, paperless digital journeys, and daily reducing balance calculations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LOAN_PRODUCTS.map((loan) => (
            <div
              key={loan.id}
              className="bg-white rounded-2xl border border-[#DCE8FA] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EDF5FF] flex items-center justify-center border border-[#DCE8FA]">
                    {getLoanIcon(loan.category)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#102451]">{loan.name}</h3>
                    <span className="text-[10px] font-bold text-[#1458F5] uppercase tracking-wide">
                      {loan.category} FINANCING
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
                  {loan.tagline}
                </p>

                <div className="p-3 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA] space-y-1.5 text-xs mb-4">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Starting ROI:</span>
                    <span className="font-extrabold text-[#1458F5]">{loan.startingRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Tenure:</span>
                    <span className="font-bold text-[#102451]">{loan.maxTenure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Max Amount:</span>
                    <span className="font-bold text-[#102451]">{loan.maxAmount}</span>
                  </div>
                </div>

                <ul className="space-y-1 text-[11px] text-[#64748B]">
                  {loan.features.slice(0, 2).map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-[#DCE8FA]">
                <button
                  type="button"
                  onClick={() => setSelectedLoan(loan)}
                  className="w-full py-2.5 bg-[#1458F5] hover:bg-[#082B78] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <span>Explore Loan & Check Eligibility</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EMI Calculator */}
      <section aria-labelledby="emi-calculator-heading">
        <EmiCalculator />
      </section>

      {/* Card Details Modal */}
      <CardDetailsModal
        card={selectedCreditCard}
        isOpen={!!selectedCreditCard || isDebitModalOpen}
        isDebitCard={isDebitModalOpen}
        onClose={() => {
          setSelectedCreditCard(null);
          setIsDebitModalOpen(false);
        }}
      />

      {/* Loan Enquiry Modal */}
      <LoanEnquiryModal
        loan={selectedLoan}
        isOpen={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
      />
    </div>
  );
};
