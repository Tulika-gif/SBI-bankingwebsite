import React, { useState } from 'react';
import { X, CalendarClock, CheckCircle2, ShieldCheck, Check } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useAccessibility } from '../../context/AccessibilityContext';

interface AutoPayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutoPayModal: React.FC<AutoPayModalProps> = ({ isOpen, onClose }) => {
  const { bills, toggleAutoPay, formatCurrency } = useBanking();
  const { announce } = useAccessibility();
  const [success, setSuccess] = useState(false);
  const [selectedBiller, setSelectedBiller] = useState(bills[0]?.id || '');
  const [maxLimit, setMaxLimit] = useState('5000');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBiller) {
      toggleAutoPay(selectedBiller);
    }
    setSuccess(true);
    announce('Simulated e-Mandate AutoPay mandate created successfully.');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#102451]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Set Up AutoPay Mandate"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[#DCE8FA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#EDF5FF] p-5 border-b border-[#DCE8FA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-[#1458F5] flex items-center justify-center border border-[#DCE8FA]">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#082B78]">Set Up AutoPay (e-Mandate)</h3>
              <p className="text-xs text-[#64748B]">Automate routine monthly utility payments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white text-[#64748B] hover:text-[#102451]"
            aria-label="Close AutoPay dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!success ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#102451] mb-1">Select Biller for Standing Order</label>
                <select
                  value={selectedBiller}
                  onChange={(e) => setSelectedBiller(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DCE8FA] rounded-xl text-[#102451] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
                >
                  {bills.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.serviceName} - {b.provider} ({formatCurrency(b.amount)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#102451] mb-1">Max Debit Limit per Cycle (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] font-bold">₹</span>
                  <input
                    type="number"
                    value={maxLimit}
                    onChange={(e) => setMaxLimit(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-[#DCE8FA] rounded-xl text-[#102451] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5] font-mono"
                  />
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">Payments exceeding this threshold will ask for manual confirmation.</p>
              </div>

              <div className="p-3 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA] space-y-1.5 text-[11px] text-[#082B78]">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#1458F5]" />
                  <span>Reserve Bank of India (RBI) e-Mandate Protection</span>
                </div>
                <p className="text-[#64748B]">
                  You will receive an SMS and push notification 24 hours prior to any scheduled auto-debit. You can cancel anytime with 1 click.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-[#DCE8FA] font-bold text-[#102451] rounded-xl hover:bg-[#F5F8FF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#1458F5] hover:bg-[#082B78] text-white font-bold rounded-xl shadow-xs"
                >
                  Authorize AutoPay
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#082B78]">AutoPay Mandate Configured!</h4>
                <p className="text-xs text-[#64748B] mt-1">
                  Your bills will be paid automatically on due date with pre-debit advisory SMS.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-[#1458F5] text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
