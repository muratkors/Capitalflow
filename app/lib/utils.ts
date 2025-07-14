
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths);
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;
  
  return numerator / denominator;
}

export function calculateTotalInterest(
  principal: number,
  monthlyPayment: number,
  termMonths: number
): number {
  return (monthlyPayment * termMonths) - principal;
}

export function generateDealNumber(): string {
  const prefix = 'CF';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function getProductTypeLabel(productType: string): string {
  switch (productType) {
    case 'LINE_OF_CREDIT':
      return 'Line of Credit';
    case 'EQUIPMENT_FINANCE':
      return 'Equipment Finance';
    case 'TERM_LOAN':
      return 'Term Loan';
    default:
      return productType;
  }
}

export function getDealStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'CLOSED':
      return 'secondary';
    case 'DEFAULTED':
      return 'destructive';
    case 'PAID_OFF':
      return 'info';
    default:
      return 'secondary';
  }
}

export function getTransactionTypeColor(type: string): string {
  switch (type) {
    case 'PAYMENT':
      return 'text-red-600';
    case 'DISBURSEMENT':
      return 'text-green-600';
    case 'FEE':
      return 'text-orange-600';
    case 'INTEREST':
      return 'text-blue-600';
    case 'REFUND':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
