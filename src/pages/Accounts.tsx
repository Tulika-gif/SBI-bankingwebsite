import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { AccountCard } from '../components/AccountCard';
import { TransactionTable } from '../components/TransactionTable';
import { AccountDetailsModal } from '../components/modals/AccountDetailsModal';
import { KeyholeLogo } from '../components/KeyholeLogo';
import { BankAccount } from '../types';
import { Eye, EyeOff, Settings, ShieldCheck, Download, Plus, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccountsProps {
  onOpenProfile: () => void;
}

export const Accounts: React.FC<AccountsProps> = ({ onOpenProfile }) => {
  const { accounts, isBalanceVisible, toggleBalanceVisibility, formatCurrency } = useBanking();
  const { announce } = useAccessibility();
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);

  const handleDownloadStatement = () => {
    announce('Downloading comprehensive combined account statement...');
    const dummy = `SBI NETRA - Consolidated Portfolio Statement\nGenerated: ${new Date().toLocaleString()}\n` +
      accounts.map(a => `${a.name} (${a.maskedNumber}): ${formatCurrency(a.balance)}`).join('\n');
    const blob = new Blob([dummy], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SBI_NETRA_Consolidated_Statement.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B78] tracking-tight">
            Accounts & Balance
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            View and manage all your accounts in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadStatement}
            className="px-4 py-2.5 bg-white border border-[#DCE8FA] hover:bg-[#F5F8FF] text-[#1458F5] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Combined Statement</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/transfer')}
            className="px-4 py-2.5 bg-[#1458F5] hover:bg-[#082B78] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Transfer Funds</span>
          </button>
        </div>
      </div>

      {/* Balance Overview (Wide Gradient Balance Card) */}
      <section aria-labelledby="balance-overview-heading">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#082B78] via-[#1458F5] to-[#3679FF] p-6 sm:p-8 text-white shadow-xl">
          {/* Subtle Keyhole graphic watermark in background */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <KeyholeLogo size={240} variant="white" />
          </div>
          <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Total Liquid & Deposit Portfolio
                </span>
                <button
                  type="button"
                  onClick={toggleBalanceVisibility}
                  className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                  aria-label={isBalanceVisible ? 'Hide total balance' : 'Show total balance'}
                >
                  {isBalanceVisible ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide Balance</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show Balance</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight tabular-nums font-mono text-white">
                {formatCurrency(totalBalance)}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100 pt-1">
                <span>3 Accounts Active</span>
                <span>·</span>
                <span>Branch: Nariman Point (00300)</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Full KYC Active
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenProfile}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-bold border border-white/25 flex items-center gap-2 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Account Settings</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Account Cards Section */}
      <section aria-labelledby="accounts-breakdown-heading">
        <h2 id="accounts-breakdown-heading" className="text-lg font-bold text-[#082B78] mb-4">
          All Active Accounts
        </h2>
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

      {/* Recent Transactions Table with Filters & Search */}
      <section aria-labelledby="transactions-heading">
        <TransactionTable showFilters={true} title="Transaction History & Statements" />
      </section>

      {/* Account Details Modal */}
      <AccountDetailsModal
        account={selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />
    </div>
  );
};
