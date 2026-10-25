import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../context/BankingContext';
import { useAccessibility } from '../context/AccessibilityContext';

export interface VoiceAssistantResponse {
  spokenText: string;
  displayTitle: string;
  displayContent: string;
  actionTaken?: string;
  dataSnippet?: any;
}

// Window declaration for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useVoiceBanking = () => {
  const navigate = useNavigate();
  const { accounts, transactions, formatCurrency } = useBanking();
  const { announce } = useAccessibility();

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState<VoiceAssistantResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const speakText = useCallback((text: string, lang = selectedLanguage) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }, [selectedLanguage]);

  const processCommand = useCallback((commandText: string) => {
    setIsProcessing(true);
    const cleaned = commandText.trim().toLowerCase();

    // Default response container
    let response: VoiceAssistantResponse;

    if (cleaned.includes('balance') || cleaned.includes('how much money') || cleaned.includes('खाता') || cleaned.includes('बैलेंस')) {
      const savings = accounts.find(a => a.type === 'SAVINGS');
      const current = accounts.find(a => a.type === 'CURRENT');
      const total = accounts.reduce((acc, a) => acc + a.balance, 0);

      const spoken = `Your total available balance across all accounts is ${formatCurrency(total)}. Savings account has ${formatCurrency(savings?.balance || 0)}, and Current account has ${formatCurrency(current?.balance || 0)}.`;
      response = {
        spokenText: spoken,
        displayTitle: 'Account Balance Overview',
        displayContent: `Total Balance: ${formatCurrency(total)}`,
        dataSnippet: {
          accounts: accounts.map(a => ({ name: a.name, balance: formatCurrency(a.balance), number: a.maskedNumber })),
        },
      };
      speakText(spoken);
    } else if (cleaned.includes('transaction') || cleaned.includes('recent') || cleaned.includes('statement') || cleaned.includes('लेनदेन')) {
      const recent = transactions.slice(0, 3);
      const topDesc = recent.map(t => `${t.description}: ${formatCurrency(t.amount)}`).join('. ');
      const spoken = `Here are your latest transactions. ${topDesc}.`;

      response = {
        spokenText: spoken,
        displayTitle: 'Recent Transactions',
        displayContent: `Showing last 3 transactions from your active accounts.`,
        dataSnippet: {
          transactions: recent,
        },
      };
      speakText(spoken);
    } else if (cleaned.includes('transfer') || cleaned.includes('send money') || cleaned.includes('भेजें')) {
      const spoken = 'Opening Money Transfer screen. Please select recipient and enter the amount on screen.';
      response = {
        spokenText: spoken,
        displayTitle: 'Navigate: Money Transfer',
        displayContent: 'Transfer screen loaded. For security, please enter and review transaction details on screen.',
        actionTaken: '/transfer',
      };
      speakText(spoken);
      setTimeout(() => navigate('/transfer'), 1200);
    } else if (cleaned.includes('bill') || cleaned.includes('electricity') || cleaned.includes('recharge') || cleaned.includes('बिल') || cleaned.includes('रिचार्ज')) {
      const spoken = 'Navigating to Bill Payments and Utilities. You can pay electricity, water, and recharge your mobile.';
      response = {
        spokenText: spoken,
        displayTitle: 'Navigate: Bill Payments & Recharge',
        displayContent: 'Opening Bharat Bill Payment utilities.',
        actionTaken: '/payments',
      };
      speakText(spoken);
      setTimeout(() => navigate('/payments'), 1200);
    } else if (cleaned.includes('account') || cleaned.includes('fixed deposit') || cleaned.includes('fd') || cleaned.includes('खाते')) {
      const spoken = 'Opening Accounts & Balance screen with detailed statements and settings.';
      response = {
        spokenText: spoken,
        displayTitle: 'Navigate: Accounts & Balance',
        displayContent: 'Opening full accounts directory.',
        actionTaken: '/accounts',
      };
      speakText(spoken);
      setTimeout(() => navigate('/accounts'), 1200);
    } else if (cleaned.includes('card') || cleaned.includes('loan') || cleaned.includes('emi') || cleaned.includes('कार्ड') || cleaned.includes('ऋण')) {
      const spoken = 'Opening Cards and Loans screen where you can explore debit cards, credit options and calculate loan EMIs.';
      response = {
        spokenText: spoken,
        displayTitle: 'Navigate: Cards & Loans',
        displayContent: 'Opening debit card details, credit card rewards and loan calculator.',
        actionTaken: '/cards-loans',
      };
      speakText(spoken);
      setTimeout(() => navigate('/cards-loans'), 1200);
    } else if (cleaned.includes('help') || cleaned.includes('मदद') || cleaned.includes('सहायता')) {
      const spoken = 'I am your SBI NETRA voice assistant. You can say: Check my balance, Show recent transactions, Open money transfer, Pay electricity bill, or Open cards and loans.';
      response = {
        spokenText: spoken,
        displayTitle: 'Voice Commands Help',
        displayContent: 'Available commands: Check balance · Recent transactions · Open transfer · Pay bill · Open accounts · Cards and loans',
      };
      speakText(spoken);
    } else {
      const spoken = `I heard: "${commandText}". You can try saying "Check my balance", "Show recent transactions", or "Open money transfer".`;
      response = {
        spokenText: spoken,
        displayTitle: `Command recognized: "${commandText}"`,
        displayContent: 'Could not match a direct action. Try one of the suggested voice commands.',
      };
      speakText(spoken);
    }

    setLastResponse(response);
    setIsProcessing(false);
  }, [accounts, transactions, formatCurrency, speakText, navigate]);

  const startListening = () => {
    setErrorMessage(null);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition is not supported in this browser. Please use the text input below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        announce('Listening for voice command...');
      };

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        processCommand(speechResult);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. You can still use the text input below to test voice banking!');
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech was detected. Tap the mic to try again.');
        } else {
          setErrorMessage(`Voice recognition encountered: ${event.error}. Use text input as fallback.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setErrorMessage('Could not initialize speech recognition. Use the fallback text input.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch { /* ignore */ }
    }
    setIsListening(false);
  };

  return {
    isListening,
    isProcessing,
    transcript,
    lastResponse,
    errorMessage,
    isSupported,
    selectedLanguage,
    setSelectedLanguage,
    startListening,
    stopListening,
    processCommand,
    speakText,
    setTranscript,
  };
};
