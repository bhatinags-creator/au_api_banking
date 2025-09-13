import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { insertCorporateRegistrationSchema, verifyOtpSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Building2, Mail, User, CreditCard, Key } from "lucide-react";
import { Link } from "wouter";
import { useValidationRules } from "@/hooks/useConfigurations";
import { validateObjectDynamic } from "@/lib/dynamicValidation";

export default function CorporateRegistration() {
  const [currentStep, setCurrentStep] = useState<"registration" | "otp" | "success">("registration");
  const [registrationId, setRegistrationId] = useState<string>("");
  const [generatedApiKey, setGeneratedApiKey] = useState<string>("");
  const [dynamicValidationErrors, setDynamicValidationErrors] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Use dynamic validation rules for corporate registration
  const { data: validationRules } = useValidationRules('corporate-registration', 'all');

  const registrationForm = useForm({
    resolver: zodResolver(insertCorporateRegistrationSchema.extend({
      confirmEmail: z.string().email("Invalid email address")
    }).refine(data => data.email === data.confirmEmail, {
      message: "Email addresses don't match",
      path: ["confirmEmail"]
    })),
    defaultValues: {
      companyName: "",
      accountNumber: "",
      email: "",
      confirmEmail: "",
      contactPerson: ""
    }
  });

  const otpForm = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      registrationId: "",
      otpCode: ""
    }
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/corporate-registration", data);
      return response.json();
    },
    onSuccess: (data: any) => {
      setRegistrationId(data.id);
      otpForm.setValue("registrationId", data.id);
      setCurrentStep("otp");
      toast({
        title: "Registration Successful!",
        description: `OTP has been sent to ${registrationForm.getValues("email")}. Please check your email and enter the 6-digit code.`
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again."
      });
    }
  });

  const otpMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/verify-otp", data);
      return response.json();
    },
    onSuccess: (data: any) => {
      setGeneratedApiKey(data.apiKey);
      setCurrentStep("success");
      toast({
        title: "Verification Successful!",
        description: "Your API key has been generated. Please copy and store it securely."
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Invalid or expired OTP. Please try again."
      });
    }
  });

  const onRegistrationSubmit = async (data: any) => {
    try {
      // First validate using dynamic validation if available
      if (validationRules && Object.keys(validationRules).length > 0) {
        const dynamicErrors = await validateObjectDynamic('corporate-registration', data, 'all');
        if (dynamicErrors.length > 0) {
          setDynamicValidationErrors(dynamicErrors.map(err => err.message));
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please fix the validation errors and try again."
          });
          return;
        }
      }
      
      setDynamicValidationErrors([]);
      const { confirmEmail, ...registrationData } = data;
      registrationMutation.mutate(registrationData);
    } catch (error) {
      console.error('Dynamic validation error:', error);
      // Fallback to form validation if dynamic validation fails
      const { confirmEmail, ...registrationData } = data;
      registrationMutation.mutate(registrationData);
    }
  };

  const onOtpSubmit = (data: any) => {
    otpMutation.mutate(data);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(generatedApiKey);
    toast({
      title: "Copied!",
      description: "API key has been copied to clipboard."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--au-bg-soft-1)] to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-[var(--au-primary)] hover:text-[var(--au-primary-700)] dark:text-blue-400 dark:hover:text-blue-300">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-[var(--au-primary)] text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Building2 className="w-6 h-6 mr-2" />
              Corporate API Access Registration
            </CardTitle>
            <CardDescription className="text-purple-100">
              Register your company to get API access for AU Small Finance Bank services
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {currentStep === "registration" && (
              <Form {...registrationForm}>
                <form onSubmit={registrationForm.handleSubmit(onRegistrationSubmit)} className="space-y-6">
                  {/* Dynamic Validation Errors Display */}
                  {dynamicValidationErrors.length > 0 && (
                    <div className="md:col-span-2 p-4 bg-red-50 border border-red-200 rounded-md">
                      <h4 className="text-sm font-medium text-red-800 mb-2">Validation Errors:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {dynamicValidationErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={registrationForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="flex items-center">
                            <Building2 className="w-4 h-4 mr-2" />
                            Company Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-company-name"
                              placeholder="Enter your registered company name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registrationForm.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Contact Person
                          </FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-contact-person"
                              placeholder="Full name of authorized person"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registrationForm.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" />
                            AU Bank Account Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-account-number"
                              placeholder="Your AU Bank account number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registrationForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-email"
                              type="email"
                              placeholder="your.email@company.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registrationForm.control}
                      name="confirmEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Confirm Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              data-testid="input-confirm-email"
                              type="email"
                              placeholder="Confirm your email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Important Information:</h3>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Your account number will be verified with AU Bank records</li>
                      <li>• OTP verification will be sent to the registered email</li>
                      <li>• API access will be granted after successful verification</li>
                      <li>• Keep your API key secure and do not share it</li>
                    </ul>
                  </div>

                  <Button
                    data-testid="button-submit-registration"
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={registrationMutation.isPending}
                  >
                    {registrationMutation.isPending ? "Processing..." : "Submit Registration"}
                  </Button>
                </form>
              </Form>
            )}

            {currentStep === "otp" && (
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6 text-center">
                  <div className="mb-6">
                    <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                      <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Verify Your Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We've sent a 6-digit OTP to <strong>{registrationForm.getValues("email")}</strong>
                    </p>
                  </div>

                  <FormField
                    control={otpForm.control}
                    name="otpCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter OTP</FormLabel>
                        <FormControl>
                          <Input
                            data-testid="input-otp-code"
                            placeholder="123456"
                            className="text-center text-lg font-mono tracking-widest"
                            maxLength={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button
                      data-testid="button-back-to-registration"
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("registration")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      data-testid="button-verify-otp"
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={otpMutation.isPending}
                    >
                      {otpMutation.isPending ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {currentStep === "success" && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                    Registration Successful!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your corporate account has been verified. Here's your API key:
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <Key className="w-4 h-4 mr-2" />
                      Your API Key
                    </span>
                    <Button
                      data-testid="button-copy-api-key"
                      size="sm"
                      variant="outline"
                      onClick={copyApiKey}
                    >
                      Copy
                    </Button>
                  </div>
                  <code className="text-sm font-mono bg-white dark:bg-gray-900 p-2 rounded border block text-center">
                    {generatedApiKey}
                  </code>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Important Security Notice</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 text-left space-y-1">
                    <li>• Store this API key securely - you won't be able to see it again</li>
                    <li>• Don't share your API key or commit it to version control</li>
                    <li>• Use environment variables to store the key in your applications</li>
                    <li>• Contact support if you need to regenerate your key</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Link href="/api-explorer" className="flex-1">
                    <Button data-testid="button-explore-apis" className="w-full bg-blue-600 hover:bg-blue-700">
                      Explore APIs
                    </Button>
                  </Link>
                  <Link href="/sandbox" className="flex-1">
                    <Button data-testid="button-try-sandbox" variant="outline" className="w-full">
                      Try Sandbox
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}