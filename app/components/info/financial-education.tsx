
"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  CreditCard, 
  TrendingDown, 
  AlertTriangle,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  Scale,
  Shield,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Info,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout } from "@/components/layout/main-layout";

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

export function FinancialEducation() {
  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Education Center</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Understanding credit, debit, and debt collection processes at CapitalFlow Financial Services
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="definitions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="definitions">Credit & Debit</TabsTrigger>
              <TabsTrigger value="collection">Debt Collection</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="definitions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Credit Definition */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-800">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Credit
                    </CardTitle>
                    <CardDescription className="text-green-700">
                      Positive financial transactions and balances
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-green-800">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Definition</h4>
                        <p className="text-sm">
                          Credit represents funds available to borrow or positive balances in your account. 
                          In financial services, credit indicates lending capacity, available credit limits, 
                          or positive cash flow.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Examples at CapitalFlow</h4>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Available credit line funds
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Loan disbursements to your account
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Interest credits or refunds
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Overpayment credits
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Benefits</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Access to working capital</li>
                          <li>• Flexible repayment terms</li>
                          <li>• Business growth opportunities</li>
                          <li>• Emergency funding availability</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Debit Definition */}
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-800">
                      <TrendingDown className="h-5 w-5 mr-2" />
                      Debit
                    </CardTitle>
                    <CardDescription className="text-red-700">
                      Charges, fees, and amounts owed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-red-800">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Definition</h4>
                        <p className="text-sm">
                          Debit represents charges, fees, interest, or amounts owed to CapitalFlow. 
                          These are negative balances or obligations that reduce your available credit 
                          or create payment requirements.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Examples at CapitalFlow</h4>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-center">
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            Monthly loan payments
                          </li>
                          <li className="flex items-center">
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            Interest charges
                          </li>
                          <li className="flex items-center">
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            Late payment fees
                          </li>
                          <li className="flex items-center">
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            Processing fees
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Management Tips</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Set up automatic payments</li>
                          <li>• Monitor payment due dates</li>
                          <li>• Review statements regularly</li>
                          <li>• Contact us before missing payments</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Impact on Credit Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    Impact on Your Credit Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 text-green-700">Positive Impact</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Timely payment history</li>
                        <li>• Maintaining low credit utilization</li>
                        <li>• Consistent payment patterns</li>
                        <li>• Successfully completing loan terms</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-red-700">Negative Impact</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Late or missed payments</li>
                        <li>• High credit utilization</li>
                        <li>• Defaulting on loans</li>
                        <li>• Frequent credit inquiries</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="collection" className="space-y-6">
              {/* Collection Process Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scale className="h-5 w-5 mr-2 text-blue-600" />
                    CapitalFlow Debt Collection Process
                  </CardTitle>
                  <CardDescription>
                    Our systematic approach to debt collection prioritizes communication and customer support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Collection Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium text-blue-900">Days 1-15</h4>
                        <p className="text-sm text-blue-800">Grace Period</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <Mail className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <h4 className="font-medium text-yellow-900">Days 16-30</h4>
                        <p className="text-sm text-yellow-800">Reminder Phase</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Phone className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <h4 className="font-medium text-orange-900">Days 31-60</h4>
                        <p className="text-sm text-orange-800">Active Collection</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <FileText className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <h4 className="font-medium text-red-900">Days 61+</h4>
                        <p className="text-sm text-red-800">Formal Process</p>
                      </div>
                    </div>

                    {/* Detailed Process */}
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-blue-900">Phase 1: Grace Period (Days 1-15)</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          We understand that payments can occasionally be delayed. During this period, 
                          no collection activities are initiated, though late fees may apply per your agreement.
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                          <li>• No collection calls or letters</li>
                          <li>• Late fees may be assessed</li>
                          <li>• Self-service payment options available</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-yellow-500 pl-4">
                        <h4 className="font-medium text-yellow-900">Phase 2: Reminder Phase (Days 16-30)</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          Gentle reminders are sent via email and mail to notify you of the past-due amount 
                          and provide easy payment options.
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                          <li>• Email and mail reminders</li>
                          <li>• Payment links and instructions</li>
                          <li>• Customer service support</li>
                          <li>• Payment plan options discussed</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-medium text-orange-900">Phase 3: Active Collection (Days 31-60)</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          Our collection team will contact you via phone and mail to discuss payment 
                          arrangements and find solutions that work for your situation.
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                          <li>• Phone calls from collection specialists</li>
                          <li>• Formal collection letters</li>
                          <li>• Payment plan negotiations</li>
                          <li>• Account review and hardship considerations</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-medium text-red-900">Phase 4: Formal Collection Process (Days 61+)</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          If payment arrangements cannot be made, we may pursue formal collection 
                          activities, which could include legal action or credit reporting.
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                          <li>• Credit bureau reporting</li>
                          <li>• Third-party collection agencies</li>
                          <li>• Legal action consideration</li>
                          <li>• Asset recovery procedures</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Rights and Protections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Your Rights During Collection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Fair Debt Collection Practices</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Respectful and professional communication</li>
                        <li>• No harassment or abusive language</li>
                        <li>• Reasonable calling hours (8 AM - 9 PM)</li>
                        <li>• Right to dispute the debt</li>
                        <li>• Written validation of debt upon request</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Communication Preferences</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Choose preferred contact method</li>
                        <li>• Request written communications only</li>
                        <li>• Designate authorized representatives</li>
                        <li>• Restrict workplace communications</li>
                        <li>• Schedule convenient call times</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Assistance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Payment Assistance Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      We understand that financial difficulties can arise. CapitalFlow offers several 
                      assistance programs to help you maintain your account in good standing:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Payment Plans</h4>
                        <p className="text-sm text-blue-800">
                          Flexible payment arrangements tailored to your financial situation
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Hardship Programs</h4>
                        <p className="text-sm text-green-800">
                          Temporary relief options for customers facing financial hardship
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Loan Modification</h4>
                        <p className="text-sm text-purple-800">
                          Restructuring options to make payments more manageable
                        </p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-medium text-orange-900 mb-2">Settlement Options</h4>
                        <p className="text-sm text-orange-800">
                          Negotiated settlement arrangements for qualifying accounts
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    Need Help? Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium text-blue-900">Customer Service</h4>
                      <p className="text-sm text-blue-800 mb-2">1-800-CAPITAL</p>
                      <p className="text-xs text-blue-700">Mon-Fri 8AM-8PM EST</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium text-green-900">Email Support</h4>
                      <p className="text-sm text-green-800 mb-2">support@capitalflow.com</p>
                      <p className="text-xs text-green-700">24/7 Response</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-medium text-purple-900">Collections</h4>
                      <p className="text-sm text-purple-800 mb-2">collections@capitalflow.com</p>
                      <p className="text-xs text-purple-700">Payment Arrangements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Educational Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                    Educational Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Financial Management</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Business Cash Flow Guide
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Budgeting for Business Loans
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          Payment Planning Tools
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Credit Health</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="h-4 w-4 mr-2" />
                          Building Business Credit
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Info className="h-4 w-4 mr-2" />
                          Understanding Credit Reports
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Avoiding Default
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-600" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium">What happens if I miss a payment?</h4>
                      <p className="text-sm text-gray-700 mt-1">
                        We offer a 15-day grace period. After that, we'll send reminders and work 
                        with you to find a solution. Contact us as soon as possible to avoid 
                        additional fees and credit impact.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium">Can I set up automatic payments?</h4>
                      <p className="text-sm text-gray-700 mt-1">
                        Yes! Automatic payments help ensure you never miss a payment. 
                        You can set this up through your online account or by calling customer service.
                      </p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-medium">How do I dispute a charge?</h4>
                      <p className="text-sm text-gray-700 mt-1">
                        Contact our customer service team within 30 days of the charge. 
                        We'll investigate and work to resolve the dispute quickly.
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-medium">What if I'm experiencing financial hardship?</h4>
                      <p className="text-sm text-gray-700 mt-1">
                        We offer several hardship programs including payment plans, temporary 
                        payment reductions, and loan modifications. Contact us to discuss your options.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
