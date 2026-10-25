import React from 'react';
import { X, Keyboard, Check } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isKeyboardGuideOpen, setIsKeyboardGuideOpen } = useAccessibility();

  if (!isKeyboardGuideOpen) return null;

  const shortcuts = [
    { key: 'Tab', action: 'Move forward to the next interactive button or input' },
    { key: 'Shift + Tab', action: 'Move backward to the previous element' },
    { key: 'Enter / Space', action: 'Activate current button, link, or toggle switch' },
    { key: 'Escape (Esc)', action: 'Close any active modal, dialog, or drawer' },
    { key: '/', action: 'Quickly open search across all banking services' },
    { key: 'Alt + V', action: 'Navigate directly to Voice Banking & Accessibility Center' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#102451]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts & Accessibility Guide"
      onClick={() => setIsKeyboardGuideOpen(false)}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#DCE8FA] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#DCE8FA] flex items-center justify-between bg-[#F5F8FF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EDF5FF] text-[#1458F5] flex items-center justify-center border border-[#DCE8FA]">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#082B78]">Keyboard Accessibility Guide</h3>
              <p className="text-xs text-[#64748B]">Navigate SBI NETRA without a mouse or pointer</p>
            </div>
          </div>
          <button
            onClick={() => setIsKeyboardGuideOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white text-[#64748B] hover:text-[#102451]"
            aria-label="Close keyboard shortcuts dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-xs text-[#102451] leading-relaxed">
            SBI NETRA is engineered to conform strictly to WCAG 2.1 AA keyboard standards. Every control has visible focus rings and logical tab order.
          </p>

          <div className="divide-y divide-[#DCE8FA] border border-[#DCE8FA] rounded-xl overflow-hidden">
            {shortcuts.map((sc, i) => (
              <div key={i} className="flex items-center justify-between p-3 text-xs bg-white hover:bg-[#F5F8FF]">
                <span className="text-[#64748B]">{sc.action}</span>
                <kbd className="px-2.5 py-1 bg-[#EDF5FF] text-[#082B78] font-mono font-semibold rounded border border-[#DCE8FA] shrink-0 ml-3">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="bg-[#EDF5FF] p-3 rounded-xl border border-[#DCE8FA] text-xs text-[#082B78] flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Screen readers (NVDA, JAWS, VoiceOver, TalkBack) will announce form labels, balance amounts, and transaction state changes automatically.
            </span>
          </div>
        </div>

        <div className="p-4 bg-[#F5F8FF] border-t border-[#DCE8FA] flex justify-end">
          <button
            onClick={() => setIsKeyboardGuideOpen(false)}
            className="px-4 py-2 bg-[#1458F5] text-white rounded-lg text-xs font-semibold hover:bg-[#082B78]"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
