import React from 'react';
import { Link } from 'react-router-dom';
import { KeyholeLogo } from './KeyholeLogo';
import { ShieldCheck, Lock, Phone, Eye, HelpCircle } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const Footer: React.FC = () => {
  const { setIsKeyboardGuideOpen } = useAccessibility();

  return (
    <footer className="bg-white border-t border-[#DCE8FA] mt-16 pb-16 lg:pb-8 text-[#102451]">
      {/* Security Advisory Strip */}
      <div className="bg-[#EDF5FF] border-b border-[#DCE8FA] py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-[#082B78]">
            <Lock className="w-4 h-4 text-[#1458F5] shrink-0" />
            <span className="font-semibold">Security Advisory:</span>
            <span>
              SBI NETRA or bank officials will never ask for your PIN, OTP, CVV, or passwords over call, SMS, or email.
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#64748B]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              256-Bit SSL Encrypted
            </span>
            <button
              onClick={() => setIsKeyboardGuideOpen(true)}
              className="text-[#1458F5] hover:underline font-medium flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Keyboard Shortcuts
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Accessibility Promise */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <KeyholeLogo size={32} variant="blue" />
              <span className="text-lg font-bold text-[#082B78]">
                SBI <span className="text-[#1458F5]">NETRA</span>
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Empowering every citizen with voice-guided navigation, screen-reader compatibility, and barrier-free digital financial services.
            </p>
            <div className="text-xs font-semibold text-[#1458F5] flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>WCAG 2.1 AA Compliant Design</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#082B78]">
              Banking Services
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li><Link to="/accounts" className="hover:text-[#1458F5] transition-colors">Accounts & Balance</Link></li>
              <li><Link to="/transfer" className="hover:text-[#1458F5] transition-colors">Instant Money Transfer</Link></li>
              <li><Link to="/payments" className="hover:text-[#1458F5] transition-colors">Bharat Bill Payments (BBPS)</Link></li>
              <li><Link to="/cards-loans" className="hover:text-[#1458F5] transition-colors">Debit & Credit Cards</Link></li>
              <li><Link to="/cards-loans" className="hover:text-[#1458F5] transition-colors">Home & Personal Loans</Link></li>
            </ul>
          </div>

          {/* Col 3: Accessibility & Assistance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#082B78]">
              Accessibility
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li><Link to="/help" className="hover:text-[#1458F5] transition-colors font-semibold text-[#1458F5]">Voice Banking Center</Link></li>
              <li><button onClick={() => setIsKeyboardGuideOpen(true)} className="hover:text-[#1458F5] transition-colors text-left">Keyboard Navigation Guide</button></li>
              <li><Link to="/help" className="hover:text-[#1458F5] transition-colors">Multi-Language Speech Support</Link></li>
              <li><Link to="/help" className="hover:text-[#1458F5] transition-colors">High Contrast & Text Scaling</Link></li>
              <li><a href="#main-content" className="hover:text-[#1458F5] transition-colors">Skip to Main Content</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Grievance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#082B78]">
              Customer Care 24x7
            </h4>
            <div className="space-y-2 text-xs text-[#64748B]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1458F5]" />
                <span className="font-semibold text-[#102451]">1800 11 2211 / 1800 425 3800</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Dedicated national toll-free helpline for senior citizens and differently-abled customers.
              </p>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 bg-[#EDF5FF] text-[#082B78] rounded-sm font-semibold text-[11px] border border-[#DCE8FA]">
                  Digital India & Financial Inclusion
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Mandatory Disclaimers */}
        <div className="mt-10 pt-6 border-t border-[#DCE8FA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="font-semibold text-[#082B78]">
            SBI NETRA | Safe Banking | Digital India | Financial Inclusion
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-500">
            Student prototype — not an official SBI banking service. Inspired by SBI UI/UX principles for educational & accessibility demonstration.
          </div>
        </div>
      </div>
    </footer>
  );
};
