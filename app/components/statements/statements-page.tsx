
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  ChevronDown,
  Eye
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Statement } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/utils";

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

export function StatementsPage() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [filteredStatements, setFilteredStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStatements();
    // Set default to current month
    const currentDate = new Date();
    setSelectedMonth((currentDate.getMonth() + 1).toString());
    setSelectedYear(currentDate.getFullYear().toString());
  }, []);

  useEffect(() => {
    filterStatements();
  }, [statements, selectedMonth, selectedYear, searchTerm]);

  const fetchStatements = async () => {
    try {
      const response = await fetch("/api/statements");
      if (response.ok) {
        const data = await response.json();
        setStatements(data);
      }
    } catch (error) {
      console.error("Error fetching statements:", error);
      // Mock data for demo
      generateMockStatements();
    } finally {
      setLoading(false);
    }
  };

  const generateMockStatements = () => {
    const mockStatements: Statement[] = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const totalCredits = Math.random() * 50000 + 10000;
      const totalDebits = Math.random() * 45000 + 8000;
      
      mockStatements.push({
        id: `stmt-${i}`,
        userId: "mock-user",
        statementDate: date,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        totalCredits: totalCredits as any,
        totalDebits: totalDebits as any,
        netAmount: totalCredits - totalDebits as any,
        fileUrl: null,
        createdAt: date,
        updatedAt: date,
      });
    }
    
    setStatements(mockStatements);
  };

  const filterStatements = () => {
    let filtered = [...statements];

    if (selectedMonth && selectedMonth !== "all") {
      filtered = filtered.filter(stmt => stmt.month === parseInt(selectedMonth));
    }

    if (selectedYear && selectedYear !== "all") {
      filtered = filtered.filter(stmt => stmt.year === parseInt(selectedYear));
    }

    if (searchTerm) {
      filtered = filtered.filter(stmt => 
        stmt.month.toString().includes(searchTerm) ||
        stmt.year.toString().includes(searchTerm)
      );
    }

    setFilteredStatements(filtered);
  };

  const getMonthName = (month: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1];
  };

  const getAvailableYears = () => {
    const years = [...new Set(statements.map(stmt => stmt.year))];
    return years.sort((a, b) => b - a);
  };

  const calculateSummary = () => {
    const totalCredits = filteredStatements.reduce((sum, stmt) => sum + Number(stmt.totalCredits), 0);
    const totalDebits = filteredStatements.reduce((sum, stmt) => sum + Number(stmt.totalDebits), 0);
    const netAmount = totalCredits - totalDebits;
    
    return { totalCredits, totalDebits, netAmount };
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
            <h1 className="text-3xl font-bold text-gray-900">Merchant Statements</h1>
            <p className="text-gray-600 mt-1">View and download your monthly financial statements</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Total Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.totalCredits)}
              </div>
              <p className="text-sm text-gray-600">
                {filteredStatements.length} statement{filteredStatements.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
                Total Debits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.totalDebits)}
              </div>
              <p className="text-sm text-gray-600">
                Payments and fees
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                Net Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.netAmount)}
              </div>
              <p className="text-sm text-gray-600">
                {summary.netAmount >= 0 ? 'Net positive' : 'Net negative'}
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
          
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {getMonthName(i + 1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {getAvailableYears().map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search statements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
          </div>
        </motion.div>

        {/* Statements List */}
        <motion.div variants={itemVariants}>
          {filteredStatements.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No statements found</h3>
                <p className="text-gray-600">Try adjusting your filters or check back later</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredStatements.map((statement) => (
                <motion.div
                  key={statement.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className="group"
                >
                  <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {getMonthName(statement.month)} {statement.year} Statement
                            </h3>
                            <p className="text-sm text-gray-600">
                              Statement Date: {formatDate(statement.statementDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-8">
                          <div className="text-right">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">Credits</p>
                                <p className="text-sm font-semibold text-green-600">
                                  {formatCurrency(Number(statement.totalCredits))}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Debits</p>
                                <p className="text-sm font-semibold text-red-600">
                                  {formatCurrency(Number(statement.totalDebits))}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Net Amount</p>
                                <p className={`text-sm font-semibold ${
                                  Number(statement.netAmount) >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {formatCurrency(Number(statement.netAmount))}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
