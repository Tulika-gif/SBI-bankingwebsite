import React, { useState } from 'react';
import { BillItem } from '../../types';
import { X, Zap, CheckCircle2, ShieldCheck, Loader2, ArrowRight, Printer } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useAccessibility } from '../../context/AccessibilityContext';

interface BillPayModalProps {
  bill: BillItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BillPayModal: React.FC<BillPayModalProps> = ({
  bill,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { accounts, payBill, formatCurrency } = useBanking();
  const { announce } = useAccessibility();

  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [consumerNumber, setConsumerNumber] = useState(bill?.consumerNumber || 'BES-94820194');
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ referenceId: string; date: string } | null>(null);

  if (!isOpen || !bill) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    setError(null);

    try {
      announce(`Paying ${bill.serviceName} amount of ${formatCurrency(bill.amount)}...`);
      const res = await payBill(bill.id, bill.amount, selectedAccountId);
      const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      setReceipt({ referenceId: res.referenceId, date: dateStr });
      announce(`Payment for ${bill.serviceName} successful! Ref: ${res.referenceId}`);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Payment could not be processed.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#102451]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label={`Pay ${bill.serviceName}`}
      onClick={receipt ? undefined : onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[#DCE8FA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#EDF5FF] p-5 border-b border-[#DCE8FA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-[#1458F5] flex items-center justify-center border border-[#DCE8FA]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#082B78]">
                {receipt ? 'Bill Payment Receipt' : `Pay ${bill.serviceName}`}
              </h3>
              <p className="text-xs text-[#64748B]">Bharat BillPay (BBPS) Certified Channel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white text-[#64748B] hover:text-[#102451]"
            aria-label="Close bill payment"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {!receipt ? (
            <form onSubmit={handlePay} className="space-y-4">
              <div className="p-4 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Biller / Operator</span>
                  <span className="font-bold text-[#102451]">{bill.provider}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Due Date</span>
                  <span className="font-semibold text-amber-700">{bill.dueDate}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#DCE8FA]">
                  <span className="text-[#64748B]">Bill Amount</span>
                  <span className="text-xl font-extrabold text-[#082B78] tabular-nums">
                    {formatCurrency(bill.amount)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102451] mb-1">Consumer / CA Number</label>
                <input
                  type="text"
                  required
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DCE8FA] rounded-xl font-mono text-[#102451]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102451] mb-1">Pay From Bank Account</label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DCE8FA] rounded-xl text-[#102451] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.maskedNumber}) - Bal: {formatCurrency(acc.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-[#EDF5FF] rounded-xl border border-[#DCE8FA] text-[11px] text-[#082B78] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1458F5] shrink-0" />
                <span>Zero transaction charges on BBPS utility bill settlements.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-[#DCE8FA] text-xs font-bold text-[#102451] rounded-xl hover:bg-[#F5F8FF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className="flex-1 py-3 bg-[#1458F5] hover:bg-[#082B78] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs"
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Settling...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay {formatCurrency(bill.amount)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-[#082B78]">Payment Received!</h4>
                <p className="text-xs text-[#64748B] mt-1">{bill.serviceName} settled successfully</p>
              </div>

              <div className="p-4 bg-[#F5F8FF] border border-[#DCE8FA] rounded-2xl text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#DCE8FA]">
                  <span className="text-[#64748B]">Biller</span>
                  <span className="font-bold text-[#102451]">{bill.provider}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#DCE8FA]">
                  <span className="text-[#64748B]">Amount Paid</span>
                  <span className="font-extrabold text-[#082B78] text-base tabular-nums">
                    {formatCurrency(bill.amount)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#DCE8FA]">
                  <span className="text-[#64748B]">BBPS Reference No.</span>
                  <span className="font-mono font-bold text-[#1458F5]">{receipt.referenceId}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748B]">Payment Date</span>
                  <span className="font-medium text-[#102451]">{receipt.date}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#DCE8FA] text-xs font-bold text-[#102451] hover:bg-[#F5F8FF] flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-[#1458F5]" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#1458F5] hover:bg-[#082B78] text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
