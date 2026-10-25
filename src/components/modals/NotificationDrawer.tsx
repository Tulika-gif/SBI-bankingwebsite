import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell, Zap, ArrowDownLeft, ShieldCheck, CheckCheck } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { bills, formatCurrency } = useBanking();
  const dueBills = bills.filter(b => b.status === 'DUE');

  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#102451]/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Notifications Drawer"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#DCE8FA]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#DCE8FA] flex items-center justify-between bg-[#F5F8FF]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EDF5FF] text-[#1458F5] flex items-center justify-center border border-[#DCE8FA]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#082B78]">Notifications</h3>
              <p className="text-xs text-[#64748B]">Alerts, reminders & banking updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white text-[#64748B] hover:text-[#102451]"
            aria-label="Close notifications drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Due Bills Notifications */}
          {dueBills.map(bill => (
            <div
              key={bill.id}
              className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-md bg-amber-100 text-amber-800">
                    <Zap className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">{bill.serviceName} Due Soon</h4>
                    <p className="text-[11px] text-amber-700">{bill.provider}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-900 tabular-nums">
                  {formatCurrency(bill.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-xs">
                <span className="text-[11px] text-amber-800">Due by {bill.dueDate}</span>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/payments');
                  }}
                  className="px-2.5 py-1 bg-[#1458F5] text-white rounded-md text-xs font-semibold hover:bg-[#082B78]"
                >
                  Pay Now
                </button>
              </div>
            </div>
          ))}

          {/* Account Alert */}
          <div className="p-3.5 rounded-xl border border-[#DCE8FA] bg-[#F5F8FF] flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-emerald-100 text-emerald-800">
                  <ArrowDownLeft className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#102451]">Monthly Salary Credited</h4>
                  <p className="text-[11px] text-[#64748B]">Tech Corp India Pvt Ltd</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 tabular-nums">
                + ₹95,000.00
              </span>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Ref: CMS92018472910 credited to Savings A/c •••• 0482.
            </p>
          </div>

          {/* Security Alert */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-[#EDF5FF] flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-blue-100 text-[#1458F5]">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-bold text-[#082B78]">Security: 2FA Active</h4>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Your SBI NETRA account is secured with biometric voice-pass & SMS OTP authentication. Never disclose security OTPs to anyone.
            </p>
          </div>
        </div>

        <div className="p-3 border-t border-[#DCE8FA] bg-[#F5F8FF] flex items-center justify-between">
          <button
            onClick={() => {
              navigate('/accounts');
              onClose();
            }}
            className="text-xs font-semibold text-[#1458F5] hover:underline"
          >
            View Account Statements
          </button>
          <span className="text-[11px] text-[#64748B]">Updated just now</span>
        </div>
      </div>
    </div>
  );
};
