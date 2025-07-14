
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Truck, 
  Calculator, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Filter,
  ArrowUpDown,
  Plus,
  Eye,
  ChevronDown
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Deal } from "@prisma/client";
import { formatCurrency, formatDate, getProductTypeLabel, getDealStatusColor } from "@/lib/utils";
import { ApplicationForm } from "@/components/applications/application-form";

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

export function ProductsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProduct, setFilterProduct] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("principalAmount");
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<string>("");

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    filterAndSortDeals();
  }, [deals, filterStatus, filterProduct, sortBy]);

  const fetchDeals = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setDeals(data.deals || []);
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortDeals = () => {
    let filtered = [...deals];

    // Apply filters
    if (filterStatus !== "all") {
      filtered = filtered.filter(deal => deal.status === filterStatus);
    }

    if (filterProduct !== "all") {
      filtered = filtered.filter(deal => deal.productType === filterProduct);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "principalAmount":
          return Number(b.principalAmount) - Number(a.principalAmount);
        case "remainingBalance":
          return Number(b.remainingBalance) - Number(a.remainingBalance);
        case "interestRate":
          return Number(b.interestRate) - Number(a.interestRate);
        case "originationDate":
          return new Date(b.originationDate).getTime() - new Date(a.originationDate).getTime();
        case "maturityDate":
          return new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime();
        default:
          return 0;
      }
    });

    // Separate active and closed deals
    const activeDeals = filtered.filter(deal => deal.status === "ACTIVE");
    const closedDeals = filtered.filter(deal => deal.status !== "ACTIVE");

    setFilteredDeals([...activeDeals, ...closedDeals]);
  };

  const getProductIcon = (productType: string) => {
    switch (productType) {
      case "LINE_OF_CREDIT":
        return <CreditCard className="h-5 w-5" />;
      case "EQUIPMENT_FINANCE":
        return <Truck className="h-5 w-5" />;
      case "TERM_LOAN":
        return <Calculator className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const getProductDescription = (productType: string) => {
    switch (productType) {
      case "LINE_OF_CREDIT":
        return "Flexible credit line for working capital and operational expenses";
      case "EQUIPMENT_FINANCE":
        return "Financing for equipment purchases and business assets";
      case "TERM_LOAN":
        return "Fixed-term loan for business expansion and capital investments";
      default:
        return "Business financial product";
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-64">
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
            <h1 className="text-3xl font-bold text-gray-900">Financial Products</h1>
            <p className="text-gray-600 mt-1">Manage your loans, credit lines, and financing options</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setSelectedProductType("");
              setIsApplicationFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Apply for Product
          </Button>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                Lines of Credit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {deals.filter(d => d.productType === "LINE_OF_CREDIT").length}
              </div>
              <p className="text-sm text-gray-600">
                Total Available: {formatCurrency(
                  deals
                    .filter(d => d.productType === "LINE_OF_CREDIT" && d.status === "ACTIVE")
                    .reduce((sum, d) => sum + Number(d.principalAmount), 0)
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Truck className="h-5 w-5 mr-2 text-green-600" />
                Equipment Finance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {deals.filter(d => d.productType === "EQUIPMENT_FINANCE").length}
              </div>
              <p className="text-sm text-gray-600">
                Total Financed: {formatCurrency(
                  deals
                    .filter(d => d.productType === "EQUIPMENT_FINANCE")
                    .reduce((sum, d) => sum + Number(d.principalAmount), 0)
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-purple-600" />
                Term Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {deals.filter(d => d.productType === "TERM_LOAN").length}
              </div>
              <p className="text-sm text-gray-600">
                Outstanding: {formatCurrency(
                  deals
                    .filter(d => d.productType === "TERM_LOAN" && d.status === "ACTIVE")
                    .reduce((sum, d) => sum + Number(d.remainingBalance), 0)
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Sort */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
              <SelectItem value="PAID_OFF">Paid Off</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterProduct} onValueChange={setFilterProduct}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="LINE_OF_CREDIT">Line of Credit</SelectItem>
              <SelectItem value="EQUIPMENT_FINANCE">Equipment Finance</SelectItem>
              <SelectItem value="TERM_LOAN">Term Loan</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="principalAmount">Principal Amount</SelectItem>
              <SelectItem value="remainingBalance">Remaining Balance</SelectItem>
              <SelectItem value="interestRate">Interest Rate</SelectItem>
              <SelectItem value="originationDate">Origination Date</SelectItem>
              <SelectItem value="maturityDate">Maturity Date</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Products Grid */}
        <motion.div variants={itemVariants}>
          {filteredDeals.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or apply for a new product</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setSelectedProductType("");
                    setIsApplicationFormOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Apply for Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal) => (
                <motion.div
                  key={deal.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getProductIcon(deal.productType)}
                          <Badge variant={getDealStatusColor(deal.status) as any}>
                            {deal.status}
                          </Badge>
                        </div>
                        <Badge variant="outline">
                          {deal.dealNumber}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{deal.dealName}</CardTitle>
                      <CardDescription>
                        {getProductDescription(deal.productType)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Principal Amount</p>
                          <p className="font-semibold">{formatCurrency(Number(deal.principalAmount))}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Remaining Balance</p>
                          <p className="font-semibold">{formatCurrency(Number(deal.remainingBalance))}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Interest Rate</p>
                          <p className="font-semibold">{Number(deal.interestRate).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Term</p>
                          <p className="font-semibold">{deal.termMonths} months</p>
                        </div>
                      </div>

                      {deal.monthlyPayment && (
                        <div>
                          <p className="text-sm text-gray-600">Monthly Payment</p>
                          <p className="font-semibold text-lg">{formatCurrency(Number(deal.monthlyPayment))}</p>
                        </div>
                      )}

                      {deal.nextPaymentDate && (
                        <div>
                          <p className="text-sm text-gray-600">Next Payment</p>
                          <p className="font-semibold flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(deal.nextPaymentDate)}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <p className="text-xs text-gray-500">Maturity Date</p>
                          <p className="text-sm font-medium">{formatDate(deal.maturityDate)}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Application Form Modal */}
      <ApplicationForm
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
        initialProductType={selectedProductType}
      />
    </MainLayout>
  );
}
