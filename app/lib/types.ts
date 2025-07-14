
import { Deal, Transaction, Notification, Statement, Prepayment, Application } from "@prisma/client";

export type { Deal, Transaction, Notification, Statement, Prepayment, Application };

export interface UserProfile {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  companyName?: string | null;
  industry?: string | null;
  phoneNumber?: string | null;
}

export interface DashboardData {
  totalBalance: number;
  totalCredit: number;
  totalMonthlyPayment: number;
  activeDeals: number;
  recentTransactions: Transaction[];
  upcomingPayments: Deal[];
  notifications: Notification[];
  deals: Deal[];
}

export interface DealWithTransactions extends Deal {
  transactions: Transaction[];
}

export interface TransactionWithDeal extends Transaction {
  deal?: Deal | null;
}

export interface PrepaymentWithDeal extends Prepayment {
  deal: Deal;
}

export interface ProductSummary {
  type: string;
  count: number;
  totalAmount: number;
  averageRate: number;
}

export interface FinancialMetrics {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  cashFlow: number;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

export interface LoanEstimate {
  loanAmount: number;
  termMonths: number;
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export interface StatementData {
  month: number;
  year: number;
  totalCredits: number;
  totalDebits: number;
  netAmount: number;
  transactionCount: number;
}
