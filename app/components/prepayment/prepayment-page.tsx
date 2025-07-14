
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calculator, 
  FileText, 
  DollarSign, 
  Download,
  Send,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Calendar
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Deal, PrepaymentWithDeal } from "@/lib/types";
import { formatCurrency, formatDate, calculateLoanPayment } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export function PrepaymentPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [prepayments, setPrepayments] = useState<PrepaymentWithDeal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<string>("");
  const [prepaymentAmount, setPrepaymentAmount] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [prepaymentEstimate, setPrepaymentEstimate] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDeal && prepaymentAmount) {
      calculatePrepayment();
    }
  }, [selectedDeal, prepaymentAmount]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        const activeDeals = data.deals?.filter((deal: Deal) => deal.status === "ACTIVE") || [];
        setDeals(activeDeals);
        
        // Mock prepayment data
        generateMockPrepayments();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPrepayments = () => {
    const mockPrepayments: PrepaymentWithDeal[] = [];
    
    for (let i = 0; i < 5; i++) {
      const requestDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const status = ['PENDING', 'APPROVED', 'COMPLETED'][Math.floor(Math.random() * 3)];
      
      mockPrepayments.push({
        id: `prep-${i}`,
        userId: "mock-user",
        dealId: `deal-${i}`,
        requestedAmount: Math.random() * 50000 + 10000 as any,
        currentBalance: Math.random() * 100000 + 20000 as any,
        savingsAmount: Math.random() * 5000 + 1000 as any,
        payoffAmount: Math.random() * 45000 + 15000 as any,
        status: status as any,
        requestDate,
        approvedDate: status === 'APPROVED' ? new Date(requestDate.getTime() + 24 * 60 * 60 * 1000) : null,
        letterGenerated: status === 'APPROVED',
        letterUrl: status === 'APPROVED' ? `/letters/prepayment-${i}.pdf` : null,
        createdAt: requestDate,
        updatedAt: requestDate,
        deal: {
          id: `deal-${i}`,
          dealName: `Business Loan ${i + 1}`,
          productType: ['LINE_OF_CREDIT', 'EQUIPMENT_FINANCE', 'TERM_LOAN'][Math.floor(Math.random() * 3)] as any,
          remainingBalance: Math.random() * 100000 + 20000,
          interestRate: Math.random() * 5 + 3,
          termMonths: 36,
          monthlyPayment: Math.random() * 3000 + 1000,
        } as any,
      });
    }
    
    setPrepayments(mockPrepayments);
  };

  const calculatePrepayment = async () => {
    if (!selectedDeal || !prepaymentAmount) return;
    
    setCalculating(true);
    
    try {
      const deal = deals.find(d => d.id === selectedDeal);
      if (!deal) return;
      
      const amount = parseFloat(prepaymentAmount);
      const currentBalance = Number(deal.remainingBalance);
      const interestRate = Number(deal.interestRate);
      
      // Calculate savings (simplified calculation)
      const remainingTermMonths = Math.ceil(currentBalance / Number(deal.monthlyPayment || 0));
      const totalInterestWithoutPrepayment = (Number(deal.monthlyPayment || 0) * remainingTermMonths) - currentBalance;
      
      const newBalance = currentBalance - amount;
      const newMonthlyPayment = calculateLoanPayment(newBalance, interestRate, remainingTermMonths);
      const newTotalInterest = (newMonthlyPayment * remainingTermMonths) - newBalance;
      
      const interestSavings = totalInterestWithoutPrepayment - newTotalInterest;
      
      setPrepaymentEstimate({
        requestedAmount: amount,
        currentBalance: Number(currentBalance),
        newBalance: Number(newBalance),
        interestSavings: Number(interestSavings),
        newMonthlyPayment: Number(newMonthlyPayment),
        totalSavings: Number(interestSavings),
      });
    } catch (error) {
      console.error("Error calculating prepayment:", error);
      toast.error("Error calculating prepayment");
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmitPrepayment = async () => {
    if (!selectedDeal || !prepaymentAmount || !prepaymentEstimate) {
      toast.error("Please complete all fields");
      return;
    }
    
    try {
      // Mock submission
      toast.success("Prepayment request submitted successfully!");
      
      // Reset form
      setSelectedDeal("");
      setPrepaymentAmount("");
      setPrepaymentEstimate(null);
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error submitting prepayment:", error);
      toast.error("Error submitting prepayment request");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'COMPLETED':
        return 'success';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="h-96">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Prepayment Center</h1>
            <p className="text-gray-600 mt-1">Calculate savings and manage prepayment requests</p>
          </div>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            View Guidelines
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prepayment Calculator */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Prepayment Calculator
                </CardTitle>
                <CardDescription>
                  Calculate potential savings from prepaying your loan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Loan
                  </label>
                  <Select value={selectedDeal} onValueChange={setSelectedDeal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a loan to prepay" />
                    </SelectTrigger>
                    <SelectContent>
                      {deals.map((deal) => (
                        <SelectItem key={deal.id} value={deal.id}>
                          {deal.dealName} - {formatCurrency(Number(deal.remainingBalance))}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prepayment Amount
                  </label>
                  <Input
                    type="number"
                    value={prepaymentAmount}
                    onChange={(e) => setPrepaymentAmount(e.target.value)}
                    placeholder="Enter amount to prepay"
                    className="w-full"
                  />
                </div>

                {prepaymentEstimate && (
                  <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-blue-900">Prepayment Estimate</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Current Balance</p>
                        <p className="font-semibold">{formatCurrency(prepaymentEstimate.currentBalance)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">New Balance</p>
                        <p className="font-semibold">{formatCurrency(prepaymentEstimate.newBalance)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Interest Savings</p>
                        <p className="font-semibold text-green-600">{formatCurrency(prepaymentEstimate.interestSavings)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">New Monthly Payment</p>
                        <p className="font-semibold">{formatCurrency(prepaymentEstimate.newMonthlyPayment)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button 
                    onClick={handleSubmitPrepayment}
                    disabled={!prepaymentEstimate || calculating}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Request
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Letter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Loans Summary */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Active Loans
                </CardTitle>
                <CardDescription>
                  Overview of your loans eligible for prepayment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setSelectedDeal(deal.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{deal.dealName}</h3>
                        <Badge variant="info">
                          {deal.productType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Remaining Balance</p>
                          <p className="font-semibold">{formatCurrency(Number(deal.remainingBalance))}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Interest Rate</p>
                          <p className="font-semibold">{Number(deal.interestRate).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Monthly Payment</p>
                          <p className="font-semibold">{formatCurrency(Number(deal.monthlyPayment))}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Maturity Date</p>
                          <p className="font-semibold">{formatDate(deal.maturityDate)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Prepayment History */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Prepayment History
              </CardTitle>
              <CardDescription>
                Your previous prepayment requests and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prepayments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No prepayment history</h3>
                  <p className="text-gray-600">Submit your first prepayment request above</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prepayments.map((prepayment) => (
                    <div
                      key={prepayment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(prepayment.status)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {prepayment.deal.dealName}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Request: {formatCurrency(prepayment.requestedAmount as any)}</span>
                            <span>Savings: {formatCurrency(prepayment.savingsAmount as any)}</span>
                            <span>{formatDate(prepayment.requestDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={getStatusColor(prepayment.status) as any}>
                          {prepayment.status}
                        </Badge>
                        {prepayment.letterGenerated && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Letter
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
