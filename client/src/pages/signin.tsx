import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Shield,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth, useLogin } from "@/hooks/useAuth";
import { validateObjectDynamic, getFieldConstraints } from "@/lib/dynamicValidation";

interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function SignIn() {
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<SignInFormData>>({});
  const [, setLocation] = useLocation();
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const loginMutation = useLogin();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const updateFormData = (field: keyof SignInFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      // Use dynamic validation from backend configuration
      const validationErrors = await validateObjectDynamic('user', {
        email: formData.email,
        password: formData.password
      });

      const newErrors: Partial<SignInFormData> = {};
      
      // Map validation errors to form errors
      validationErrors.forEach(error => {
        if (error.field === 'email') {
          newErrors.email = error.message;
        } else if (error.field === 'password') {
          newErrors.password = error.message;
        }
      });

      setErrors(newErrors);
      return validationErrors.length === 0;
    } catch (error) {
      console.error('Dynamic validation error, falling back to hardcoded validation:', error);
      
      // Fallback to hardcoded validation if dynamic validation fails
      const newErrors: Partial<SignInFormData> = {};

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password
      });
      
      // Redirect to dashboard on success
      setLocation('/dashboard');
    } catch (error) {
      // Error handling is done in the mutation
      console.error('Login error:', error);
    }
  };

  const handleForgotPassword = () => {
    // In production, this would integrate with AU Bank's password reset system
    alert('Please contact your system administrator for password reset.');
  };

  const handleSSOLogin = (provider: string) => {
    // In production, this would integrate with AU Bank's SSO
    alert(`${provider} SSO integration will be available in the next release.`);
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--au-primary)] to-[var(--au-primary)]/80 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--au-primary)] to-[var(--au-primary)]/80 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your internal developer account</p>
          </div>

          <Card>
            <CardContent className="p-8">
              {/* Production Notice */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Internal Access Only</span>
                </div>
                <div className="text-sm text-purple-700">
                  <p>This portal is exclusively for AU Bank internal development teams.</p>
                  <p>Please use your corporate credentials to access the system.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        placeholder="your.email@company.com"
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        data-testid="input-email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        placeholder="Enter your password"
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        data-testid="input-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        data-testid="button-toggle-password"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => updateFormData('rememberMe', e.target.checked)}
                      className="rounded border-gray-300"
                      data-testid="checkbox-remember-me"
                    />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-[var(--au-primary)] hover:underline"
                    data-testid="link-forgot-password"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loginMutation.isPending || authLoading}
                  className="w-full bg-[var(--au-primary)] hover:bg-[var(--au-primary)]/90 h-11"
                  data-testid="button-signin"
                >
                  {loginMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSSOLogin('Google')}
                    className="h-11"
                    data-testid="button-google-signin"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSSOLogin('Microsoft')}
                    className="h-11"
                    data-testid="button-microsoft-signin"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#F25022" d="M0 0h11v11H0z"/>
                      <path fill="#00A4EF" d="M13 0h11v11H13z"/>
                      <path fill="#7FBA00" d="M0 13h11v11H0z"/>
                      <path fill="#FFB900" d="M13 13h11v11H13z"/>
                    </svg>
                    Microsoft
                  </Button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/signup">
                    <span className="text-[var(--au-primary)] hover:underline cursor-pointer font-medium" data-testid="link-signup">
                      Sign up for free
                    </span>
                  </Link>
                </p>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-800">Secure Authentication</span>
                </div>
                <p className="text-xs text-gray-600">
                  Your connection is encrypted with 256-bit SSL. We never store your passwords in plain text.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">Need help accessing your account?</p>
            <div className="flex justify-center space-x-4 text-sm">
              <button 
                onClick={() => alert("Support team will contact you within 24 hours.")}
                className="text-[var(--au-primary)] hover:underline"
                data-testid="link-contact-support"
              >
                Contact Support
              </button>
              <span className="text-gray-300">•</span>
              <Link href="/docs">
                <span className="text-[var(--au-primary)] hover:underline cursor-pointer" data-testid="link-documentation">
                  Documentation
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}