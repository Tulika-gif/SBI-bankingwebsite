import React, { useState } from 'react';
import { LoanProduct } from '../../types';
import { X, Landmark, CheckCircle2, ShieldCheck, ArrowRight, Calculator } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface LoanEnquiryModalProps {
  loan: LoanProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LoanEnquiryModal: React.FC<LoanEnquiryModalProps> = ({
  loan,
  isOpen,
  onClose,
}) => {
  const { announce } = useAccessibility();
  const [fullName, setFullName] = useState('Sunita Sharma');
  const [mobile, setMobile] = useState('+91 98201 44521');
  const [city, setCity] = useState('Mumbai');
  const [requestedAmount, setRequestedAmount] = useState('1000000');
  const [tenureYears, setTenureYears] = useState('5');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !loan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    announce(`Loan enquiry for ${loan.name} submitted. A simulated reference ticket has been generated.`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#102451]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label={`Enquiry for ${loan.name}`}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#DCE8FA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#EDF5FF] p-5 border-b border-[#DCE8FA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-[#1458F5] flex items-center justify-center border border-[#DCE8FA]">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#082B78]">{loan.name}</h3>
              <p className="text-xs text-[#64748B]">Digital Loan Evaluation & Callback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white text-[#64748B] hover:text-[#102451]"
            aria-label="Close loan enquiry"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product highlights banner */}
              <div className="p-4 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Illustrative Starting Rate</span>
                  <span className="font-extrabold text-[#1458F5] text-sm">{loan.startingRate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Maximum Repayment Tenure</span>
                  <span className="font-bold text-[#102451]">{loan.maxTenure}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Maximum Amount Eligible</span>
                  <span className="font-bold text-[#102451]">{loan.maxAmount}</span>
                </div>
              </div>

              {/* Key Features List */}
              <div>
                <span className="font-bold text-[#102451] block mb-1.5">Key Product Benefits:</span>
                <ul className="space-y-1 text-[11px] text-[#64748B]">
                  {loan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#1458F5] font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-[#DCE8FA] space-y-3">
                <h4 className="font-bold text-[#082B78] text-xs uppercase tracking-wider">
                  Request Callback / Pre-Approval
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#64748B] font-semibold mb-1">Applicant Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#DCE8FA] rounded-xl text-[#102451]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#64748B] font-semibold mb-1">Contact Mobile</label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#DCE8FA] rounded-xl text-[#102451]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#64748B] font-semibold mb-1">Required Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#DCE8FA] rounded-xl text-[#102451] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#64748B] font-semibold mb-1">City / Branch</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#DCE8FA] rounded-xl text-[#102451]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#EDF5FF] rounded-xl border border-[#DCE8FA] text-[11px] text-[#082B78] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1458F5] shrink-0" />
                <span>Zero documentation charges. No sensitive financial credentials required.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-[#DCE8FA] text-xs font-bold text-[#102451] rounded-xl hover:bg-[#F5F8FF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1458F5] hover:bg-[#082B78] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Submit Callback Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#082B78]">Enquiry Submitted Successfully!</h4>
                <p className="text-xs text-[#64748B] mt-1">
                  Ticket Ref: #SBI-LOAN-{Math.floor(100000 + Math.random() * 900000)}. An SBI relationship manager will contact you within 24 working hours.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-[#1458F5] text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
