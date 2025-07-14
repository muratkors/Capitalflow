
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  X, 
  FileText, 
  CreditCard, 
  Truck, 
  Calculator, 
  AlertCircle,
  CheckCircle,
  Loader2,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const applicationSchema = z.object({
  productType: z.enum(["LINE_OF_CREDIT", "EQUIPMENT_FINANCE", "TERM_LOAN"]),
  requestedAmount: z.string().min(1, "Required").transform(val => parseFloat(val)),
  purposeOfLoan: z.string().min(10, "Please provide more details about the purpose"),
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(2, "Business type is required"),
  yearsInBusiness: z.string().min(1, "Required").transform(val => parseInt(val)),
  annualRevenue: z.string().min(1, "Required").transform(val => parseFloat(val)),
  monthlyRevenue: z.string().min(1, "Required").transform(val => parseFloat(val)),
  creditScore: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  collateralType: z.string().optional(),
  collateralValue: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  collateralDescription: z.string().optional(),
  preferredTerm: z.string().min(1, "Required").transform(val => parseInt(val)),
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  businessAddress: z.string().min(5, "Business address is required"),
  businessCity: z.string().min(2, "City is required"),
  businessState: z.string().min(2, "State is required"),
  businessZip: z.string().min(5, "Valid ZIP code is required"),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankRoutingNumber: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductType?: string;
}

const productTypes = [
  {
    value: "LINE_OF_CREDIT",
    label: "Line of Credit",
    icon: <CreditCard className="h-4 w-4" />,
    description: "Flexible credit line for working capital needs",
    minAmount: 10000,
    maxAmount: 500000,
    terms: [6, 12, 18, 24, 36]
  },
  {
    value: "EQUIPMENT_FINANCE",
    label: "Equipment Finance",
    icon: <Truck className="h-4 w-4" />,
    description: "Financing for equipment purchases and business assets",
    minAmount: 25000,
    maxAmount: 1000000,
    terms: [24, 36, 48, 60, 72]
  },
  {
    value: "TERM_LOAN",
    label: "Term Loan",
    icon: <Calculator className="h-4 w-4" />,
    description: "Fixed-term loan for business expansion",
    minAmount: 50000,
    maxAmount: 2000000,
    terms: [12, 24, 36, 48, 60]
  }
];

export function ApplicationForm({ isOpen, onClose, initialProductType }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      productType: initialProductType as any || "LINE_OF_CREDIT"
    }
  });

  const selectedProductType = watch("productType");
  const selectedProduct = productTypes.find(p => p.value === selectedProductType);

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setApplicationNumber(result.applicationNumber);
        setSubmitSuccess(true);
        toast.success("Application submitted successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("An error occurred while submitting your application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setCurrentStep(1);
    setSubmitSuccess(false);
    setApplicationNumber("");
    onClose();
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Product Selection</h3>
        <p className="text-gray-600">Choose the financial product that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {productTypes.map((product) => (
          <motion.div
            key={product.value}
            whileHover={{ scale: 1.02 }}
            className={`cursor-pointer border-2 rounded-lg p-4 ${
              selectedProductType === product.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setValue("productType", product.value as any)}
          >
            <div className="flex items-center space-x-2 mb-2">
              {product.icon}
              <h4 className="font-medium">{product.label}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">{product.description}</p>
            <div className="text-xs text-gray-500">
              <p>Amount: ${product.minAmount.toLocaleString()} - ${product.maxAmount.toLocaleString()}</p>
              <p>Terms: {product.terms.join(", ")} months</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="requestedAmount">Requested Amount *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="requestedAmount"
              type="number"
              className="pl-10"
              placeholder="Enter amount"
              {...register("requestedAmount")}
            />
          </div>
          {errors.requestedAmount && (
            <p className="text-sm text-red-600 mt-1">{errors.requestedAmount.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="preferredTerm">Preferred Term (Months) *</Label>
          <Select 
            value={watch("preferredTerm")?.toString() || ""} 
            onValueChange={(value) => setValue("preferredTerm", parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              {selectedProduct?.terms?.map((term) => (
                <SelectItem key={term} value={term.toString()}>
                  {term} months
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.preferredTerm && (
            <p className="text-sm text-red-600 mt-1">{errors.preferredTerm.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="purposeOfLoan">Purpose of Loan *</Label>
        <Textarea
          id="purposeOfLoan"
          placeholder="Describe how you plan to use the funds..."
          className="min-h-[100px]"
          {...register("purposeOfLoan")}
        />
        {errors.purposeOfLoan && (
          <p className="text-sm text-red-600 mt-1">{errors.purposeOfLoan.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Business Information</h3>
        <p className="text-gray-600">Tell us about your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="businessName"
              className="pl-10"
              placeholder="Enter business name"
              {...register("businessName")}
            />
          </div>
          {errors.businessName && (
            <p className="text-sm text-red-600 mt-1">{errors.businessName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="businessType">Business Type *</Label>
          <Select 
            value={watch("businessType") || ""} 
            onValueChange={(value) => setValue("businessType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Corporation">Corporation</SelectItem>
              <SelectItem value="LLC">LLC</SelectItem>
              <SelectItem value="Partnership">Partnership</SelectItem>
              <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
              <SelectItem value="Non-Profit">Non-Profit</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.businessType && (
            <p className="text-sm text-red-600 mt-1">{errors.businessType.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="yearsInBusiness">Years in Business *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="yearsInBusiness"
              type="number"
              className="pl-10"
              placeholder="Enter years"
              {...register("yearsInBusiness")}
            />
          </div>
          {errors.yearsInBusiness && (
            <p className="text-sm text-red-600 mt-1">{errors.yearsInBusiness.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="creditScore">Credit Score (Optional)</Label>
          <Input
            id="creditScore"
            type="number"
            placeholder="Enter credit score"
            {...register("creditScore")}
          />
          {errors.creditScore && (
            <p className="text-sm text-red-600 mt-1">{errors.creditScore.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="annualRevenue">Annual Revenue *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="annualRevenue"
              type="number"
              className="pl-10"
              placeholder="Enter annual revenue"
              {...register("annualRevenue")}
            />
          </div>
          {errors.annualRevenue && (
            <p className="text-sm text-red-600 mt-1">{errors.annualRevenue.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="monthlyRevenue">Monthly Revenue *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="monthlyRevenue"
              type="number"
              className="pl-10"
              placeholder="Enter monthly revenue"
              {...register("monthlyRevenue")}
            />
          </div>
          {errors.monthlyRevenue && (
            <p className="text-sm text-red-600 mt-1">{errors.monthlyRevenue.message}</p>
          )}
        </div>
      </div>

      {/* Collateral Section */}
      <div className="border-t pt-6">
        <h4 className="font-medium mb-4">Collateral Information (Optional)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="collateralType">Collateral Type</Label>
            <Select 
              value={watch("collateralType") || ""} 
              onValueChange={(value) => setValue("collateralType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select collateral type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Inventory">Inventory</SelectItem>
                <SelectItem value="Accounts Receivable">Accounts Receivable</SelectItem>
                <SelectItem value="Vehicles">Vehicles</SelectItem>
                <SelectItem value="Securities">Securities</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="collateralValue">Collateral Value</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="collateralValue"
                type="number"
                className="pl-10"
                placeholder="Enter value"
                {...register("collateralValue")}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="collateralDescription">Collateral Description</Label>
          <Textarea
            id="collateralDescription"
            placeholder="Describe the collateral in detail..."
            {...register("collateralDescription")}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Contact & Business Details</h3>
        <p className="text-gray-600">Contact information and business address</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="contactName">Contact Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="contactName"
              className="pl-10"
              placeholder="Enter contact name"
              {...register("contactName")}
            />
          </div>
          {errors.contactName && (
            <p className="text-sm text-red-600 mt-1">{errors.contactName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contactEmail">Contact Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="contactEmail"
              type="email"
              className="pl-10"
              placeholder="Enter email address"
              {...register("contactEmail")}
            />
          </div>
          {errors.contactEmail && (
            <p className="text-sm text-red-600 mt-1">{errors.contactEmail.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contactPhone">Contact Phone *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="contactPhone"
              type="tel"
              className="pl-10"
              placeholder="Enter phone number"
              {...register("contactPhone")}
            />
          </div>
          {errors.contactPhone && (
            <p className="text-sm text-red-600 mt-1">{errors.contactPhone.message}</p>
          )}
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium mb-4">Business Address</h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="businessAddress">Street Address *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="businessAddress"
                className="pl-10"
                placeholder="Enter street address"
                {...register("businessAddress")}
              />
            </div>
            {errors.businessAddress && (
              <p className="text-sm text-red-600 mt-1">{errors.businessAddress.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="businessCity">City *</Label>
              <Input
                id="businessCity"
                placeholder="Enter city"
                {...register("businessCity")}
              />
              {errors.businessCity && (
                <p className="text-sm text-red-600 mt-1">{errors.businessCity.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="businessState">State *</Label>
              <Input
                id="businessState"
                placeholder="Enter state"
                {...register("businessState")}
              />
              {errors.businessState && (
                <p className="text-sm text-red-600 mt-1">{errors.businessState.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="businessZip">ZIP Code *</Label>
              <Input
                id="businessZip"
                placeholder="Enter ZIP code"
                {...register("businessZip")}
              />
              {errors.businessZip && (
                <p className="text-sm text-red-600 mt-1">{errors.businessZip.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Banking & Additional Information</h3>
        <p className="text-gray-600">Optional banking details and additional information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            placeholder="Enter bank name"
            {...register("bankName")}
          />
        </div>

        <div>
          <Label htmlFor="bankAccountNumber">Account Number</Label>
          <Input
            id="bankAccountNumber"
            placeholder="Enter account number"
            {...register("bankAccountNumber")}
          />
        </div>

        <div>
          <Label htmlFor="bankRoutingNumber">Routing Number</Label>
          <Input
            id="bankRoutingNumber"
            placeholder="Enter routing number"
            {...register("bankRoutingNumber")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea
          id="additionalInfo"
          placeholder="Any additional information you'd like to share..."
          className="min-h-[120px]"
          {...register("additionalInfo")}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Application Review Process</h4>
            <p className="text-sm text-blue-800 mt-1">
              Once submitted, our team will review your application within 2-3 business days. 
              We may contact you for additional documentation or clarification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessMessage = () => (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h3>
      <p className="text-gray-600 mb-6">
        Your application has been received and assigned number: 
        <span className="font-semibold text-blue-600"> {applicationNumber}</span>
      </p>
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-green-800">
          We'll review your application within 2-3 business days and contact you with updates.
          You can track your application status in your dashboard.
        </p>
      </div>
      <Button onClick={handleClose} className="bg-blue-600 hover:bg-blue-700">
        Return to Dashboard
      </Button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4"
          >
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Apply for Financial Product</h2>
                  {!submitSuccess && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`w-2 h-2 rounded-full ${
                              step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              {submitSuccess ? (
                renderSuccessMessage()
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -50, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentStep === 1 && renderStep1()}
                      {currentStep === 2 && renderStep2()}
                      {currentStep === 3 && renderStep3()}
                      {currentStep === 4 && renderStep4()}
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                    >
                      Previous
                    </Button>

                    {currentStep === 4 ? (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-2" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
