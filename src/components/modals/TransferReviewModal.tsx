import React, { useState } from 'react';
import { TransferParams, TransferResult } from '../../context/BankingContext';
import { X, ShieldCheck, CheckCircle2, ArrowRight, Loader2, Download, AlertTriangle, Printer } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useAccessibility } from '../../context/AccessibilityContext';

interface TransferReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferData: TransferParams | null;
  onSuccess: (result: TransferResult) => void;
}

export const TransferReviewModal: React.FC<TransferReviewModalProps> = ({
  isOpen,
  onClose,
  transferData,
  onSuccess,
}) => {
  const { executeTransfer, formatCurrency, accounts } = useBanking();
  const { announce } = useAccessibility();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TransferResult | null>(null);

  if (!isOpen || !transferData) return null;

  const sourceAccount = accounts.find(a => a.id === transferData.sourceAccountId) || accounts[0];

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      announce('Authorizing simulated money transfer...');
      const res = await executeTransfer(transferData);
      setResult(res);
      onSuccess(res);
      announce(`Transfer of ${formatCurrency(res.amount)} successful. Transaction reference ${res.referenceId}`);
    } catch (err: any) {
      setError(err.message || 'Transaction could not be completed.');
      announce('Transaction failed due to insufficient funds.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    announce('Receipt sent to printer');
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#102451]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Review Money Transfer"
      onClick={result ? undefined : onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[#DCE8FA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#EDF5FF] p-5 border-b border-[#DCE8FA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-[#1458F5] flex items-center justify-center border border-[#DCE8FA]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#082B78]">
                {result ? 'Transfer Successful' : 'Review Transfer Details'}
              </h3>
              <p className="text-xs text-[#64748B]">
                {result ? 'Simulated Bank Confirmation' : 'Verify details before confirmation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white text-[#64748B] hover:text-[#102451]"
            aria-label="Close transfer dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!result ? (
            <>
              {/* Amount to transfer banner */}
              <div className="text-center p-5 rounded-2xl bg-[#F5F8FF] border border-[#DCE8FA]">
                <span className="text-xs text-[#64748B] block mb-1">Transfer Amount</span>
                <div className="text-3xl font-extrabold text-[#082B78] tabular-nums">
                  {formatCurrency(transferData.amount)}
                </div>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#EDF5FF] text-[#1458F5] text-[11px] font-bold border border-[#DCE8FA]">
                  {transferData.transferMethod} · Instant Transfer
                </span>
              </div>

              {/* Source & Beneficiary Summary */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#DCE8FA] flex justify-between items-center">
                  <span className="text-[#64748B]">Debit From</span>
                  <div className="text-right">
                    <div className="font-bold text-[#102451]">{sourceAccount.name}</div>
                    <div className="text-[11px] text-[#64748B] font-mono">{sourceAccount.maskedNumber}</div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#DCE8FA] flex justify-between items-center">
                  <span className="text-[#64748B]">Beneficiary</span>
                  <div className="text-right">
                    <div className="font-bold text-[#102451]">{transferData.recipient.name}</div>
                    <div className="text-[11px] text-[#64748B] font-mono">{transferData.recipient.accountOrUpi}</div>
                  </div>
                </div>

                {transferData.note && (
                  <div className="p-3 bg-white rounded-xl border border-[#DCE8FA] flex justify-between items-center">
                    <span className="text-[#64748B]">Remarks / Note</span>
                    <span className="font-semibold text-[#102451]">{transferData.note}</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Simulated prototype transfer. No real money will be debited. Bank security standards applied.
                </span>
              </div>

              {/* Confirm CTA */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#DCE8FA] text-xs font-bold text-[#102451] hover:bg-[#F5F8FF] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#1458F5] hover:bg-[#082B78] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Send</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Result State */
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-[#082B78]">Payment Successful!</h4>
                <p className="text-xs text-[#64748B] mt-1">
                  Sent to {result.recipientName} via {result.method}
                </p>
              </div>

              <div className="p-4 bg-[#F5F8FF] border border-[#DCE8FA] rounded-2xl text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#DCE8FA]">
                  <span className="text-[#64748B]">Amount Transferred</span>
                  <span className="font-extrabold text-[#102451] text-base tabular-nums">
                    {formatCurrency(result.amount)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#DCE8FA]">
                  <span className="text-[#64748B]">Transaction Reference</span>
                  <span className="font-mono font-bold text-[#1458F5]">{result.referenceId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#DCE8FA]">
                  <span className="text-[#64748B]">Date & Time</span>
                  <span className="font-medium text-[#102451]">{result.timestamp}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#64748B]">Updated Account Balance</span>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    {formatCurrency(result.remainingBalance)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
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
