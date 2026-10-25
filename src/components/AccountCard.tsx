import React, { useState } from 'react';
import { BankAccount } from '../types';
import { Landmark, Briefcase, PiggyBank, MoreVertical, Eye, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { useAccessibility } from '../context/AccessibilityContext';

interface AccountCardProps {
  account: BankAccount;
  onViewDetails: (account: BankAccount) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onViewDetails }) => {
  const { formatCurrency, isBalanceVisible } = useBanking();
  const { announce } = useAccessibility();
  const [menuOpen, setMenuOpen] = useState(false);

  const getIcon = () => {
    switch (account.type) {
      case 'SAVINGS':
        return <Landmark className="w-5 h-5 text-[#1458F5]" />;
      case 'CURRENT':
        return <Briefcase className="w-5 h-5 text-[#082B78]" />;
      case 'FIXED_DEPOSIT':
        return <PiggyBank className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (account.status) {
      case 'ACTIVE':
        return (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Active
          </span>
        );
      case 'MATURING_SOON':
        return (
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Matures {account.maturityDate}
          </span>
        );
      case 'DORMANT':
        return (
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
            Dormant
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DCE8FA] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF5FF] flex items-center justify-center border border-[#DCE8FA]">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#102451]">{account.name}</h3>
              <p className="text-xs text-[#64748B] font-mono tracking-wider">{account.maskedNumber}</p>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#102451] hover:bg-[#F5F8FF] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
              aria-label={`Options for ${account.name}`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-8 z-20 w-48 bg-white rounded-xl shadow-xl border border-[#DCE8FA] py-1 text-xs text-[#102451] animate-in fade-in duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onViewDetails(account);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#EDF5FF] flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-[#1458F5]" />
                  View Account Details
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    announce(`Downloaded simulated statement for ${account.name}`);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#EDF5FF] flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-[#1458F5]" />
                  Download Statement
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    announce(`Certificate generated for ${account.maskedNumber}`);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#EDF5FF] flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1458F5]" />
                  Interest Certificate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Balance Display */}
        <div className="my-4">
          <span className="text-xs text-[#64748B] block mb-1">Available Balance</span>
          <div className="text-2xl font-extrabold text-[#082B78] tabular-nums tracking-tight">
            {formatCurrency(account.balance)}
          </div>
        </div>

        {/* Metadata info */}
        <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-[#DCE8FA]">
          <span>{account.interestRate ? `ROI: ${account.interestRate}` : 'Branch: ' + account.branch.split(',')[0]}</span>
          {getStatusBadge()}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#DCE8FA]">
        <button
          type="button"
          onClick={() => onViewDetails(account)}
          className="w-full py-2 px-3 rounded-xl bg-[#F5F8FF] hover:bg-[#EDF5FF] text-[#1458F5] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
        >
          <span>View Account Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
