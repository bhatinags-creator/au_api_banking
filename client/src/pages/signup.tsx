import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  ArrowLeft, 
  CheckCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Code, 
  Shield,
  FileText,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface SignupFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Company Information
  companyName: string;
  companyType: string;
  website: string;
  companySize: string;
  industry: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  
  // Development Information
  useCase: string;
  expectedVolume: string;
  technicalContact: string;
  preferredAPIs: string[];
  
  // Legal
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  subscribeNewsletter: boolean;
}

const companyTypes = [
  "Startup",
  "Small Business",
  "Medium Enterprise",
  "Large Enterprise",
  "Fintech Company",
  "Technology Company",
  "Financial Institution",
  "Government Organization",
  "Non-Profit Organization",
  "Other"
];

const companySizes = [
  "1-10 employees",
  "11-50 employees", 
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees"
];

const industries = [
  "Financial Services",
  "Technology",
  "E-commerce",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Travel & Tourism",
  "Government",
  "Other"
];

const apiCategories = [
  "Authentication & Security",
  "Payment Processing",
  "Account Management",
  "Transaction History",
  "Corporate Banking",
  "KYC & Verification",
  "Trade Finance",
  "Forex & Remittance"
];

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companyType: "",
    website: "",
    companySize: "",
    industry: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    useCase: "",
    expectedVolume: "",
    technicalContact: "",
    preferredAPIs: [],
    agreeToTerms: false,
    agreeToPrivacy: false,
    subscribeNewsletter: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const steps = [
    { id: 1, title: "Personal Details", icon: User },
    { id: 2, title: "Company Information", icon: Building2 },
    { id: 3, title: "Technical Requirements", icon: Code },
    { id: 4, title: "Review & Submit", icon: CheckCircle }
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAPIToggle = (api: string) => {
    setFormData(prev => ({
      ...prev,
      preferredAPIs: prev.preferredAPIs.includes(api)
        ? prev.preferredAPIs.filter(a => a !== api)
        : [...prev.preferredAPIs, api]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
      case 2:
        return !!(formData.companyName && formData.companyType && formData.industry && 
                 formData.address && formData.city && formData.state && formData.pincode);
      case 3:
        return !!(formData.useCase && formData.expectedVolume && formData.preferredAPIs.length > 0);
      case 4:
        return formData.agreeToTerms && formData.agreeToPrivacy;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Application Submitted!",
        description: "Your developer account request has been submitted. You'll receive confirmation within 24-48 hours."
      });
      
      // In production, redirect to success page or dashboard
      console.log("Form submitted:", formData);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-12 h-12 text-[var(--au-primary)] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  data-testid="input-first-name"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  data-testid="input-last-name"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="your.email@company.com"
                  data-testid="input-email"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  data-testid="input-phone"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building2 className="w-12 h-12 text-[var(--au-primary)] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
              <p className="text-gray-600">Details about your organization</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  placeholder="Your Company Name"
                  data-testid="input-company-name"
                />
              </div>
              
              <div>
                <Label htmlFor="companyType">Company Type *</Label>
                <Select value={formData.companyType} onValueChange={(value) => updateFormData('companyType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company type" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="companySize">Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value) => updateFormData('companySize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  placeholder="https://www.yourcompany.com"
                  data-testid="input-website"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="Complete business address"
                  data-testid="textarea-address"
                />
              </div>
              
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  placeholder="City"
                  data-testid="input-city"
                />
              </div>
              
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => updateFormData('state', e.target.value)}
                  placeholder="State"
                  data-testid="input-state"
                />
              </div>
              
              <div>
                <Label htmlFor="pincode">PIN Code *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => updateFormData('pincode', e.target.value)}
                  placeholder="400001"
                  data-testid="input-pincode"
                />
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateFormData('country', e.target.value)}
                  placeholder="India"
                  data-testid="input-country"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Code className="w-12 h-12 text-[var(--au-primary)] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Technical Requirements</h2>
              <p className="text-gray-600">Help us understand your integration needs</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="useCase">Primary Use Case *</Label>
                <Textarea
                  id="useCase"
                  value={formData.useCase}
                  onChange={(e) => updateFormData('useCase', e.target.value)}
                  placeholder="Describe how you plan to use AU Bank APIs. What problem are you solving?"
                  rows={4}
                  data-testid="textarea-use-case"
                />
              </div>
              
              <div>
                <Label htmlFor="expectedVolume">Expected Transaction Volume *</Label>
                <Select value={formData.expectedVolume} onValueChange={(value) => updateFormData('expectedVolume', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select expected volume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (&lt; 1,000 per month)</SelectItem>
                    <SelectItem value="medium">Medium (1,000 - 10,000 per month)</SelectItem>
                    <SelectItem value="high">High (10,000 - 100,000 per month)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (&gt; 100,000 per month)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="technicalContact">Technical Contact Email</Label>
                <Input
                  id="technicalContact"
                  type="email"
                  value={formData.technicalContact}
                  onChange={(e) => updateFormData('technicalContact', e.target.value)}
                  placeholder="tech@yourcompany.com (if different from above)"
                  data-testid="input-technical-contact"
                />
              </div>
              
              <div>
                <Label>Preferred APIs *</Label>
                <p className="text-sm text-gray-600 mb-4">Select the API categories you're interested in</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {apiCategories.map(api => (
                    <label key={api} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <Checkbox
                        checked={formData.preferredAPIs.includes(api)}
                        onCheckedChange={() => handleAPIToggle(api)}
                      />
                      <span className="text-sm">{api}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="w-12 h-12 text-[var(--au-primary)] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
              <p className="text-gray-600">Please review your information before submitting</p>
            </div>
            
            <div className="space-y-6">
              {/* Summary Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Company:</strong> {formData.companyName}</p>
                  <p><strong>Type:</strong> {formData.companyType}</p>
                  <p><strong>Industry:</strong> {formData.industry}</p>
                  <p><strong>Location:</strong> {formData.city}, {formData.state}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Technical Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Expected Volume:</strong> {formData.expectedVolume}</p>
                  <p><strong>Preferred APIs:</strong></p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.preferredAPIs.map(api => (
                      <Badge key={api} variant="secondary">{api}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Legal Agreements */}
              <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Legal Agreements</h3>
                
                <label className="flex items-start space-x-3 cursor-pointer">
                  <Checkbox
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => updateFormData('agreeToTerms', checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and understand the API usage policies *
                  </span>
                </label>
                
                <label className="flex items-start space-x-3 cursor-pointer">
                  <Checkbox
                    checked={formData.agreeToPrivacy}
                    onCheckedChange={(checked) => updateFormData('agreeToPrivacy', checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and data processing terms *
                  </span>
                </label>
                
                <label className="flex items-start space-x-3 cursor-pointer">
                  <Checkbox
                    checked={formData.subscribeNewsletter}
                    onCheckedChange={(checked) => updateFormData('subscribeNewsletter', checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    Subscribe to developer newsletter for API updates and announcements
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-neutrals-900">
                  AU Bank Developer Portal (Internal)
                </h1>
              </div>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-100 text-blue-700' : 
                    isCompleted ? 'bg-green-100 text-green-700' : 'text-gray-500'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium text-sm hidden md:block">{step.title}</span>
                    <span className="font-medium text-sm md:hidden">{step.id}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-px mx-2 ${
                      isCompleted ? 'bg-green-300' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  data-testid="button-previous"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <div className="text-sm text-gray-500">
                  Step {currentStep} of {steps.length}
                </div>
                
                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    className="bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90"
                    data-testid="button-next"
                  >
                    Next
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !validateStep(4)}
                    className="bg-green-600 hover:bg-green-700"
                    data-testid="button-submit"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}