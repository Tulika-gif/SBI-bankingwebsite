import React from 'react';
import { BankAccount } from '../../types';
import { X, Landmark, Copy, Check, Download, Share2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useNavigate } from 'react-router-dom';

interface AccountDetailsModalProps {
  account: BankAccount | null;
  onClose: () => void;
}

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({ account, onClose }) => {
  const { formatCurrency } = useBanking();
  const { announce } = useAccessibility();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  if (!account) return null;

  const handleCopyIfsc = () => {
    navigator.clipboard.writeText(account.ifsc);
    setCopied(true);
    announce(`Copied IFSC code ${account.ifsc} to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#102451]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${account.name}`}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#DCE8FA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#EDF5FF] p-5 border-b border-[#DCE8FA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1458F5] flex items-center justify-center border border-[#DCE8FA]">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#082B78]">{account.name}</h3>
              <p className="text-xs text-[#64748B] font-mono">{account.maskedNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white text-[#64748B] hover:text-[#102451]"
            aria-label="Close account details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Balance card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#082B78] to-[#1458F5] text-white">
            <span className="text-xs text-blue-200 block mb-1">Total Available Balance</span>
            <div className="text-3xl font-extrabold tabular-nums tracking-tight">
              {formatCurrency(account.balance)}
            </div>
            <div className="mt-2 text-xs text-blue-100 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Insured under DICGC up to ₹5,00,000</span>
            </div>
          </div>

          {/* Account Key Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA]">
              <span className="text-[#64748B] block">Account Number</span>
              <span className="font-bold text-[#102451] font-mono text-sm">{account.accountNumber}</span>
            </div>

            <div className="p-3 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA]">
              <span className="text-[#64748B] block">IFSC Code</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#102451] font-mono text-sm">{account.ifsc}</span>
                <button
                  type="button"
                  onClick={handleCopyIfsc}
                  className="text-[#1458F5] hover:text-[#082B78] p-0.5"
                  title="Copy IFSC"
                  aria-label="Copy IFSC Code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA]">
              <span className="text-[#64748B] block">Branch Location</span>
              <span className="font-semibold text-[#102451]">{account.branch}</span>
            </div>

            <div className="p-3 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA]">
              <span className="text-[#64748B] block">Nominee Registered</span>
              <span className="font-semibold text-emerald-700">Yes (Verified)</span>
            </div>
          </div>

          {account.interestRate && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs flex justify-between items-center text-[#082B78]">
              <span>Interest Rate Applied</span>
              <span className="font-bold text-[#1458F5] text-sm">{account.interestRate}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                announce('Downloading official PDF statement...');
              }}
              className="flex-1 py-2.5 px-3 bg-white border border-[#DCE8FA] hover:bg-[#F5F8FF] text-[#102451] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-[#1458F5]" />
              <span>Download Statement</span>
            </button>

            <button
              onClick={() => {
                onClose();
                navigate('/transfer');
              }}
              className="flex-1 py-2.5 px-3 bg-[#1458F5] hover:bg-[#082B78] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Transfer from Here</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
