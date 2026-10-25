import React, { createContext, useContext, useState, useEffect } from 'react';
import { BankAccount, Transaction, Beneficiary, BillItem } from '../types';
import { INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS, INITIAL_BENEFICIARIES, INITIAL_BILLS } from '../data/mockData';

export interface TransferParams {
  sourceAccountId: string;
  recipient: {
    name: string;
    accountOrUpi: string;
    bankName?: string;
    ifsc?: string;
  };
  amount: number;
  note?: string;
  transferMethod: 'UPI' | 'IMPS' | 'NEFT' | 'RTGS';
}

export interface TransferResult {
  success: boolean;
  referenceId: string;
  timestamp: string;
  amount: number;
  recipientName: string;
  recipientAccount: string;
  method: string;
  sourceAccountMasked: string;
  remainingBalance: number;
}

export interface RechargeParams {
  mobileNumber: string;
  operator: string;
  circle: string;
  planType: 'PREPAID' | 'POSTPAID';
  amount: number;
  dataDescription?: string;
}

interface BankingContextType {
  accounts: BankAccount[];
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
  bills: BillItem[];
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;
  selectedAccount: BankAccount | null;
  setSelectedAccount: (acc: BankAccount | null) => void;
  executeTransfer: (params: TransferParams) => Promise<TransferResult>;
  payBill: (billId: string, amount: number, sourceAccountId: string) => Promise<{ success: boolean; referenceId: string; billTitle: string }>;
  executeRecharge: (params: RechargeParams) => Promise<{ success: boolean; referenceId: string }>;
  toggleAutoPay: (billId: string) => void;
  addBeneficiary: (ben: Omit<Beneficiary, 'id' | 'avatarColor' | 'initials'>) => Beneficiary;
  formatCurrency: (amount: number, masked?: boolean) => string;
  activeNotificationsCount: number;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    try {
      const saved = localStorage.getItem('sbi_netra_accounts');
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('sbi_netra_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    try {
      const saved = localStorage.getItem('sbi_netra_beneficiaries');
      return saved ? JSON.parse(saved) : INITIAL_BENEFICIARIES;
    } catch {
      return INITIAL_BENEFICIARIES;
    }
  });

  const [bills, setBills] = useState<BillItem[]>(() => {
    try {
      const saved = localStorage.getItem('sbi_netra_bills');
      return saved ? JSON.parse(saved) : INITIAL_BILLS;
    } catch {
      return INITIAL_BILLS;
    }
  });

  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sbi_netra_accounts', JSON.stringify(accounts));
    } catch { /* ignore */ }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('sbi_netra_transactions', JSON.stringify(transactions));
    } catch { /* ignore */ }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('sbi_netra_beneficiaries', JSON.stringify(beneficiaries));
    } catch { /* ignore */ }
  }, [beneficiaries]);

  useEffect(() => {
    try {
      localStorage.setItem('sbi_netra_bills', JSON.stringify(bills));
    } catch { /* ignore */ }
  }, [bills]);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(prev => !prev);
  };

  const formatCurrency = (amount: number, forceMasked = false): string => {
    if (forceMasked || !isBalanceVisible) {
      return '₹ ••••••';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const executeTransfer = async (params: TransferParams): Promise<TransferResult> => {
    return new Promise((resolve, reject) => {
      // Simulate network verification latency
      setTimeout(() => {
        const sourceAcc = accounts.find(a => a.id === params.sourceAccountId) || accounts[0];

        if (sourceAcc.balance < params.amount) {
          reject(new Error('Insufficient balance in selected account.'));
          return;
        }

        const newBalance = sourceAcc.balance - params.amount;
        const refId = `TXN${Math.floor(100000000000 + Math.random() * 900000000000)}`;
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        // Update accounts
        setAccounts(prev =>
          prev.map(acc => (acc.id === sourceAcc.id ? { ...acc, balance: newBalance } : acc))
        );

        // Record transaction
        const newTx: Transaction = {
          id: `tx-${Date.now()}`,
          date: dateStr,
          time: timeStr,
          description: `Transfer to ${params.recipient.name} via ${params.transferMethod}${params.note ? ` (${params.note})` : ''}`,
          category: 'TRANSFER',
          type: 'DEBIT',
          amount: params.amount,
          balanceAfter: newBalance,
          status: 'COMPLETED',
          referenceId: refId,
          recipientOrSender: params.recipient.name,
          accountId: sourceAcc.id,
        };

        setTransactions(prev => [newTx, ...prev]);

        resolve({
          success: true,
          referenceId: refId,
          timestamp: `${dateStr} at ${timeStr}`,
          amount: params.amount,
          recipientName: params.recipient.name,
          recipientAccount: params.recipient.accountOrUpi,
          method: params.transferMethod,
          sourceAccountMasked: sourceAcc.maskedNumber,
          remainingBalance: newBalance,
        });
      }, 700);
    });
  };

  const payBill = async (billId: string, amount: number, sourceAccountId: string): Promise<{ success: boolean; referenceId: string; billTitle: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sourceAcc = accounts.find(a => a.id === sourceAccountId) || accounts[0];
        if (sourceAcc.balance < amount) {
          reject(new Error('Insufficient funds to pay bill.'));
          return;
        }

        const targetBill = bills.find(b => b.id === billId);
        const billTitle = targetBill ? targetBill.serviceName : 'Utility Bill';
        const newBalance = sourceAcc.balance - amount;
        const refId = `BBPS${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        // Update accounts
        setAccounts(prev =>
          prev.map(acc => (acc.id === sourceAcc.id ? { ...acc, balance: newBalance } : acc))
        );

        // Mark bill as paid
        setBills(prev =>
          prev.map(b => (b.id === billId ? { ...b, status: 'PAID' } : b))
        );

        // Record transaction
        const newTx: Transaction = {
          id: `tx-${Date.now()}`,
          date: dateStr,
          time: timeStr,
          description: `Bill Payment - ${billTitle}`,
          category: 'BILL_PAY',
          type: 'DEBIT',
          amount: amount,
          balanceAfter: newBalance,
          status: 'COMPLETED',
          referenceId: refId,
          recipientOrSender: targetBill?.provider || 'Bharat BillPay',
          accountId: sourceAcc.id,
        };

        setTransactions(prev => [newTx, ...prev]);

        resolve({
          success: true,
          referenceId: refId,
          billTitle,
        });
      }, 700);
    });
  };

  const executeRecharge = async (params: RechargeParams): Promise<{ success: boolean; referenceId: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sourceAcc = accounts[0];
        if (sourceAcc.balance < params.amount) {
          reject(new Error('Insufficient balance for recharge.'));
          return;
        }

        const newBalance = sourceAcc.balance - params.amount;
        const refId = `RCG${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        setAccounts(prev =>
          prev.map(acc => (acc.id === sourceAcc.id ? { ...acc, balance: newBalance } : acc))
        );

        const newTx: Transaction = {
          id: `tx-${Date.now()}`,
          date: dateStr,
          time: timeStr,
          description: `${params.operator} Recharge - ${params.mobileNumber}`,
          category: 'RECHARGE',
          type: 'DEBIT',
          amount: params.amount,
          balanceAfter: newBalance,
          status: 'COMPLETED',
          referenceId: refId,
          recipientOrSender: params.operator,
          accountId: sourceAcc.id,
        };

        setTransactions(prev => [newTx, ...prev]);

        resolve({
          success: true,
          referenceId: refId,
        });
      }, 600);
    });
  };

  const toggleAutoPay = (billId: string) => {
    setBills(prev =>
      prev.map(b => (b.id === billId ? { ...b, autoPayEnabled: !b.autoPayEnabled } : b))
    );
  };

  const addBeneficiary = (ben: Omit<Beneficiary, 'id' | 'avatarColor' | 'initials'>): Beneficiary => {
    const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-teal-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const initials = ben.name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newBen: Beneficiary = {
      ...ben,
      id: `ben-${Date.now()}`,
      avatarColor: randomColor,
      initials,
    };

    setBeneficiaries(prev => [newBen, ...prev]);
    return newBen;
  };

  const activeNotificationsCount = bills.filter(b => b.status === 'DUE').length;

  return (
    <BankingContext.Provider
      value={{
        accounts,
        transactions,
        beneficiaries,
        bills,
        isBalanceVisible,
        toggleBalanceVisibility,
        selectedAccount,
        setSelectedAccount,
        executeTransfer,
        payBill,
        executeRecharge,
        toggleAutoPay,
        addBeneficiary,
        formatCurrency,
        activeNotificationsCount,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = (): BankingContextType => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
