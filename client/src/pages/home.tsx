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
  Clock
} from "lucide-react";
import { Link } from "wouter";

const heroSlides = [
  {
    id: 1,
    title: "Fulfill all your banking needs with API integration",
    subtitle: "Avail AU Bank smart features for your business",
    features: ["Financial Data Integration", "Smooth Transactions", "Integrated Solution"],
    cta: "Know More About Business Banking",
    bgColor: "from-pink-200 to-pink-300"
  },
  {
    id: 2,
    title: "Make smooth business payments without any worries",
    subtitle: "Start API Banking with AU Bank to scale your business",
    features: ["Real-time Processing", "Secure Transactions", "24/7 Availability"],
    cta: "Know More About Payments",
    bgColor: "from-blue-600 to-blue-700"
  },
  {
    id: 3,
    title: "Build powerful fintech solutions with our comprehensive APIs",
    subtitle: "Transform your business with digital banking integration",
    features: ["Developer-First Design", "Complete Documentation", "Sandbox Testing"],
    cta: "Explore All APIs",
    bgColor: "from-green-600 to-green-700"
  }
];

const apiCategories = [
  {
    icon: Shield,
    title: "Building Blocks",
    description: "Essential APIs for integrating with core banking services. Run checks and validations using fundamental APIs such as KYC verification, account validation, and identity checks.",
    color: "text-blue-600"
  },
  {
    icon: Building2,
    title: "Business Banking",
    description: "Empower your corporate banking with seamless APIs for efficient transactions, cash deposits, smart reconciliation, and personalized management systems.",
    color: "text-green-600"
  },
  {
    icon: CreditCard,
    title: "Payments & UPI",
    description: "Industry-leading payment APIs to introduce tailored payment services. Multiple payment options to integrate your services with the outside world.",
    color: "text-orange-600"
  },
  {
    icon: Database,
    title: "Accounts and Deposits",
    description: "Enable customers to invest and bank with you by integrating savings accounts, corporate accounts, fixed deposits, and recurring deposit services.",
    color: "text-purple-600"
  },
  {
    icon: FileCheck,
    title: "Trade Services",
    description: "Incorporate remittances and bank guarantees APIs to make trade and business operations easy with our latest market-tailored offerings.",
    color: "text-pink-600"
  },
  {
    icon: Layers,
    title: "Corporate API Suite",
    description: "A curated collection of APIs specially selected to cater to evolving corporate client needs, studied after careful analysis of corporate journeys.",
    color: "text-indigo-600"
  }
];

const featuredApis = [
  {
    title: "CNB Payment Creation",
    category: "Payments",
    description: "Comprehensive payment creation API supporting NEFT, RTGS, and IMPS transactions with real-time status tracking and reconciliation.",
    icon: CreditCard,
    color: "text-orange-600"
  },
  {
    title: "Account Balance Inquiry",
    category: "Accounts",
    description: "Real-time account balance and transaction history APIs for seamless financial data integration and account management.",
    icon: Database,
    color: "text-purple-600"
  },
  {
    title: "OAuth Authentication",
    category: "Security",
    description: "Secure OAuth 2.0 implementation for API authentication with token management and refresh capabilities for enterprise security.",
    icon: Shield,
    color: "text-blue-600"
  },
  {
    title: "Corporate Onboarding",
    category: "Business Banking",
    description: "Streamlined corporate registration and KYC verification APIs with document upload and verification workflow automation.",
    icon: Building2,
    color: "text-green-600"
  }
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

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
              <a href="#apis" className="text-neutrals-700 hover:text-primary transition-colors">Explore APIs</a>
              <Link href="/sandbox" className="text-neutrals-700 hover:text-primary transition-colors">
                <span data-testid="link-sandbox">Sandbox</span>
              </Link>
              <Link href="/docs" className="text-neutrals-700 hover:text-primary transition-colors">
                <span data-testid="link-docs">Documentation</span>
              </Link>
              <a href="#" className="text-neutrals-700 hover:text-primary transition-colors">FAQ</a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Sign Up
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Sign In
              </Button>
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
              <a href="#apis" className="block text-neutrals-700 hover:text-primary">Explore APIs</a>
              <Link href="/sandbox" className="block text-neutrals-700 hover:text-primary">Sandbox</Link>
              <Link href="/docs" className="block text-neutrals-700 hover:text-primary">Documentation</Link>
              <a href="#" className="block text-neutrals-700 hover:text-primary">FAQ</a>
              <div className="flex space-x-4 pt-4">
                <Button variant="outline" size="sm" className="flex-1">Sign Up</Button>
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">Sign In</Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Bar */}
      <div className="bg-neutrals-50 py-3">
        <div className="container mx-auto px-4">
          <div className="relative max-w-md ml-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutrals-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search APIs by Name, Description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
              data-testid="input-search-apis"
            />
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
                <span className="badge bg-[var(--au-primary-900)] text-white px-3 py-1 rounded-full font-bold text-sm">
                  API
                </span>
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-neutrals-900 mb-4">
            Collaborate, Build, Unleash
          </h2>
          <button className="au-btn au-btn-primary">
            BROWSE ALL APIs
            <ArrowRight className="w-4 h-4" />
          </button>
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
          
          <div className="flex justify-center items-center gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-[var(--au-primary)] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Sign up for an AU Developer Account</h3>
            </div>
            
            <ArrowRight className="w-6 h-6 text-neutrals-400 flex-shrink-0" />
            
            <div className="text-center">
              <div className="w-12 h-12 bg-[var(--au-primary)] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Select API</h3>
            </div>
            
            <ArrowRight className="w-6 h-6 text-neutrals-400 flex-shrink-0" />
            
            <div className="text-center">
              <div className="w-12 h-12 bg-[var(--au-primary)] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Test it Out</h3>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="au-btn au-btn-primary">
              SIGN UP
            </button>
          </div>
        </div>
      </section>

      {/* Journey to go Live */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutrals-900 mb-6">Journey to go Live</h2>
          </div>
          
          <div className="flex justify-center items-center gap-8 mb-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Play className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">SANDBOX</h3>
            </div>
            
            <ArrowRight className="w-8 h-8 text-neutrals-400" />
            
            <div className="text-center">
              <div className="w-24 h-24 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Target className="w-12 h-12 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold">UAT</h3>
            </div>
            
            <ArrowRight className="w-8 h-8 text-neutrals-400" />
            
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Globe className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">PRODUCTION</h3>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base text-neutrals-600 mb-4">
              Signup to AU Bank API Banking Portal Sandbox environment to start your journey. Upgrade to UAT environment for end-to-end real-time testing, post your NDA with us. Go-live with integration to production environment.
            </p>
            <p className="text-sm text-neutrals-500">
              *Disclaimer: Access to UAT & Production environment is subject to business approvals, NDA and other agreements, and is at the sole discretion of AU Bank.
            </p>
          </div>
        </div>
      </section>

      {/* Available APIs */}
      <section id="apis" className="py-16 bg-neutrals-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutrals-900 mb-4">Available APIs</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apiCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-neutrals-100 rounded-lg flex items-center justify-center">
                        <IconComponent className={`w-6 h-6 ${category.color}`} />
                      </div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutrals-600 leading-relaxed">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              BROWSE ALL APIs
            </Button>
          </div>
        </div>
      </section>

      {/* Featured APIs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutrals-900 mb-4">Featured APIs</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredApis.map((api, index) => {
              const IconComponent = api.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-neutrals-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className={`w-6 h-6 ${api.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">{api.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {api.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutrals-600 leading-relaxed">
                      {api.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutrals-900 text-white py-12">
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
            <p>&copy; 2024 AU Small Finance Bank. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}