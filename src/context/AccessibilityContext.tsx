import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilitySettings, TextSize } from '../types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  setTextSize: (size: TextSize) => void;
  toggleHighContrast: () => void;
  toggleScreenReaderOptimized: () => void;
  toggleReducedMotion: () => void;
  toggleVoiceFeedback: () => void;
  announce: (message: string) => void;
  isKeyboardGuideOpen: boolean;
  setIsKeyboardGuideOpen: (open: boolean) => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSize: 'normal',
  highContrast: false,
  screenReaderOptimized: false,
  reducedMotion: false,
  voiceFeedback: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('sbi_netra_a11y');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isKeyboardGuideOpen, setIsKeyboardGuideOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem('sbi_netra_a11y', JSON.stringify(settings));
    } catch {
      // Ignore quota errors
    }

    // Apply document classes
    const root = document.documentElement;
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-larger');
    root.classList.add(`text-size-${settings.textSize}`);

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [settings]);

  const setTextSize = (size: TextSize) => {
    setSettings(prev => ({ ...prev, textSize: size }));
    announce(`Text size set to ${size === 'normal' ? 'standard' : size === 'large' ? 'large' : 'extra large'}`);
  };

  const toggleHighContrast = () => {
    setSettings(prev => {
      const next = !prev.highContrast;
      announce(`High contrast ${next ? 'enabled' : 'disabled'}`);
      return { ...prev, highContrast: next };
    });
  };

  const toggleScreenReaderOptimized = () => {
    setSettings(prev => {
      const next = !prev.screenReaderOptimized;
      announce(`Screen reader optimized view ${next ? 'enabled' : 'disabled'}`);
      return { ...prev, screenReaderOptimized: next };
    });
  };

  const toggleReducedMotion = () => {
    setSettings(prev => {
      const next = !prev.reducedMotion;
      announce(`Reduced motion ${next ? 'enabled' : 'disabled'}`);
      return { ...prev, reducedMotion: next };
    });
  };

  const toggleVoiceFeedback = () => {
    setSettings(prev => {
      const next = !prev.voiceFeedback;
      announce(`Voice audio feedback ${next ? 'enabled' : 'disabled'}`);
      return { ...prev, voiceFeedback: next };
    });
  };

  const announce = (message: string) => {
    setAnnouncement(message);
    if (settings.voiceFeedback && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1.0;
        utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback gracefully
      }
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        setTextSize,
        toggleHighContrast,
        toggleScreenReaderOptimized,
        toggleReducedMotion,
        toggleVoiceFeedback,
        announce,
        isKeyboardGuideOpen,
        setIsKeyboardGuideOpen,
      }}
    >
      {children}
      {/* Invisible live region for screen readers */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        id="a11y-announcer"
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
