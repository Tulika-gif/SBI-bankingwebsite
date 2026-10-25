import React, { useState } from 'react';
import { useBanking, RechargeParams } from '../context/BankingContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { BILL_CATEGORIES, RECHARGE_PLANS } from '../data/mockData';
import { BillItem } from '../types';
import { BillPayModal } from '../components/modals/BillPayModal';
import { AutoPayModal } from '../components/modals/AutoPayModal';
import {
  Zap,
  Droplets,
  Flame,
  Tv,
  Smartphone,
  PhoneCall,
  Wifi,
  GraduationCap,
  Building2,
  Landmark,
  ShieldCheck,
  MoreHorizontal,
  CalendarClock,
  ArrowRight,
  CheckCircle2,
  Clock,
  Check,
  Sparkles,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Zap,
  Droplets,
  Flame,
  Tv,
  Smartphone,
  PhoneCall,
  Wifi,
  GraduationCap,
  Building2,
  Landmark,
  ShieldCheck,
  MoreHorizontal,
};

export const Payments: React.FC = () => {
  const { bills, formatCurrency, executeRecharge } = useBanking();
  const { announce } = useAccessibility();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'BILLS' | 'RECHARGE' | 'MY_BILLS'>('BILLS');

  // Modals state
  const [selectedBillToPay, setSelectedBillToPay] = useState<BillItem | null>(null);
  const [isAutoPayOpen, setIsAutoPayOpen] = useState(false);

  // Recharge State
  const [mobileNumber, setMobileNumber] = useState('9820144521');
  const [operator, setOperator] = useState('Reliance Jio');
  const [circle, setCircle] = useState('Mumbai & Maharashtra');
  const [planType, setPlanType] = useState<'PREPAID' | 'POSTPAID'>('PREPAID');
  const [rechargeAmount, setRechargeAmount] = useState('719');
  const [rechargeSuccess, setRechargeSuccess] = useState<{ referenceId: string; amount: number } | null>(null);
  const [isRecharging, setIsRecharging] = useState(false);

  const dueBills = bills.filter(b => b.status === 'DUE');
  const paidBills = bills.filter(b => b.status === 'PAID');

  const handleOpenCategory = (cat: typeof BILL_CATEGORIES[0]) => {
    // Pick an existing bill or create a dynamic one
    const existing = bills.find(b => b.category === cat.id);
    if (existing) {
      setSelectedBillToPay(existing);
    } else {
      setSelectedBillToPay({
        id: `bill-dyn-${Date.now()}`,
        serviceName: cat.label,
        category: cat.id as any,
        provider: cat.providers[0] || 'State Utility Board',
        consumerNumber: 'CON-9842104',
        dueDate: '15 Nov 2026',
        amount: 850.0,
        status: 'DUE',
        autoPayEnabled: false,
        iconName: cat.icon,
      });
    }
  };

  const handleRechargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecharging(true);
    announce(`Executing ${operator} recharge of ${formatCurrency(Number(rechargeAmount))}...`);

    try {
      const res = await executeRecharge({
        mobileNumber,
        operator,
        circle,
        planType,
        amount: Number(rechargeAmount),
      });

      setRechargeSuccess({
        referenceId: res.referenceId,
        amount: Number(rechargeAmount),
      });
      announce(`Mobile recharge successful! Ref: ${res.referenceId}`);
    } catch (err: any) {
      alert(err.message || 'Recharge failed.');
    } finally {
      setIsRecharging(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B78] tracking-tight">
          Bill Payments & Recharge
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1">
          Pay your bills, recharge, and stay connected — all in one place.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#DCE8FA] gap-8 text-sm font-semibold">
        {[
          { id: 'BILLS', label: 'Bill Payments', count: dueBills.length },
          { id: 'RECHARGE', label: 'Mobile Recharge', count: undefined },
          { id: 'MY_BILLS', label: 'My Bills & History', count: paidBills.length },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id as any);
              announce(`Switched to ${tab.label}`);
            }}
            className={`pb-3.5 relative transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'text-[#1458F5] font-bold'
                : 'text-[#64748B] hover:text-[#102451]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] px-2 py-0.2 rounded-full font-bold ${
                  activeTab === tab.id
                    ? 'bg-[#EDF5FF] text-[#1458F5]'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1458F5] rounded-full"
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: BILL PAYMENTS */}
      {activeTab === 'BILLS' && (
        <div className="space-y-10">
          {/* Bills Due Soon Panel */}
          {dueBills.length > 0 && (
            <section aria-labelledby="bills-due-heading">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h2 id="bills-due-heading" className="text-base font-bold text-[#082B78]">
                    Bills Due Soon ({dueBills.length})
                  </h2>
                </div>
                <span className="text-xs text-[#64748B]">Pay before due date to avoid late fees</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dueBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="p-5 bg-white rounded-2xl border border-amber-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            Due by {bill.dueDate}
                          </span>
                          <h3 className="text-sm font-bold text-[#102451] mt-2">{bill.serviceName}</h3>
                          <p className="text-xs text-[#64748B]">{bill.provider}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#EDF5FF] text-[#1458F5] flex items-center justify-center shrink-0 border border-[#DCE8FA]">
                          <Zap className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="my-4">
                        <span className="text-[11px] text-[#64748B] block">Amount Due</span>
                        <div className="text-2xl font-extrabold text-[#082B78] tabular-nums font-mono">
                          {formatCurrency(bill.amount)}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#DCE8FA] flex items-center justify-between">
                      <span className="text-[11px] text-[#64748B] font-mono">
                        {bill.consumerNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedBillToPay(bill)}
                        className="px-4 py-2 bg-[#1458F5] hover:bg-[#082B78] text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Pay Grid (12 Services) */}
          <section aria-labelledby="quick-pay-heading">
            <h2 id="quick-pay-heading" className="text-base font-bold text-[#082B78] mb-4">
              Bharat BillPay (BBPS) Utility Categories
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {BILL_CATEGORIES.map((cat) => {
                const IconComp = CATEGORY_ICONS[cat.icon] || MoreHorizontal;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleOpenCategory(cat)}
                    className="p-4 bg-white rounded-2xl border border-[#DCE8FA] shadow-xs hover:shadow-md hover:border-[#1458F5] text-center flex flex-col items-center justify-center transition-all group focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#EDF5FF] group-hover:bg-[#1458F5] text-[#1458F5] group-hover:text-white flex items-center justify-center mb-2.5 transition-all">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#102451] group-hover:text-[#1458F5] transition-colors leading-tight">
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-[#64748B] mt-0.5">
                      {cat.providers.length} billers
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Auto Pay Banner */}
          <section aria-labelledby="autopay-banner-heading">
            <div className="bg-[#EDF5FF] border border-[#DCE8FA] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white text-[#1458F5] flex items-center justify-center border border-[#DCE8FA] shadow-2xs shrink-0">
                  <CalendarClock className="w-7 h-7" />
                </div>
                <div>
                  <h3 id="autopay-banner-heading" className="text-lg font-bold text-[#082B78]">
                    Never miss a bill. Keep your payments on time.
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5 max-w-xl">
                    Configure recurring auto-debit with custom maximum spending caps and guaranteed 24-hour advance SMS notifications.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAutoPayOpen(true)}
                className="px-6 py-2.5 bg-[#1458F5] hover:bg-[#082B78] text-white rounded-xl text-xs font-bold transition-all shadow-xs whitespace-nowrap shrink-0"
              >
                Set Up AutoPay
              </button>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: MOBILE RECHARGE */}
      {activeTab === 'RECHARGE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Recharge Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DCE8FA] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#082B78]">Mobile & DTH Recharge</h2>

            {rechargeSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Recharge Successful!</span>
                </div>
                <p className="text-emerald-700">
                  Recharge of {formatCurrency(rechargeSuccess.amount)} for {mobileNumber} processed.
                </p>
                <div className="font-mono text-[11px] text-emerald-900 font-bold">
                  Ref ID: {rechargeSuccess.referenceId}
                </div>
              </div>
            )}

            <form onSubmit={handleRechargeSubmit} className="space-y-4 text-xs">
              {/* Prepaid / Postpaid toggle */}
              <div className="flex gap-2 p-1 bg-[#F5F8FF] rounded-xl border border-[#DCE8FA]">
                <button
                  type="button"
                  onClick={() => setPlanType('PREPAID')}
                  className={`flex-1 py-1.5 font-bold rounded-lg transition-colors ${
                    planType === 'PREPAID' ? 'bg-white text-[#1458F5] shadow-xs' : 'text-[#64748B]'
                  }`}
                >
                  Prepaid
                </button>
                <button
                  type="button"
                  onClick={() => setPlanType('POSTPAID')}
                  className={`flex-1 py-1.5 font-bold rounded-lg transition-colors ${
                    planType === 'POSTPAID' ? 'bg-white text-[#1458F5] shadow-xs' : 'text-[#64748B]'
                  }`}
                >
                  Postpaid
                </button>
              </div>

              <div>
                <label className="block font-bold text-[#102451] mb-1">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] font-bold">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-12 pr-3 py-2.5 bg-[#F5F8FF] border border-[#DCE8FA] rounded-xl font-mono text-sm text-[#102451]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#102451] mb-1">Telecom Operator</label>
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F8FF] border border-[#DCE8FA] rounded-xl text-[#102451]"
                  >
                    <option>Reliance Jio</option>
                    <option>Bharti Airtel</option>
                    <option>Vodafone Idea (Vi)</option>
                    <option>BSNL Mobile</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#102451] mb-1">Telecom Circle</label>
                  <select
                    value={circle}
                    onChange={(e) => setCircle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F8FF] border border-[#DCE8FA] rounded-xl text-[#102451]"
                  >
                    <option>Mumbai & Maharashtra</option>
                    <option>Delhi & NCR</option>
                    <option>Karnataka</option>
                    <option>Tamil Nadu</option>
                    <option>West Bengal & Kolkata</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#102451] mb-1">Recharge Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#082B78]">₹</span>
                  <input
                    type="number"
                    required
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-[#F5F8FF] border border-[#DCE8FA] rounded-xl font-mono text-base font-extrabold text-[#082B78]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isRecharging}
                className="w-full py-3 bg-[#1458F5] hover:bg-[#082B78] text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Recharge Now ({formatCurrency(Number(rechargeAmount))})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: Suggested Plans Grid */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-base font-bold text-[#082B78]">
              Recommended Plans for {operator}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RECHARGE_PLANS.map((plan) => (
                <div
                  key={plan.amount}
                  onClick={() => {
                    setRechargeAmount(plan.amount.toString());
                    announce(`Selected plan ₹${plan.amount}`);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    rechargeAmount === plan.amount.toString()
                      ? 'bg-[#EDF5FF] border-[#1458F5] shadow-xs'
                      : 'bg-white border-[#DCE8FA] hover:bg-[#F5F8FF]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl font-extrabold text-[#082B78] font-mono tabular-nums">
                        ₹{plan.amount}
                      </span>
                      {plan.popular && (
                        <span className="text-[10px] uppercase font-bold text-[#1458F5] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4 text-xs font-semibold text-[#102451] mb-2">
                      <span>Val: {plan.validity}</span>
                      <span>Data: {plan.data}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-snug">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#DCE8FA] flex justify-end">
                    <span className="text-xs font-bold text-[#1458F5]">Select Plan →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MY BILLS & HISTORY */}
      {activeTab === 'MY_BILLS' && (
        <div className="bg-white rounded-2xl border border-[#DCE8FA] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#082B78]">Paid Bills & Payment Receipts</h2>
          <div className="divide-y divide-[#DCE8FA]">
            {paidBills.length > 0 ? (
              paidBills.map((b) => (
                <div key={b.id} className="py-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#102451] text-sm">{b.serviceName}</h4>
                      <p className="text-[#64748B]">{b.provider} · CA: {b.consumerNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-[#082B78] text-sm font-mono tabular-nums">
                      {formatCurrency(b.amount)}
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      Settled via BBPS
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-[#64748B]">
                No bills settled yet in this session. Pay a due bill above to see receipts here!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bill Pay Modal */}
      <BillPayModal
        bill={selectedBillToPay}
        isOpen={!!selectedBillToPay}
        onClose={() => setSelectedBillToPay(null)}
      />

      {/* AutoPay Modal */}
      <AutoPayModal
        isOpen={isAutoPayOpen}
        onClose={() => setIsAutoPayOpen(false)}
      />
    </div>
  );
};
