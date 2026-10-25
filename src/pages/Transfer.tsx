import React, { useState, useMemo } from 'react';
import { useBanking, TransferParams, TransferResult } from '../context/BankingContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { Beneficiary } from '../types';
import { AddBeneficiaryModal } from '../components/modals/AddBeneficiaryModal';
import { TransferReviewModal } from '../components/modals/TransferReviewModal';
import { Search, UserPlus, Check, Send, ShieldCheck, Zap, Clock, AlertCircle } from 'lucide-react';

export const Transfer: React.FC = () => {
  const { accounts, beneficiaries, formatCurrency } = useBanking();
  const { announce } = useAccessibility();

  // Selected source account
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const sourceAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0];

  // Recipient selection state
  const [recipientTab, setRecipientTab] = useState<'RECENT' | 'UPI' | 'MOBILE' | 'BANK' | 'BENEFICIARIES'>('RECENT');
  const [searchRecipient, setSearchRecipient] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<Beneficiary | null>(beneficiaries[0] || null);

  // Transfer form state
  const [amount, setAmount] = useState<string>('1500');
  const [note, setNote] = useState<string>('Personal transfer');
  const [method, setMethod] = useState<'UPI' | 'IMPS' | 'NEFT' | 'RTGS'>('IMPS');

  // Modals
  const [isAddBeneficiaryOpen, setIsAddBeneficiaryOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [pendingTransferData, setPendingTransferData] = useState<TransferParams | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Filtered recipients
  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter(b => {
      const matchSearch =
        b.name.toLowerCase().includes(searchRecipient.toLowerCase()) ||
        (b.upiId && b.upiId.toLowerCase().includes(searchRecipient.toLowerCase())) ||
        (b.accountNumber && b.accountNumber.includes(searchRecipient)) ||
        (b.mobileNumber && b.mobileNumber.includes(searchRecipient));

      if (!matchSearch) return false;

      if (recipientTab === 'RECENT') return true;
      if (recipientTab === 'UPI') return b.type === 'UPI' || !!b.upiId;
      if (recipientTab === 'MOBILE') return b.type === 'MOBILE' || !!b.mobileNumber;
      if (recipientTab === 'BANK') return b.type === 'BANK_ACCOUNT' || !!b.accountNumber;
      return true; // BENEFICIARIES
    });
  }, [beneficiaries, searchRecipient, recipientTab]);

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
    setValidationError(null);
    announce(`Amount set to ${formatCurrency(val)}`);
  };

  const handleReviewClick = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!selectedRecipient) {
      setValidationError('Please select a recipient.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setValidationError('Please enter a valid amount greater than ₹0.');
      return;
    }

    if (numAmount > sourceAccount.balance) {
      setValidationError(`Insufficient balance. Available: ${formatCurrency(sourceAccount.balance)}.`);
      return;
    }

    const targetAccountOrUpi =
      selectedRecipient.upiId ||
      selectedRecipient.maskedAccount ||
      selectedRecipient.mobileNumber ||
      'Account';

    const params: TransferParams = {
      sourceAccountId: sourceAccount.id,
      recipient: {
        name: selectedRecipient.name,
        accountOrUpi: targetAccountOrUpi,
        bankName: selectedRecipient.bankName,
        ifsc: selectedRecipient.ifsc,
      },
      amount: numAmount,
      note: note.trim() || undefined,
      transferMethod: method,
    };

    setPendingTransferData(params);
    setIsReviewOpen(true);
  };

  const handleTransferSuccess = (res: TransferResult) => {
    announce(`Transfer completed successfully to ${res.recipientName}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B78] tracking-tight">
          Money Transfer
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1">
          Send money securely and instantly.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column — Select Recipient */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#DCE8FA] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#102451]">1. Select Recipient</h2>
            <button
              type="button"
              onClick={() => setIsAddBeneficiaryOpen(true)}
              className="text-xs font-bold text-[#1458F5] hover:text-[#082B78] flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-[#EDF5FF] transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Beneficiary</span>
            </button>
          </div>

          {/* Recipient Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA] text-xs font-semibold">
            {[
              { id: 'RECENT', label: 'Recent' },
              { id: 'UPI', label: 'UPI ID' },
              { id: 'MOBILE', label: 'Mobile No.' },
              { id: 'BANK', label: 'Bank Account' },
              { id: 'BENEFICIARIES', label: 'All Payees' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setRecipientTab(tab.id as any);
                  announce(`Switched to ${tab.label}`);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-colors whitespace-nowrap text-center ${
                  recipientTab === tab.id
                    ? 'bg-white text-[#1458F5] shadow-xs'
                    : 'text-[#64748B] hover:text-[#102451]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search field */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchRecipient}
              onChange={(e) => setSearchRecipient(e.target.value)}
              placeholder="Search by payee name, mobile or UPI ID..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5F8FF] border border-[#DCE8FA] rounded-xl text-[#102451] placeholder:text-[#64748B] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
              aria-label="Filter recipient contacts"
            />
          </div>

          {/* Beneficiary List */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredBeneficiaries.length > 0 ? (
              filteredBeneficiaries.map((ben) => {
                const isSelected = selectedRecipient?.id === ben.id;
                return (
                  <button
                    key={ben.id}
                    type="button"
                    onClick={() => {
                      setSelectedRecipient(ben);
                      setValidationError(null);
                      announce(`Selected recipient ${ben.name}`);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#1458F5] bg-[#EDF5FF] shadow-xs'
                        : 'border-[#DCE8FA] hover:bg-[#F5F8FF] bg-white'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${ben.avatarColor}`}
                      >
                        {ben.initials}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#102451] flex items-center gap-2">
                          <span>{ben.name}</span>
                          {ben.favorite && (
                            <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-semibold border border-amber-200">
                              Favorite
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#64748B] font-mono mt-0.5">
                          {ben.upiId || ben.maskedAccount || ben.mobileNumber}
                        </div>
                        {ben.bankName && (
                          <div className="text-[10px] text-slate-500">{ben.bankName}</div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#1458F5] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-[#DCE8FA]" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-[#64748B]">
                <p>No beneficiaries match "{searchRecipient}"</p>
                <button
                  type="button"
                  onClick={() => setIsAddBeneficiaryOpen(true)}
                  className="mt-2 text-[#1458F5] font-bold hover:underline"
                >
                  Add a new payee now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Enter Amount & Method */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#DCE8FA] p-6 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-[#102451]">2. Transfer Details</h2>

          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Source Account Selector */}
          <div>
            <label className="block text-xs font-bold text-[#102451] mb-1.5">
              Debit From Account
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-[#F5F8FF] border border-[#DCE8FA] rounded-xl text-[#102451] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.maskedNumber}) — Balance: {formatCurrency(acc.balance)}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Recipient Preview */}
          {selectedRecipient ? (
            <div className="p-3.5 bg-[#EDF5FF] rounded-xl border border-[#DCE8FA] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${selectedRecipient.avatarColor}`}
                >
                  {selectedRecipient.initials}
                </div>
                <div>
                  <span className="text-[11px] text-[#64748B] block">Sending to</span>
                  <span className="font-bold text-[#082B78] text-sm">{selectedRecipient.name}</span>
                </div>
              </div>
              <span className="font-mono text-xs text-[#1458F5] font-semibold">
                {selectedRecipient.upiId || selectedRecipient.maskedAccount || selectedRecipient.mobileNumber}
              </span>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
              Please choose a recipient from the left column to proceed.
            </div>
          )}

          {/* Amount input */}
          <div>
            <label className="block text-xs font-bold text-[#102451] mb-1.5">
              Transfer Amount (INR)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-[#082B78]">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setValidationError(null);
                }}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-3 text-2xl font-extrabold text-[#082B78] bg-[#F5F8FF] border border-[#DCE8FA] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1458F5] tabular-nums font-mono"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              {[500, 1000, 2000, 5000].map((quickVal) => (
                <button
                  key={quickVal}
                  type="button"
                  onClick={() => handleQuickAmount(quickVal)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    amount === quickVal.toString()
                      ? 'bg-[#1458F5] text-white border-[#1458F5]'
                      : 'bg-[#F5F8FF] hover:bg-[#EDF5FF] text-[#1458F5] border-[#DCE8FA]'
                  }`}
                >
                  ₹{quickVal.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Transfer Method Selection */}
          <div>
            <label className="block text-xs font-bold text-[#102451] mb-1.5">
              Transfer Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'IMPS', label: 'IMPS', speed: 'Instant (24x7)', limit: 'Max ₹5 Lakhs' },
                { id: 'UPI', label: 'UPI', speed: 'Real-time', limit: 'Max ₹1 Lakh' },
                { id: 'NEFT', label: 'NEFT', speed: 'Batch mode', limit: 'No Max limit' },
                { id: 'RTGS', label: 'RTGS', speed: 'High Value', limit: 'Min ₹2 Lakhs' },
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-colors ${
                    method === m.id
                      ? 'border-[#1458F5] bg-[#EDF5FF]'
                      : 'border-[#DCE8FA] hover:bg-[#F5F8FF]'
                  }`}
                >
                  <div className="font-extrabold text-xs text-[#082B78]">{m.label}</div>
                  <div className="text-[10px] text-[#1458F5] font-semibold mt-0.5">{m.speed}</div>
                  <div className="text-[9px] text-[#64748B]">{m.limit}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Transfer Note */}
          <div>
            <label className="block text-xs font-bold text-[#102451] mb-1">
              Add Note / Remarks (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Rent, Gift, Grocery sharing"
              className="w-full px-3 py-2 text-xs bg-[#F5F8FF] border border-[#DCE8FA] rounded-xl text-[#102451] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
            />
          </div>

          {/* Security Advisory note */}
          <div className="p-3 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA] text-[11px] text-[#64748B] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1458F5] shrink-0" />
            <span>Simulated transaction flow. No real banking credentials or PINs requested.</span>
          </div>

          {/* Review CTA */}
          <button
            type="button"
            onClick={handleReviewClick}
            className="w-full py-3.5 bg-[#1458F5] hover:bg-[#082B78] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Review Transfer Details</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Beneficiary Modal */}
      <AddBeneficiaryModal
        isOpen={isAddBeneficiaryOpen}
        onClose={() => setIsAddBeneficiaryOpen(false)}
        onAdded={(id) => {
          const added = beneficiaries.find(b => b.id === id);
          if (added) setSelectedRecipient(added);
        }}
      />

      {/* Transfer Review Modal */}
      <TransferReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        transferData={pendingTransferData}
        onSuccess={handleTransferSuccess}
      />
    </div>
  );
};
