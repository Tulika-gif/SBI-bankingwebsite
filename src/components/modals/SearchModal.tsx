import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, ArrowUpRight, Zap, CreditCard, Send, ShieldCheck } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEARCH_ITEMS = [
  { title: 'Check Account Balance', category: 'Accounts', path: '/accounts', icon: CreditCard, query: 'balance check savings current' },
  { title: 'Send Money / UPI Transfer', category: 'Transfers', path: '/transfer', icon: Send, query: 'transfer send money neft imps upi beneficiary' },
  { title: 'Pay Electricity Bill', category: 'Payments', path: '/payments', icon: Zap, query: 'electricity bill bescom tata power utility' },
  { title: 'Mobile Recharge (Prepaid/Postpaid)', category: 'Payments', path: '/payments', icon: Zap, query: 'recharge mobile jio airtel vi phone' },
  { title: 'SBI Debit Card Services & Limits', category: 'Cards', path: '/cards-loans', icon: CreditCard, query: 'debit card pin block limit' },
  { title: 'Apply for SimplySAVE Credit Card', category: 'Cards', path: '/cards-loans', icon: CreditCard, query: 'credit card apply cashback aurum rewards' },
  { title: 'Home Loan & Personal Loan EMI Calculator', category: 'Loans', path: '/cards-loans', icon: CreditCard, query: 'loan home personal car interest emi' },
  { title: 'Voice Banking Assistant & Multi-Language Help', category: 'Accessibility', path: '/help', icon: ShieldCheck, query: 'voice assistant speech hindi english netra accessibility speak' },
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && !isOpen) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = SEARCH_ITEMS.filter(
    item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#102451]/50 backdrop-blur-xs flex items-start justify-center pt-16 px-4 p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Search banking services"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-[#DCE8FA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-[#DCE8FA] gap-3">
          <Search className="w-5 h-5 text-[#1458F5] shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search services, transfers, bills, cards or voice commands..."
            className="w-full text-base bg-transparent text-[#102451] placeholder:text-[#64748B] focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-[#64748B] hover:text-[#102451] rounded-md"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-[#64748B] hover:text-[#102451] bg-[#F5F8FF] rounded border border-[#DCE8FA]"
          >
            ESC
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#EDF5FF] text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F5F8FF] group-hover:bg-white text-[#1458F5] flex items-center justify-center border border-[#DCE8FA]">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#102451] group-hover:text-[#1458F5]">
                        {item.title}
                      </div>
                      <div className="text-xs text-[#64748B]">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#1458F5] transition-transform group-hover:translate-x-1" />
                </button>
              );
            })
          ) : (
            <div className="py-12 text-center text-sm text-[#64748B]">
              No services match "{searchTerm}". Try "transfer", "bill", "balance", or "voice".
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-[#F5F8FF] border-t border-[#DCE8FA] flex items-center justify-between text-xs text-[#64748B]">
          <span>Tip: Press <strong>Esc</strong> to close</span>
          <span className="text-[#1458F5] font-medium">Accessible Navigation</span>
        </div>
      </div>
    </div>
  );
};
