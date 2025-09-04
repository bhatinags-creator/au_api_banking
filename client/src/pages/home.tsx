import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Building2, CreditCard, Shield, Lock, Zap, FileText, Headphones } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="header-bg w-full h-20 flex items-center justify-between px-6 lg:px-24">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-white text-2xl font-semibold" data-testid="logo-text">
            API Banking Portal
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/apis" 
            className="text-white text-base font-normal hover:text-blue-300 transition-colors duration-200"
          >
            <span data-testid="link-apis">APIs</span>
          </Link>
          <Link 
            href="/docs" 
            className="text-white text-base font-normal hover:text-blue-300 transition-colors duration-200"
          >
            <span data-testid="link-docs">Documentation</span>
          </Link>
          <Link 
            href="/sandbox" 
            className="text-white text-base font-normal hover:text-blue-300 transition-colors duration-200"
          >
            <span data-testid="link-sandbox">Sandbox</span>
          </Link>
          <Link 
            href="/dashboard" 
            className="text-white text-base font-normal hover:text-blue-300 transition-colors duration-200"
          >
            <span data-testid="link-my-apps">My Apps</span>
          </Link>
          <Link 
            href="/analytics" 
            className="text-white text-base font-normal hover:text-blue-300 transition-colors duration-200"
          >
            <span data-testid="link-analytics">Analytics</span>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden header-bg" data-testid="mobile-menu">
          <nav className="px-6 py-4 space-y-4">
            <Link href="/apis" className="block text-white text-base font-normal" data-testid="mobile-link-apis">
              APIs
            </Link>
            <Link href="/docs" className="block text-white text-base font-normal" data-testid="mobile-link-docs">
              Documentation
            </Link>
            <Link href="/sandbox" className="block text-white text-base font-normal" data-testid="mobile-link-sandbox">
              Sandbox
            </Link>
            <Link href="/dashboard" className="block text-white text-base font-normal" data-testid="mobile-link-my-apps">
              My Apps
            </Link>
            <Link href="/analytics" className="block text-white text-base font-normal" data-testid="mobile-link-analytics">
              Analytics
            </Link>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="w-full bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="text-center space-y-8">
            {/* Hero Title */}
            <h1 className="primary-blue text-4xl lg:text-6xl font-bold leading-tight" data-testid="hero-title">
              Build. Test. Innovate with Our APIs
            </h1>
            
            {/* Hero Subtitle */}
            <p className="text-dark text-lg lg:text-xl font-normal max-w-3xl mx-auto leading-relaxed" data-testid="hero-subtitle">
              Access Payments, Accounts, KYC and more in a secure sandbox environment.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/apis">
                <Button 
                  className="btn-primary text-white text-lg font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
                  data-testid="button-explore-apis"
                >
                  Explore APIs
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  className="btn-secondary text-white text-lg font-semibold px-8 py-4 rounded-lg hover:bg-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
                  data-testid="button-get-api-key"
                >
                  Get API Key
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* API Categories Section */}
      <section className="w-full bg-gray-50 py-16 lg:py-24" id="apis">
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-darker text-3xl lg:text-4xl font-bold mb-4" data-testid="section-title-api-categories">
              API Categories
            </h2>
            <p className="text-dark text-lg max-w-2xl mx-auto" data-testid="section-subtitle-api-categories">
              Explore our comprehensive suite of banking APIs designed for modern financial applications
            </p>
          </div>
          
          {/* API Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Accounts API Card */}
            <Link href="/apis">
              <div className="card-bg rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-100 cursor-pointer" data-testid="card-accounts-api">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-darker text-xl font-semibold" data-testid="title-accounts-api">
                    Accounts API
                  </h3>
                  <p className="text-dark text-base leading-relaxed" data-testid="description-accounts-api">
                    Access balances & transactions
                  </p>
                  <span 
                    className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200"
                    data-testid="button-learn-more-accounts"
                  >
                    Learn More →
                  </span>
                </div>
              </div>
            </Link>
            
            {/* Payments API Card */}
            <Link href="/apis">
              <div className="card-bg rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-100 cursor-pointer" data-testid="card-payments-api">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-darker text-xl font-semibold" data-testid="title-payments-api">
                    Payments API
                  </h3>
                  <p className="text-dark text-base leading-relaxed" data-testid="description-payments-api">
                    Send & receive payments
                  </p>
                  <span 
                    className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200"
                    data-testid="button-learn-more-payments"
                  >
                    Learn More →
                  </span>
                </div>
              </div>
            </Link>
            
            {/* KYC API Card */}
            <Link href="/apis">
              <div className="card-bg rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-100 cursor-pointer" data-testid="card-kyc-api">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-darker text-xl font-semibold" data-testid="title-kyc-api">
                    KYC API
                  </h3>
                  <p className="text-dark text-base leading-relaxed" data-testid="description-kyc-api">
                    Verify customer identity
                  </p>
                  <span 
                    className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200"
                    data-testid="button-learn-more-kyc"
                  >
                    Learn More →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="w-full bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="text-center mb-12">
            <h2 className="text-darker text-3xl lg:text-4xl font-bold mb-4" data-testid="section-title-features">
              Why Choose Our APIs?
            </h2>
            <p className="text-dark text-lg max-w-2xl mx-auto" data-testid="section-subtitle-features">
              Built for developers, trusted by enterprises
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4" data-testid="feature-security">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-darker text-lg font-semibold" data-testid="title-feature-security">
                Bank-Grade Security
              </h3>
              <p className="text-dark text-sm" data-testid="description-feature-security">
                End-to-end encryption and compliance
              </p>
            </div>
            
            <div className="text-center space-y-4" data-testid="feature-speed">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-darker text-lg font-semibold" data-testid="title-feature-speed">
                Lightning Fast
              </h3>
              <p className="text-dark text-sm" data-testid="description-feature-speed">
                Sub-second response times globally
              </p>
            </div>
            
            <div className="text-center space-y-4" data-testid="feature-documentation">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-darker text-lg font-semibold" data-testid="title-feature-documentation">
                Rich Documentation
              </h3>
              <p className="text-dark text-sm" data-testid="description-feature-documentation">
                Comprehensive guides and examples
              </p>
            </div>
            
            <div className="text-center space-y-4" data-testid="feature-support">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Headphones className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-darker text-lg font-semibold" data-testid="title-feature-support">
                24/7 Support
              </h3>
              <p className="text-dark text-sm" data-testid="description-feature-support">
                Expert technical assistance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="header-bg w-full py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold" data-testid="footer-brand">
                API Banking Portal
              </h3>
              <p className="text-gray-300 text-sm" data-testid="footer-description">
                Empowering developers with secure banking APIs
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white text-base font-medium" data-testid="footer-section-apis">
                APIs
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <a href="#accounts" className="hover:text-white transition-colors" data-testid="footer-link-accounts">
                    Accounts
                  </a>
                </li>
                <li>
                  <a href="#payments" className="hover:text-white transition-colors" data-testid="footer-link-payments">
                    Payments
                  </a>
                </li>
                <li>
                  <a href="#kyc" className="hover:text-white transition-colors" data-testid="footer-link-kyc">
                    KYC
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white text-base font-medium" data-testid="footer-section-developer">
                Developer
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <a href="#docs" className="hover:text-white transition-colors" data-testid="footer-link-docs">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#sandbox" className="hover:text-white transition-colors" data-testid="footer-link-sandbox-footer">
                    Sandbox
                  </a>
                </li>
                <li>
                  <a href="#support" className="hover:text-white transition-colors" data-testid="footer-link-support">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white text-base font-medium" data-testid="footer-section-company">
                Company
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <a href="#about" className="hover:text-white transition-colors" data-testid="footer-link-about">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors" data-testid="footer-link-contact">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-white transition-colors" data-testid="footer-link-privacy">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center">
            <p className="text-gray-300 text-sm" data-testid="footer-copyright">
              © 2024 API Banking Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
