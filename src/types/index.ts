export type AccountType = 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT';

export interface BankAccount {
  id: string;
  type: AccountType;
  name: string;
  accountNumber: string;
  maskedNumber: string;
  balance: number;
  currency: string;
  branch: string;
  ifsc: string;
  status: 'ACTIVE' | 'DORMANT' | 'MATURING_SOON';
  interestRate?: string;
  maturityDate?: string;
  nomineeRegistered: boolean;
}

export type TransactionType = 'CREDIT' | 'DEBIT';
export type TransactionCategory = 'SALARY' | 'TRANSFER' | 'BILL_PAY' | 'UPI' | 'INVESTMENT' | 'RECHARGE' | 'INTEREST';

export interface Transaction {
  id: string;
  date: string;
  time: string;
  description: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  referenceId: string;
  recipientOrSender?: string;
  accountId: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber?: string;
  maskedAccount?: string;
  bankName?: string;
  ifsc?: string;
  upiId?: string;
  mobileNumber?: string;
  avatarColor: string;
  initials: string;
  type: 'BANK_ACCOUNT' | 'UPI' | 'MOBILE';
  favorite?: boolean;
}

export interface BillItem {
  id: string;
  serviceName: string;
  category: 'ELECTRICITY' | 'WATER' | 'GAS' | 'DTH' | 'MOBILE_POSTPAID' | 'BROADBAND' | 'EDUCATION' | 'INSURANCE' | 'MUNICIPAL';
  provider: string;
  consumerNumber: string;
  dueDate: string;
  amount: number;
  status: 'DUE' | 'PAID' | 'OVERDUE';
  autoPayEnabled?: boolean;
  iconName: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
}

export interface CreditCardProduct {
  id: string;
  name: string;
  tagline: string;
  annualFee: string;
  joiningFee: string;
  keyFeatures: string[];
  rewardsMultiplier: string;
  cardColor: string;
  gradient: string;
  isPopular?: boolean;
}

export interface LoanProduct {
  id: string;
  name: string;
  category: 'PERSONAL' | 'HOME' | 'CAR';
  tagline: string;
  startingRate: string;
  maxTenure: string;
  maxAmount: string;
  processingFee: string;
  features: string[];
}

export type TextSize = 'normal' | 'large' | 'larger';

export interface AccessibilitySettings {
  textSize: TextSize;
  highContrast: boolean;
  screenReaderOptimized: boolean;
  reducedMotion: boolean;
  voiceFeedback: boolean;
}
