import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Menu, 
  X, 
  Building2, 
  CreditCard, 
  Shield, 
  Database, 
  Zap, 
  FileText, 
  ArrowRight,
  Search,
  Play,
  CheckCircle,
  Star,
  Users,
  Globe,
  TrendingUp,
  Code,
  Layers,
  Banknote,
  FileCheck,
  Target,
  Clock,
  Palette,
  Settings
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Helper functions for transforming backend data
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'Shield': Shield,
    'CreditCard': CreditCard,
    'Users': Users,
    'Database': Database,
    'Building2': Building2,
    'Banknote': Banknote,
    'FileCheck': FileCheck,
    'Target': Target
  };
  return iconMap[iconName] || Database;
};

const mapColorToTailwind = (hexColor: string) => {
  const colorMap: Record<string, string> = {
    '#603078': 'text-purple-600',
    '#2563eb': 'text-blue-600', 
    '#059669': 'text-emerald-600',
    '#dc2626': 'text-red-600',
    '#ea580c': 'text-orange-600',
    '#65a30d': 'text-lime-600'
  };
  return colorMap[hexColor] || 'text-purple-600';
};

const heroSlides = [
  {
    id: 1,
    title: "Internal API Development & Testing Platform",
    subtitle: "AU Bank's comprehensive internal development environment",
    features: ["Internal API Access", "Development Tools", "Team Collaboration"],
    cta: "Access Internal Resources",
    bgColor: "from-pink-200 to-pink-300"
  },
  {
    id: 2,
    title: "Internal Payment Systems & Transaction APIs",
    subtitle: "Comprehensive internal payment processing and testing",
    features: ["Internal Testing", "Secure Development", "24/7 Monitoring"],
    cta: "Access Payment Systems",
    bgColor: "from-blue-600 to-blue-700"
  },
  {
    id: 3,
    title: "Internal Development Tools & API Management",
    subtitle: "Advanced tools for AU Bank's internal development teams",
    features: ["Internal APIs", "Developer Resources", "Testing Environment"],
    cta: "Access Dev Tools",
    bgColor: "from-green-600 to-green-700"
  }
];

const apiCategories = [
  {
    icon: Shield,
    title: "Customer",
    description: "Essential APIs for integrating with core banking services. Run checks and validations using fundamental APIs such as KYC verification, account validation, and identity checks.",
    color: "text-blue-600",
    apiCount: 9,
    apis: [
      { name: "Customer 360 Service", method: "POST", endpoint: "/customer360service" },
      { name: "Customer Dedupe", method: "POST", endpoint: "/customerdedupe" },
      { name: "CKYC Search", method: "POST", endpoint: "/CKYCSearch" },
      { name: "Customer Image Upload", method: "POST", endpoint: "/CustomerImageMnt" },
      { name: "POSIDEX - Fetch UCIC", method: "POST", endpoint: "/fetchUcic" },
      { name: "Update Customer Details", method: "POST", endpoint: "/UpdateCustomerDetails" },
      { name: "Aadhar Vault - Insert Token", method: "POST", endpoint: "/insertToken" },
      { name: "Aadhar Vault - Get Value", method: "GET", endpoint: "/getValue" },
      { name: "CIBIL Service", method: "POST", endpoint: "/ConsumerCIBILService" }
    ]
  },
  {
    icon: CreditCard,
    title: "Loans",
    description: "Comprehensive loan management APIs for personal loans, home loans, and business financing with automated approval workflows and real-time status tracking.",
    color: "text-green-600",
    apiCount: 6,
    apis: [
      { name: "Loan Application", method: "POST", endpoint: "/loan/apply" },
      { name: "Loan Status Inquiry", method: "GET", endpoint: "/loan/status" },
      { name: "EMI Calculator", method: "POST", endpoint: "/loan/emi-calculator" },
      { name: "Loan Prepayment", method: "POST", endpoint: "/loan/prepayment" },
      { name: "Document Upload", method: "POST", endpoint: "/loan/documents" },
      { name: "Eligibility Check", method: "POST", endpoint: "/loan/eligibility" }
    ]
  },
  {
    icon: Database,
    title: "Liabilities",
    description: "Enable customers to invest and bank with you by integrating savings accounts, corporate accounts, fixed deposits, and recurring deposit services.",
    color: "text-purple-600",
    apiCount: 7,
    apis: [
      { name: "Account Balance Inquiry", method: "GET", endpoint: "/account/balance" },
      { name: "Account Transaction History", method: "GET", endpoint: "/account/transactions" },
      { name: "Fixed Deposit Creation", method: "POST", endpoint: "/fd/create" },
      { name: "FD Maturity Details", method: "GET", endpoint: "/fd/maturity" },
      { name: "Recurring Deposit", method: "POST", endpoint: "/rd/create" },
      { name: "Account Statement", method: "GET", endpoint: "/account/statement" },
      { name: "Interest Calculation", method: "POST", endpoint: "/account/interest" }
    ]
  },
  {
    icon: Building2,
    title: "Cards",
    description: "Empower your corporate banking with seamless APIs for credit card management, debit card services, and card transaction processing.",
    color: "text-orange-600",
    apiCount: 8,
    apis: [
      { name: "Card Application", method: "POST", endpoint: "/card/apply" },
      { name: "Card Status Inquiry", method: "GET", endpoint: "/card/status" },
      { name: "Card Block/Unblock", method: "PUT", endpoint: "/card/block-unblock" },
      { name: "Card Transaction History", method: "GET", endpoint: "/card/transactions" },
      { name: "Card PIN Services", method: "POST", endpoint: "/card/pin" },
      { name: "Card Limit Management", method: "PUT", endpoint: "/card/limit" },
      { name: "Virtual Card Creation", method: "POST", endpoint: "/card/virtual" },
      { name: "Card Rewards Inquiry", method: "GET", endpoint: "/card/rewards" }
    ]
  },
  {
    icon: FileCheck,
    title: "Trade Services",
    description: "Incorporate remittances and bank guarantees APIs to make trade and business operations easy with our latest market-tailored offerings.",
    color: "text-pink-600",
    apiCount: 5,
    apis: [
      { name: "Letter of Credit", method: "POST", endpoint: "/trade/lc" },
      { name: "Bank Guarantee", method: "POST", endpoint: "/trade/bg" },
      { name: "Export Financing", method: "POST", endpoint: "/trade/export-finance" },
      { name: "Import Financing", method: "POST", endpoint: "/trade/import-finance" },
      { name: "Trade Document Processing", method: "POST", endpoint: "/trade/documents" }
    ]
  },
  {
    icon: Layers,
    title: "Corporate API Suite",
    description: "A curated collection of APIs specially selected to cater to evolving corporate client needs, studied after careful analysis of corporate journeys.",
    color: "text-indigo-600",
    apiCount: 6,
    apis: [
      { name: "Corporate Onboarding", method: "POST", endpoint: "/corporate/onboard" },
      { name: "Bulk Payment Processing", method: "POST", endpoint: "/corporate/bulk-payments" },
      { name: "Virtual Account Management", method: "POST", endpoint: "/corporate/vam" },
      { name: "Corporate Account Opening", method: "POST", endpoint: "/corporate/account" },
      { name: "Cash Management Services", method: "GET", endpoint: "/corporate/cash-mgmt" },
      { name: "Reconciliation Services", method: "POST", endpoint: "/corporate/reconciliation" }
    ]
  }
];

const featuredApis = [
  {
    title: "CNB Payment Creation",
    category: "Payments",
    method: "POST",
    endpoint: "/cnb/payment",
    description: "Comprehensive payment creation API supporting NEFT, RTGS, and IMPS transactions with real-time status tracking and reconciliation.",
    icon: CreditCard,
    color: "text-orange-600",
    features: ["Real-time Status", "Multi-channel Support", "Reconciliation"]
  },
  {
    title: "Account Balance Inquiry",
    category: "Accounts",
    method: "GET", 
    endpoint: "/account/balance",
    description: "Real-time account balance and transaction history APIs for seamless financial data integration and account management.",
    icon: Database,
    color: "text-purple-600",
    features: ["Real-time Data", "Transaction History", "Multi-account Support"]
  },
  {
    title: "OAuth Authentication",
    category: "Security",
    method: "POST",
    endpoint: "/oauth/token",
    description: "Secure OAuth 2.0 implementation for API authentication with token management and refresh capabilities for enterprise security.",
    icon: Shield,
    color: "text-blue-600",
    features: ["OAuth 2.0", "Token Refresh", "Enterprise Security"]
  },
  {
    title: "Customer 360 Service",
    category: "Customer Management",
    method: "POST",
    endpoint: "/customer360service",
    description: "Comprehensive customer information API providing complete customer profile, account details, and relationship information in a single call.",
    icon: Users,
    color: "text-emerald-600",
    features: ["Complete Profile", "Account Details", "Relationship Data"]
  },
  {
    title: "Virtual Account Management",
    category: "Corporate Banking",
    method: "POST",
    endpoint: "/vam/create",
    description: "Advanced virtual account management for corporate clients with automated reconciliation and real-time transaction tracking.",
    icon: Building2,
    color: "text-green-600",
    features: ["Auto Reconciliation", "Real-time Tracking", "Corporate Focus"]
  },
  {
    title: "UPI Payment Services",
    category: "Digital Payments",
    method: "POST",
    endpoint: "/upi/payment",
    description: "Complete UPI ecosystem integration with VPA validation, QR code generation, and seamless P2P/P2M payment processing.",
    icon: Zap,
    color: "text-yellow-600",
    features: ["VPA Validation", "QR Generation", "P2P/P2M Support"]
  }
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [dynamicApiCategories, setDynamicApiCategories] = useState(apiCategories);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Load comprehensive data from optimized single endpoint
  useEffect(() => {
    const loadDynamicData = async () => {
      setLoading(true);
      const startTime = Date.now();
      
      try {
        // Use single optimized portal-data endpoint
        const response = await fetch('/api/portal-data');
        
        if (response.ok) {
          const portalData = await response.json();
          const loadTime = Date.now() - startTime;
          
          console.log(`🚀 Portal data loaded in ${loadTime}ms (${portalData.categories.length} categories, ${portalData.apis.length} APIs)`);
          
          if (portalData.categories.length > 0) {
            // Create API lookup for efficiency
            const apiLookup = new Map();
            portalData.apis.forEach((api: any) => {
              apiLookup.set(api.id, api);
            });
            
            // Transform portal data to home page format efficiently
            const transformedCategories = portalData.categories.map((category: any) => {
              // Get APIs for this category
              const categoryApis = category.endpoints?.map((apiId: string) => {
                const api = apiLookup.get(apiId);
                return api ? {
                  name: api.name,
                  method: api.method,
                  endpoint: api.path,
                  description: api.description,
                  documentation: api.documentation,
                  sandbox: api.sandbox
                } : null;
              }).filter(Boolean) || [];
              
              return {
                icon: getIconComponent(category.icon),
                title: category.name,
                description: category.description,
                color: mapColorToTailwind(category.color),
                apiCount: categoryApis.length,
                apis: categoryApis.slice(0, 9) // Show max 9 APIs per category
              };
            }).filter((category: any) => category.apiCount > 0); // Only show categories with APIs
            
            setDynamicApiCategories(transformedCategories);
          } else {
            console.warn('No portal data available, using fallback static data');
          }
        } else {
          console.warn(`Failed to load portal data (${response.status}), using fallback static data`);
        }
      } catch (error) {
        console.error('Error loading portal data:', error);
        // Keep using static data as fallback
      } finally {
        setLoading(false);
      }
    };
    
    loadDynamicData();
  }, []);

  // Ensure sections always show by default
  useEffect(() => {
    console.log('Search query state:', searchQuery);
    console.log('Dynamic categories:', dynamicApiCategories.length);
  }, [searchQuery, dynamicApiCategories]);

  // Generate search suggestions - using dynamic data
  const generateSuggestions = (query: string) => {
    if (!query || query.length < 2) return [];
    
    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();
    
    // Add category suggestions from dynamic data
    dynamicApiCategories.forEach(category => {
      if (category.title.toLowerCase().includes(queryLower)) {
        suggestions.add(category.title);
      }
      // Add relevant keywords from descriptions
      const words = category.description.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.length > 3 && word.includes(queryLower)) {
          suggestions.add(word.charAt(0).toUpperCase() + word.slice(1));
        }
      });
    });
    
    // Add featured API suggestions
    featuredApis.forEach(api => {
      if (api.title.toLowerCase().includes(queryLower)) {
        suggestions.add(api.title);
      }
      if (api.category.toLowerCase().includes(queryLower)) {
        suggestions.add(api.category);
      }
    });
    
    // Add common banking API keywords
    const commonKeywords = [
      'Payment', 'Authentication', 'OAuth', 'Banking', 'Account', 'Balance', 
      'Transaction', 'Transfer', 'KYC', 'Verification', 'Security', 'API',
      'Corporate', 'Business', 'Personal', 'Deposit', 'Withdrawal', 'NEFT',
      'RTGS', 'IMPS', 'UPI', 'Credit', 'Debit', 'Loan', 'Investment'
    ];
    
    commonKeywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(queryLower)) {
        suggestions.add(keyword);
      }
    });
    
    return Array.from(suggestions).slice(0, 8); // Limit to 8 suggestions
  };

  const suggestions = generateSuggestions(searchQuery);

  // Filter APIs based on search query - using dynamic data
  const filteredApiCategories = dynamicApiCategories.filter(category =>
    searchQuery === "" || 
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeaturedApis = featuredApis.filter(api =>
    searchQuery === "" ||
    api.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    api.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    api.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSearchResults = searchQuery !== "" && (filteredApiCategories.length > 0 || filteredFeaturedApis.length > 0);
  const showNoResults = searchQuery !== "" && filteredApiCategories.length === 0 && filteredFeaturedApis.length === 0;

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    setTimeout(() => {
      document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && searchQuery) {
        setShowSuggestions(false);
        document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else if (searchQuery) {
          setShowSuggestions(false);
          document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-neutrals-900" data-testid="logo-text">
                AU Bank Developer Portal
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-neutrals-700 hover:text-primary transition-colors">Home</a>
              <Link href="/docs" className="text-neutrals-700 hover:text-primary transition-colors">
                <span data-testid="link-docs">Explore APIs</span>
              </Link>
              <Link href="/sandbox" className="text-neutrals-700 hover:text-primary transition-colors">
                <span data-testid="link-sandbox">Sandbox</span>
              </Link>
              <a href="#" className="text-neutrals-700 hover:text-primary transition-colors">FAQ</a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/signup">
                <Button variant="outline" size="sm" data-testid="button-signup">
                  Sign Up
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="sm" className="bg-primary hover:bg-primary/90" data-testid="button-signin">
                  Sign In
                </Button>
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-neutrals-700 focus:outline-none" 
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t" data-testid="mobile-menu">
            <div className="px-4 py-4 space-y-4">
              <a href="#" className="block text-neutrals-700 hover:text-primary">Home</a>
              <Link href="/docs" className="block text-neutrals-700 hover:text-primary">Explore APIs</Link>
              <Link href="/sandbox" className="block text-neutrals-700 hover:text-primary">Sandbox</Link>
              <a href="#" className="block text-neutrals-700 hover:text-primary">FAQ</a>
              <div className="flex space-x-4 pt-4">
                <Link href="/signup" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full" data-testid="mobile-button-signup">Sign Up</Button>
                </Link>
                <Link href="/signin" className="flex-1">
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90" data-testid="mobile-button-signin">Sign In</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Bar */}
      <div className="bg-neutrals-50 py-3">
        <div className="container mx-auto px-4">
          <div className="relative max-w-md ml-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutrals-400 w-4 h-4 z-10" />
            <Input
              type="text"
              placeholder="Search APIs by Name, Category, Keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length >= 2);
                setSelectedSuggestionIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (searchQuery.length >= 2) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={(e) => {
                // Delay hiding suggestions to allow clicking
                setTimeout(() => {
                  setShowSuggestions(false);
                  setSelectedSuggestionIndex(-1);
                }, 150);
              }}
              className="pl-10 text-sm"
              data-testid="input-search-apis"
            />
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-20 max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3 cursor-pointer flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      index === selectedSuggestionIndex ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  >
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{suggestion}</span>
                    {suggestion.includes('API') && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        API
                      </Badge>
                    )}
                    {apiCategories.some(cat => cat.title === suggestion) && (
                      <Badge variant="outline" className="ml-auto text-xs bg-blue-50 text-blue-600">
                        Category
                      </Badge>
                    )}
                    {featuredApis.some(api => api.title === suggestion) && (
                      <Badge variant="outline" className="ml-auto text-xs bg-green-50 text-green-600">
                        Featured
                      </Badge>
                    )}
                  </div>
                ))}
                <div className="px-4 py-2 border-t bg-gray-50 text-xs text-gray-500">
                  Use ↑↓ arrows to navigate, Enter to select, Esc to close
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AU Hero Section */}
      <section className="au-hero py-6">
        <div className="container mx-auto px-4">
          <div className="au-hero-panel grid grid-cols-1 lg:grid-cols-12 gap-7 p-8">
            <div className="lg:col-span-7">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2 leading-tight">
                Build powerful fintech solutions<br/>with our comprehensive APIs
              </h1>
              <p className="opacity-95 mb-4 text-lg">
                Transform your business with digital banking integration
              </p>
              <ul className="list-none mb-4 p-0 opacity-95 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span>Developer‑First Design</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span>Complete Documentation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span>Sandbox Testing</span>
                </li>
              </ul>
              <div className="flex items-center gap-3">
                <button className="au-btn au-btn-accent">
                  Explore All APIs
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="bg-white/10 border border-white/25 rounded-3xl p-8 flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center text-[var(--au-primary-700)] font-black text-3xl">
                  &lt;&gt;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaborate, Build, Unleash Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--au-bg-soft-1)] to-[var(--au-bg-soft-2)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--au-primary-700)] mb-6 leading-tight">
              Collaborate, Build, Unleash
            </h2>
            <p className="text-lg text-neutrals-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of developers building innovative financial solutions with AU Bank's comprehensive API ecosystem. From payments to account management, we provide the tools you need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/docs" className="au-btn au-btn-primary text-lg px-8 py-4" data-testid="button-browse-all-apis-hero">
                BROWSE ALL APIs
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/sandbox" className="au-btn au-btn-outline text-lg px-8 py-4">
                Try Sandbox
                <Play className="w-5 h-5" />
              </Link>
            </div>
            
            {/* Stats or Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--au-primary)] mb-2">50+</div>
                <div className="text-sm text-neutrals-600 font-medium">API Endpoints</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--au-primary)] mb-2">99.9%</div>
                <div className="text-sm text-neutrals-600 font-medium">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--au-primary)] mb-2">24/7</div>
                <div className="text-sm text-neutrals-600 font-medium">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-neutrals-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutrals-900 mb-4">How it Works?</h2>
            <p className="text-lg text-neutrals-600 max-w-3xl mx-auto">
              Get your developers onboard very quickly. Learn how to incorporate our AU Bank APIs in just a few easy steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-16 h-16 bg-[var(--au-primary)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-lg font-semibold mb-3 text-neutrals-800">Sign up for an AU Developer Account</h3>
              <p className="text-sm text-neutrals-600">Create your developer account to access our comprehensive API suite</p>
              
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute -right-4 top-8 transform -translate-y-1/2">
                <ArrowRight className="w-6 h-6 text-neutrals-400" />
              </div>
              
              {/* Arrow for mobile */}
              <div className="md:hidden flex justify-center mt-6 mb-2">
                <ArrowRight className="w-6 h-6 text-neutrals-400 rotate-90" />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-16 h-16 bg-[var(--au-primary)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-lg font-semibold mb-3 text-neutrals-800">Select API</h3>
              <p className="text-sm text-neutrals-600">Choose from our extensive collection of banking APIs for your needs</p>
              
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute -right-4 top-8 transform -translate-y-1/2">
                <ArrowRight className="w-6 h-6 text-neutrals-400" />
              </div>
              
              {/* Arrow for mobile */}
              <div className="md:hidden flex justify-center mt-6 mb-2">
                <ArrowRight className="w-6 h-6 text-neutrals-400 rotate-90" />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--au-primary)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-lg font-semibold mb-3 text-neutrals-800">Test it Out</h3>
              <p className="text-sm text-neutrals-600">Use our sandbox environment to test and integrate seamlessly</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/signup">
              <button className="au-btn au-btn-primary" data-testid="button-signup-process">
                SIGN UP
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Journey to go Live */}
      <section className="py-20 bg-gradient-to-br from-white to-[var(--au-bg-soft-1)]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--au-primary-700)] mb-4">Journey to go Live</h2>
            <p className="text-lg text-neutrals-600 max-w-2xl mx-auto">Follow our streamlined path from development to production</p>
          </div>
          
          <div className="flex justify-center items-center gap-12 mb-12">
            <div className="text-center group">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Play className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutrals-800 mb-2">SANDBOX</h3>
              <p className="text-sm text-neutrals-600">Test & Develop</p>
            </div>
            
            <ArrowRight className="w-10 h-10 text-[var(--au-primary)] opacity-60" />
            
            <div className="text-center group">
              <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Target className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutrals-800 mb-2">UAT</h3>
              <p className="text-sm text-neutrals-600">User Testing</p>
            </div>
            
            <ArrowRight className="w-10 h-10 text-[var(--au-primary)] opacity-60" />
            
            <div className="text-center group">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Globe className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neutrals-800 mb-2">PRODUCTION</h3>
              <p className="text-sm text-neutrals-600">Go Live</p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base text-neutrals-600 mb-4">
              Access AU Bank's internal development environments. Use Sandbox for internal testing, UAT for team validation, and Production for internal system integration.
            </p>
            <p className="text-sm text-neutrals-500">
              *Disclaimer: Access to UAT & Production environment is subject to business approvals, NDA and other agreements, and is at the sole discretion of AU Bank.
            </p>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchQuery && (
        <section id="search-results" className="py-12 bg-gradient-to-b from-yellow-50 to-white border-t-2 border-yellow-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--au-primary-700)] mb-4">
                Search Results for "{searchQuery}"
              </h2>
              {hasSearchResults && (
                <p className="text-lg text-neutrals-600">
                  Found {filteredApiCategories.length + filteredFeaturedApis.length} result{filteredApiCategories.length + filteredFeaturedApis.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            {showNoResults && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-500 mb-6">Try searching with different keywords like "payment", "authentication", or "banking"</p>
                <Button 
                  onClick={() => setSearchQuery("")}
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Clear Search
                </Button>
              </div>
            )}
            
            {/* API Categories Results */}
            {filteredApiCategories.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-bold text-[var(--au-primary-700)] mb-6">API Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredApiCategories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-yellow-200 bg-yellow-50/50 backdrop-blur-sm hover:bg-white hover:-translate-y-1">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-[var(--au-primary)]/10 to-[var(--au-primary)]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className={`w-7 h-7 ${category.color}`} />
                            </div>
                            <CardTitle className="text-lg font-bold text-neutrals-800">{category.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-neutrals-600 leading-relaxed text-sm">
                            {category.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Featured APIs Results */}
            {filteredFeaturedApis.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-[var(--au-primary-700)] mb-6">Individual APIs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredFeaturedApis.map((api, index) => {
                    const IconComponent = api.icon;
                    return (
                      <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 border-yellow-200 bg-yellow-50/50 backdrop-blur-sm hover:bg-white hover:-translate-y-1">
                        <CardHeader className="pb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-[var(--au-primary)]/10 to-[var(--au-primary)]/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className={`w-7 h-7 ${api.color}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold mb-2 text-neutrals-800">{api.title}</CardTitle>
                              <Badge variant="secondary" className="text-xs px-2 py-1 bg-[var(--au-primary)]/10 text-[var(--au-primary-700)] border-0">
                                {api.category}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-neutrals-600 leading-relaxed text-sm">
                            {api.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
            
            {hasSearchResults && (
              <div className="text-center mt-8">
                <Button 
                  onClick={() => setSearchQuery("")}
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-white mr-4"
                >
                  Clear Search
                </Button>
                <Link href="/docs">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90"
                  >
                    Browse All APIs
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Available APIs */}
      {!searchQuery && (
        <section id="apis" className="py-20 bg-gradient-to-b from-[var(--au-bg-soft-2)]/20 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--au-primary-700)] mb-6">Available APIs</h2>
              <p className="text-lg text-neutrals-600 max-w-3xl mx-auto">Discover our comprehensive suite of banking APIs designed to power your financial applications</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dynamicApiCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index} className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-2">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[var(--au-primary)]/10 to-[var(--au-primary)]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className={`w-8 h-8 ${category.color}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-neutrals-800">{category.title}</CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs bg-[var(--au-primary)]/10">
                            {category.apiCount} APIs
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutrals-600 leading-relaxed text-base mb-4">
                        {category.description}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-[var(--au-primary-700)]">Key APIs:</p>
                        <div className="grid gap-1">
                          {category.apis.slice(0, 3).map((api, apiIndex) => (
                            <div key={apiIndex} className="flex items-center text-sm">
                              <span className="font-mono text-neutrals-700">{api.name}</span>
                            </div>
                          ))}
                          {category.apis.length > 3 && (
                            <p className="text-xs text-neutrals-500">+{category.apis.length - 3} more APIs</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/docs" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 border-primary text-primary hover:bg-primary hover:text-white text-lg"
                data-testid="button-browse-all-apis"
              >
                BROWSE ALL APIs
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured APIs */}
      {!searchQuery && (
        <section className="py-20 bg-gradient-to-r from-white via-[var(--au-bg-soft-3)]/10 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--au-primary-700)] mb-6">Featured APIs</h2>
              <p className="text-lg text-neutrals-600 max-w-3xl mx-auto">Our most popular and powerful APIs trusted by leading fintech companies</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredApis.map((api, index) => {
                const IconComponent = api.icon;
                return (
                  <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:bg-white hover:-translate-y-1">
                    <CardHeader className="pb-6">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-[var(--au-primary)]/10 to-[var(--au-primary)]/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className={`w-8 h-8 ${api.color}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-bold mb-3 text-neutrals-800">{api.title}</CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-sm px-3 py-1 bg-[var(--au-primary)]/10 text-[var(--au-primary-700)] border-0">
                              {api.category}
                            </Badge>
                          </div>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">
                            {api.endpoint}
                          </code>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutrals-600 leading-relaxed text-base mb-4">
                        {api.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {api.features.map((feature, featureIndex) => (
                          <span key={featureIndex} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[var(--au-primary)]/5 text-[var(--au-primary-700)] border border-[var(--au-primary)]/20">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}


      {/* Footer */}
      <footer className="bg-gradient-to-r from-[var(--au-primary-900)] via-[var(--au-primary-700)] to-[var(--au-primary-900)] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold">AU Bank Developer Portal</h3>
              </div>
              <p className="text-neutrals-400 text-sm">
                Empowering developers with comprehensive banking APIs for modern financial solutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-neutrals-400">
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sandbox</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Get Started</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-neutrals-400">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-neutrals-400">
                <li>Email: developers@aubank.in</li>
                <li>Phone: 1800-XXX-XXXX</li>
                <li>Support: 24/7 Available</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutrals-800 mt-8 pt-8 text-center text-sm text-neutrals-400">
            <p>&copy; 2024 AU Bank Internal Developer Portal. All rights reserved. | Internal Use Only | Privacy Policy</p>
            <div className="mt-2">
              <Link href="/admin" className="text-neutrals-500 hover:text-white transition-colors text-xs">
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}