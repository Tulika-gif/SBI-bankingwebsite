import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useAccessibility } from '../../context/AccessibilityContext';

interface AddBeneficiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded?: (id: string) => void;
}

export const AddBeneficiaryModal: React.FC<AddBeneficiaryModalProps> = ({
  isOpen,
  onClose,
  onAdded,
}) => {
  const { addBeneficiary } = useBanking();
  const { announce } = useAccessibility();

  const [tab, setTab] = useState<'BANK_ACCOUNT' | 'UPI' | 'MOBILE'>('BANK_ACCOUNT');
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccount, setConfirmAccount] = useState('');
  const [ifsc, setIfsc] = useState('SBIN0000300');
  const [bankName, setBankName] = useState('State Bank of India');
  const [upiId, setUpiId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide the beneficiary name.');
      return;
    }

    if (tab === 'BANK_ACCOUNT') {
      if (!accountNumber || accountNumber.length < 8) {
        setError('Please enter a valid account number (min 8 digits).');
        return;
      }
      if (accountNumber !== confirmAccount) {
        setError('Account numbers do not match.');
        return;
      }
      if (!ifsc) {
        setError('Please enter an IFSC code.');
        return;
      }

      const masked = '•••• •••• ' + accountNumber.slice(-4);
      const created = addBeneficiary({
        name: name.trim(),
        accountNumber,
        maskedAccount: masked,
        bankName,
        ifsc: ifsc.toUpperCase(),
        type: 'BANK_ACCOUNT',
        favorite: false,
      });

      announce(`Beneficiary ${created.name} added successfully`);
      if (onAdded) onAdded(created.id);
      onClose();
    } else if (tab === 'UPI') {
      if (!upiId || !upiId.includes('@')) {
        setError('Please enter a valid UPI ID (e.g., name@oksbi).');
        return;
      }

      const created = addBeneficiary({
        name: name.trim(),
        upiId: upiId.toLowerCase(),
        type: 'UPI',
        favorite: false,
      });

      announce(`UPI Beneficiary ${created.name} added successfully`);
      if (onAdded) onAdded(created.id);
      onClose();
    } else {
      if (!mobileNumber || mobileNumber.length < 10) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }

      const created = addBeneficiary({
        name: name.trim(),
        mobileNumber: mobileNumber.startsWith('+91') ? mobileNumber : `+91 ${mobileNumber}`,
        type: 'MOBILE',
        favorite: false,
      });

      announce(`Mobile Beneficiary ${created.name} added successfully`);
      if (onAdded) onAdded(created.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#102451]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Add New Beneficiary"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[#DCE8FA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#EDF5FF] p-5 border-b border-[#DCE8FA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-[#1458F5] flex items-center justify-center border border-[#DCE8FA]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#082B78]">Add Payee / Beneficiary</h3>
              <p className="text-xs text-[#64748B]">Instant activation for secure transfers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white text-[#64748B] hover:text-[#102451]"
            aria-label="Close add beneficiary dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Type selector tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA] text-xs">
            <button
              type="button"
              onClick={() => { setTab('BANK_ACCOUNT'); setError(null); }}
              className={`py-2 px-2 font-bold rounded-lg transition-colors ${
                tab === 'BANK_ACCOUNT' ? 'bg-white text-[#1458F5] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Bank A/c
            </button>
            <button
              type="button"
              onClick={() => { setTab('UPI'); setError(null); }}
              className={`py-2 px-2 font-bold rounded-lg transition-colors ${
                tab === 'UPI' ? 'bg-white text-[#1458F5] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              UPI ID
            </button>
            <button
              type="button"
              onClick={() => { setTab('MOBILE'); setError(null); }}
              className={`py-2 px-2 font-bold rounded-lg transition-colors ${
                tab === 'MOBILE' ? 'bg-white text-[#1458F5] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Mobile No.
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#102451] mb-1">Payee Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Chandra"
              className="w-full px-3 py-2 text-xs bg-white border border-[#DCE8FA] rounded-xl text-[#102451] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
            />
          </div>

          {tab === 'BANK_ACCOUNT' && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#102451] mb-1">Bank Account Number</label>
                <input
                  type="password"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter 8-18 digit account number"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DCE8FA] rounded-xl text-[#102451] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102451] mb-1">Re-Enter Account Number</label>
                <input
                  type="text"
                  required
                  value={confirmAccount}
                  onChange={(e) => setConfirmAccount(e.target.value)}
                  placeholder="Confirm account number"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DCE8FA] rounded-xl text-[#102451] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#102451] mb-1">IFSC Code</label>
                  <input
                    type="text"
                    required
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    placeholder="e.g. SBIN0000300"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCE8FA] rounded-xl text-[#102451] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5] font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#102451] mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCE8FA] rounded-xl text-[#102451] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
                  />
                </div>
              </div>
            </>
          )}

          {tab === 'UPI' && (
            <div>
              <label className="block text-xs font-bold text-[#102451] mb-1">Virtual Payment Address (VPA / UPI)</label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. mobile@oksbi or name@okaxis"
                className="w-full px-3 py-2 text-xs bg-white border border-[#DCE8FA] rounded-xl text-[#102451] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5] font-mono lowercase"
              />
              <p className="text-[11px] text-[#64748B] mt-1">Verified with NPCI instant resolution protocol.</p>
            </div>
          )}

          {tab === 'MOBILE' && (
            <div>
              <label className="block text-xs font-bold text-[#102451] mb-1">Mobile Number (Linked with UPI)</label>
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-3 py-2 text-xs bg-white border border-[#DCE8FA] rounded-xl text-[#102451] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5] font-mono"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#1458F5] hover:bg-[#082B78] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              Save Beneficiary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
