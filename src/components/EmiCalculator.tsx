import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, ShieldCheck } from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const EmiCalculator: React.FC = () => {
  const { formatCurrency } = useBanking();

  const [loanAmount, setLoanAmount] = useState<number>(2500000); // 25 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState<number>(15); // 15 Years

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenureYears * 12;

    if (monthlyRate === 0) {
      const emiVal = principal / months;
      return { emi: emiVal, totalInterest: 0, totalPayment: principal };
    }

    const emiVal =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPay = emiVal * months;
    const totalInt = totalPay - principal;

    return {
      emi: Math.round(emiVal),
      totalInterest: Math.round(totalInt),
      totalPayment: Math.round(totalPay),
    };
  }, [loanAmount, interestRate, tenureYears]);

  const principalRatio = Math.round((loanAmount / totalPayment) * 100);

  return (
    <div className="bg-white rounded-2xl border border-[#DCE8FA] p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#EDF5FF] text-[#1458F5] flex items-center justify-center border border-[#DCE8FA]">
          <Calculator className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#082B78]">Interactive Loan EMI Calculator</h3>
          <p className="text-xs text-[#64748B]">Calculate monthly installments and interest outgo instantly</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#102451]">Loan Amount</label>
              <span className="text-sm font-extrabold text-[#1458F5] font-mono tabular-nums">
                {formatCurrency(loanAmount)}
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="10000000"
              step="50000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-[#1458F5] h-2 bg-[#EDF5FF] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#64748B] mt-1 font-mono">
              <span>₹1 Lakh</span>
              <span>₹50 Lakhs</span>
              <span>₹1 Crore</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#102451]">Interest Rate (% p.a.)</label>
              <span className="text-sm font-extrabold text-[#1458F5] font-mono tabular-nums">
                {interestRate.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="7.0"
              max="16.0"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-[#1458F5] h-2 bg-[#EDF5FF] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#64748B] mt-1 font-mono">
              <span>7.0%</span>
              <span>11.5%</span>
              <span>16.0%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#102451]">Loan Tenure (Years)</label>
              <span className="text-sm font-extrabold text-[#1458F5] font-mono tabular-nums">
                {tenureYears} Years ({tenureYears * 12} Months)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-[#1458F5] h-2 bg-[#EDF5FF] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#64748B] mt-1 font-mono">
              <span>1 Year</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* EMI Summary Result Card */}
        <div className="lg:col-span-5 bg-[#F5F8FF] rounded-2xl border border-[#DCE8FA] p-6 space-y-4">
          <div className="text-center pb-4 border-b border-[#DCE8FA]">
            <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold block mb-1">
              Estimated Monthly Installment (EMI)
            </span>
            <div className="text-3xl font-extrabold text-[#082B78] font-mono tabular-nums">
              {formatCurrency(emi)}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">per month</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Principal Amount</span>
              <span className="font-bold text-[#102451] tabular-nums font-mono">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Total Interest Outgo</span>
              <span className="font-bold text-amber-700 tabular-nums font-mono">{formatCurrency(totalInterest)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#DCE8FA]">
              <span className="text-[#64748B] font-semibold">Total Amount Payable</span>
              <span className="font-extrabold text-[#082B78] tabular-nums font-mono">{formatCurrency(totalPayment)}</span>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div className="pt-2">
            <div className="flex justify-between text-[10px] text-[#64748B] mb-1">
              <span>Principal ({principalRatio}%)</span>
              <span>Interest ({100 - principalRatio}%)</span>
            </div>
            <div className="h-2.5 w-full bg-amber-200 rounded-full overflow-hidden flex">
              <div
                className="bg-[#1458F5] h-full transition-all duration-300"
                style={{ width: `${principalRatio}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
