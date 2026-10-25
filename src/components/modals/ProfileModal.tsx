import React from 'react';
import { X, User, ShieldCheck, CheckCircle2, Phone, Mail, MapPin, Sliders, LogOut } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useNavigate } from 'react-router-dom';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { settings, setTextSize, toggleHighContrast } = useAccessibility();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#102451]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Profile and Settings"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#DCE8FA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#082B78] to-[#1458F5] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white text-[#082B78] flex items-center justify-center font-bold text-xl shadow-md border-2 border-white/30">
              SS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">Sunita Sharma</h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[11px] font-semibold border border-emerald-400/30">
                  <CheckCircle2 className="w-3 h-3" /> Full KYC
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">CIF No: 88492019401 · Net Banking User</p>
              <p className="text-xs text-blue-100 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> Nariman Point Branch, Mumbai
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
              Registered Profile Data (Simulated)
            </h4>
            <div className="bg-[#F5F8FF] rounded-xl p-3.5 border border-[#DCE8FA] space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#DCE8FA]/60">
                <span className="text-[#64748B] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Registered Mobile</span>
                <span className="font-semibold text-[#102451]">+91 98••• ••521</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#DCE8FA]/60">
                <span className="text-[#64748B] flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email ID</span>
                <span className="font-semibold text-[#102451]">suni•••@gmail.com</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#64748B] flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> PAN Card</span>
                <span className="font-semibold text-[#102451]">ABCPS••••K</span>
              </div>
            </div>
          </div>

          {/* Quick Accessibility Settings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#1458F5]" /> Accessibility Preferences
              </h4>
              <button
                onClick={() => {
                  onClose();
                  navigate('/help');
                }}
                className="text-xs text-[#1458F5] hover:underline font-semibold"
              >
                All Voice & A11y Tools
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#F5F8FF] border border-[#DCE8FA] rounded-xl">
                <span className="text-[#64748B] block mb-1.5">Text Size</span>
                <div className="flex gap-1">
                  {(['normal', 'large', 'larger'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => setTextSize(size)}
                      className={`flex-1 py-1 rounded-md text-xs font-bold border transition-colors ${
                        settings.textSize === size
                          ? 'bg-[#1458F5] text-white border-[#1458F5]'
                          : 'bg-white text-[#102451] border-[#DCE8FA] hover:bg-slate-50'
                      }`}
                    >
                      {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#F5F8FF] border border-[#DCE8FA] rounded-xl flex flex-col justify-between">
                <span className="text-[#64748B] block mb-1.5">Contrast</span>
                <button
                  onClick={toggleHighContrast}
                  className={`w-full py-1 px-2 rounded-md text-xs font-bold border transition-colors ${
                    settings.highContrast
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-[#102451] border-[#DCE8FA] hover:bg-slate-50'
                  }`}
                >
                  {settings.highContrast ? 'High Contrast ON' : 'Standard View'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#DCE8FA] flex items-center justify-between">
            <span className="text-[11px] text-[#64748B]">Session: Demo Active</span>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-rose-50"
            >
              <LogOut className="w-3.5 h-3.5" /> Reset Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
