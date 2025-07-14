
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  ArrowUpRight, 
  ArrowDownLeft,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Download,
  Calculator,
  TrendingUp,
  Building2,
  CreditCard
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TransactionWithDeal } from "@/lib/types";
import { formatCurrency, formatDate, getTransactionTypeColor } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionWithDeal[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionWithDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<string>("30");

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, filterType, filterStatus, searchTerm, dateRange]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // Mock data for demo
      generateMockTransactions();
    } finally {
      setLoading(false);
    }
  };

  const generateMockTransactions = () => {
    const mockTransactions: TransactionWithDeal[] = [];
    const transactionTypes = ['PAYMENT', 'DISBURSEMENT', 'FEE', 'INTEREST', 'PRINCIPAL'];
    const statuses = ['COMPLETED', 'PENDING', 'FAILED'];
    
    for (let i = 0; i < 50; i++) {
      const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      mockTransactions.push({
        id: `txn-${i}`,
        userId: "mock-user",
        dealId: `deal-${i % 10}`,
        transactionType: type as any,
        amount: Math.random() * 10000 + 100 as any,
        description: `${type.toLowerCase()} transaction ${i + 1}`,
        merchantName: `Merchant ${i + 1}`,
        category: ['Business', 'Equipment', 'Operating', 'Interest'][Math.floor(Math.random() * 4)],
        transactionDate: date,
        status: status as any,
        referenceNumber: `REF${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        createdAt: date,
        updatedAt: date,
        deal: {
          id: `deal-${i % 10}`,
          dealName: `Deal ${i % 10 + 1}`,
          productType: ['LINE_OF_CREDIT', 'EQUIPMENT_FINANCE', 'TERM_LOAN'][Math.floor(Math.random() * 3)] as any,
        } as any,
      });
    }
    
    setTransactions(mockTransactions);
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Date range filter
    if (dateRange !== "all") {
      const daysAgo = parseInt(dateRange);
      const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(txn => new Date(txn.transactionDate) >= cutoffDate);
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter(txn => txn.transactionType === filterType);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(txn => txn.status === filterStatus);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(txn => 
        txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.merchantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'DISBURSEMENT':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'FEE':
        return <DollarSign className="h-4 w-4 text-orange-500" />;
      case 'INTEREST':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'PRINCIPAL':
        return <Building2 className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const calculateSummary = () => {
    const totalInflow = filteredTransactions
      .filter(txn => ['DISBURSEMENT', 'REFUND'].includes(txn.transactionType))
      .reduce((sum, txn) => sum + Number(txn.amount), 0);
    
    const totalOutflow = filteredTransactions
      .filter(txn => ['PAYMENT', 'FEE', 'INTEREST', 'PRINCIPAL'].includes(txn.transactionType))
      .reduce((sum, txn) => sum + Number(txn.amount), 0);
    
    const netFlow = totalInflow - totalOutflow;
    
    return { totalInflow, totalOutflow, netFlow };
  };

  const summary = calculateSummary();

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-32">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-600 mt-1">View your transaction history and loan estimates</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Calculator className="h-4 w-4 mr-2" />
              Loan Calculator
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <ArrowDownLeft className="h-5 w-5 mr-2 text-green-600" />
                Total Inflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.totalInflow)}
              </div>
              <p className="text-sm text-gray-600">
                Disbursements & refunds
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <ArrowUpRight className="h-5 w-5 mr-2 text-red-600" />
                Total Outflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.totalOutflow)}
              </div>
              <p className="text-sm text-gray-600">
                Payments & fees
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Net Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.netFlow)}
              </div>
              <p className="text-sm text-gray-600">
                {filteredTransactions.length} transactions
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="PAYMENT">Payment</SelectItem>
              <SelectItem value="DISBURSEMENT">Disbursement</SelectItem>
              <SelectItem value="FEE">Fee</SelectItem>
              <SelectItem value="INTEREST">Interest</SelectItem>
              <SelectItem value="PRINCIPAL">Principal</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div variants={itemVariants}>
          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-600">Try adjusting your filters or check back later</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  Showing {filteredTransactions.length} transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      variants={itemVariants}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            {getTransactionIcon(transaction.transactionType)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">
                              {transaction.description}
                            </h3>
                            <Badge variant={transaction.status === 'COMPLETED' ? 'success' : 
                                           transaction.status === 'PENDING' ? 'warning' : 'destructive'}>
                              {transaction.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-500">
                              {formatDate(transaction.transactionDate)}
                            </p>
                            {transaction.merchantName && (
                              <p className="text-sm text-gray-500">
                                {transaction.merchantName}
                              </p>
                            )}
                            {transaction.deal && (
                              <p className="text-sm text-gray-500">
                                {transaction.deal.dealName}
                              </p>
                            )}
                            {transaction.referenceNumber && (
                              <p className="text-sm text-gray-500">
                                Ref: {transaction.referenceNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${getTransactionTypeColor(transaction.transactionType)}`}>
                          {['PAYMENT', 'FEE', 'INTEREST', 'PRINCIPAL'].includes(transaction.transactionType) ? '-' : '+'}
                          {formatCurrency(Number(transaction.amount))}
                        </p>
                        <p className="text-sm text-gray-500 uppercase">
                          {transaction.transactionType.replace('_', ' ')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
