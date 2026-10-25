import React, { useState } from 'react';
import { CreditCardProduct } from '../../types';
import { X, CreditCard, Shield, Lock, Unlock, Sliders, CheckCircle2 } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface CardDetailsModalProps {
  card: CreditCardProduct | null;
  isOpen: boolean;
  onClose: () => void;
  isDebitCard?: boolean;
}

export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  card,
  isOpen,
  onClose,
  isDebitCard = false,
}) => {
  const { announce } = useAccessibility();
  const [isFrozen, setIsFrozen] = useState(false);
  const [domesticLimit, setDomesticLimit] = useState('50000');
  const [internationalLimit, setInternationalLimit] = useState('0');
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleFreeze = () => {
    const next = !isFrozen;
    setIsFrozen(next);
    announce(`Card ${next ? 'temporarily locked' : 'unlocked for transactions'}`);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4) {
      setPinSuccess(true);
      announce('ATM Green PIN updated successfully.');
      setTimeout(() => {
        setPinSuccess(false);
        setShowPinDialog(false);
        setNewPin('');
      }, 1500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#102451]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Card Controls and Information"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#DCE8FA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#EDF5FF] p-5 border-b border-[#DCE8FA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-[#1458F5] flex items-center justify-center border border-[#DCE8FA]">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#082B78]">
                {isDebitCard ? 'SBI Global Debit Card Controls' : card?.name}
              </h3>
              <p className="text-xs text-[#64748B]">
                {isDebitCard ? 'Linked to Savings A/c •••• 0482' : card?.tagline}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white text-[#64748B] hover:text-[#102451]"
            aria-label="Close card dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Card Graphic */}
          <div
            className={`w-full h-44 rounded-2xl p-5 text-white flex flex-col justify-between relative shadow-lg ${
              isDebitCard ? 'bg-gradient-to-tr from-[#082B78] via-[#1458F5] to-[#3679FF]' : ''
            }`}
            style={!isDebitCard && card ? { background: card.gradient } : undefined}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase opacity-80">
                  STATE BANK OF INDIA
                </span>
                <div className="text-sm font-extrabold tracking-wide">
                  {isDebitCard ? 'GLOBAL CONTACTLESS' : card?.name}
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                <span className="text-[10px] font-bold">NFC</span>
              </div>
            </div>

            {/* Chip icon and masked number */}
            <div>
              <div className="w-9 h-7 rounded-md bg-amber-300/80 border border-amber-400 mb-2 flex items-center justify-center">
                <div className="w-4 h-3 border border-amber-800/40 rounded-xs"></div>
              </div>
              <div className="font-mono text-base tracking-widest font-bold">
                {isDebitCard ? '4532 •••• •••• 4892' : '5241 •••• •••• 9920'}
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <span className="text-[9px] uppercase tracking-wider opacity-75 block">Cardholder</span>
                <span className="font-bold tracking-wide">SUNITA SHARMA</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider opacity-75 block">Valid Thru</span>
                <span className="font-mono font-bold">09/29</span>
              </div>
            </div>
          </div>

          {/* Controls if debit card */}
          {isDebitCard ? (
            <div className="space-y-4">
              <div className="p-4 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#102451]">Card Temporary Lock (Freeze)</h4>
                  <p className="text-[11px] text-[#64748B]">Instantly block all ATM, POS, and online transactions</p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleFreeze}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    isFrozen ? 'bg-red-600 text-white' : 'bg-white border border-[#DCE8FA] text-[#1458F5]'
                  }`}
                >
                  {isFrozen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{isFrozen ? 'Card Frozen' : 'Freeze Card'}</span>
                </button>
              </div>

              {/* Limits Adjustment */}
              <div className="p-4 bg-white rounded-xl border border-[#DCE8FA] space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-[#102451]">
                  <Sliders className="w-3.5 h-3.5 text-[#1458F5]" />
                  <span>Domestic Spending Limit (Daily)</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={domesticLimit}
                  onChange={(e) => setDomesticLimit(e.target.value)}
                  className="w-full accent-[#1458F5]"
                />
                <div className="flex justify-between text-[11px] text-[#64748B] font-mono">
                  <span>Min: ₹5,000</span>
                  <span className="font-bold text-[#082B78] text-xs">Current: ₹{Number(domesticLimit).toLocaleString('en-IN')}</span>
                  <span>Max: ₹1,00,000</span>
                </div>
              </div>

              {/* Green PIN Generation */}
              <div className="p-4 bg-white rounded-xl border border-[#DCE8FA] space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-[#102451]">Instant Green PIN Generation</h4>
                    <p className="text-[11px] text-[#64748B]">Set or reset your 4-digit ATM PIN paperless</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPinDialog(!showPinDialog)}
                    className="px-3 py-1.5 bg-[#EDF5FF] text-[#1458F5] rounded-lg font-bold hover:bg-[#DCE8FA]"
                  >
                    Set PIN
                  </button>
                </div>

                {showPinDialog && (
                  <form onSubmit={handlePinSubmit} className="pt-2 border-t border-[#DCE8FA] flex items-center gap-2">
                    <input
                      type="password"
                      maxLength={4}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 4 digits"
                      className="w-32 px-2.5 py-1.5 bg-[#F5F8FF] border border-[#DCE8FA] rounded-lg font-mono text-center tracking-widest text-sm"
                    />
                    <button
                      type="submit"
                      disabled={newPin.length !== 4}
                      className="px-3 py-1.5 bg-[#1458F5] text-white rounded-lg font-bold disabled:opacity-50"
                    >
                      Save PIN
                    </button>
                    {pinSuccess && (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Updated!
                      </span>
                    )}
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* Credit Card Features & Benefits */
            <div className="space-y-4">
              <div className="p-3 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA]">
                <h4 className="font-bold text-[#082B78] mb-1">Key Reward Privileges</h4>
                <ul className="space-y-1.5 text-[11px] text-[#64748B]">
                  {card?.keyFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#1458F5] font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#DCE8FA]">
                  <span className="text-[#64748B] block">Annual Fee</span>
                  <span className="font-bold text-[#102451]">{card?.annualFee}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#DCE8FA]">
                  <span className="text-[#64748B] block">Joining Privilege</span>
                  <span className="font-bold text-[#1458F5]">{card?.joiningFee}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-[#082B78]">
                <strong>Eligibility:</strong> Resident Indian, age 21–65 years with minimum annual income ₹3,00,000. Approval subject to bank verification.
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#1458F5] text-white rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
