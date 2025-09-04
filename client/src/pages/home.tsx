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
      <header className="au-nav w-full h-20 flex items-center justify-between px-6 lg:px-24">
        {/* AU Bank Logo */}
        <div className="au-logo" data-testid="au-bank-logo">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <div className="text-2xl font-bold" style={{background: 'linear-gradient(135deg, #662D91 0%, #FF6B35 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                AU
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-xl font-bold leading-none">AU SMALL FINANCE BANK</span>
              <span className="text-white/80 text-sm font-medium">API Banking Portal</span>
            </div>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/apis" className="au-nav-link" data-testid="link-apis">
            APIs
          </Link>
          <Link href="/docs" className="au-nav-link" data-testid="link-docs">
            Documentation
          </Link>
          <Link href="/sandbox" className="au-nav-link" data-testid="link-sandbox">
            Sandbox
          </Link>
          <Link href="/dashboard" className="au-nav-link" data-testid="link-my-apps">
            My Apps
          </Link>
          <Link href="/analytics" className="au-nav-link" data-testid="link-analytics">
            Analytics
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
        <div className="md:hidden au-nav" data-testid="mobile-menu">
          <nav className="px-6 py-4 space-y-2">
            <Link href="/apis" className="block px-4 py-2 text-white hover:bg-white/10 rounded transition-colors duration-200" data-testid="mobile-link-apis" onClick={() => setMobileMenuOpen(false)}>
              APIs
            </Link>
            <Link href="/docs" className="block px-4 py-2 text-white hover:bg-white/10 rounded transition-colors duration-200" data-testid="mobile-link-docs" onClick={() => setMobileMenuOpen(false)}>
              Documentation
            </Link>
            <Link href="/sandbox" className="block px-4 py-2 text-white hover:bg-white/10 rounded transition-colors duration-200" data-testid="mobile-link-sandbox" onClick={() => setMobileMenuOpen(false)}>
              Sandbox
            </Link>
            <Link href="/dashboard" className="block px-4 py-2 text-white hover:bg-white/10 rounded transition-colors duration-200" data-testid="mobile-link-my-apps" onClick={() => setMobileMenuOpen(false)}>
              My Apps
            </Link>
            <Link href="/analytics" className="block px-4 py-2 text-white hover:bg-white/10 rounded transition-colors duration-200" data-testid="mobile-link-analytics" onClick={() => setMobileMenuOpen(false)}>
              Analytics
            </Link>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="au-hero w-full py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="text-center space-y-10">
            {/* AU Bank Logo in Hero */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <div className="text-4xl font-bold" style={{background: 'linear-gradient(135deg, #662D91 0%, #FF6B35 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                  AU
                </div>
              </div>
            </div>
            
            {/* Hero Title */}
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-gray-900" data-testid="hero-title">
              Welcome to
              <span className="au-hero-text block mt-2">AU Small Finance Bank</span>
              <span className="au-hero-text">API Banking Portal</span>
            </h1>
            
            {/* Hero Subtitle */}
            <p className="text-xl lg:text-2xl font-normal max-w-4xl mx-auto leading-relaxed text-gray-600" data-testid="hero-subtitle">
              Transform your financial applications with our comprehensive suite of banking APIs. 
              Experience seamless integration, enterprise-grade security, and developer-first design.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12">
              <Link href="/corporate-registration">
                <button 
                  className="au-button text-lg px-10 py-4 shadow-lg" 
                  data-testid="button-get-started"
                >
                  Get Started
                </button>
              </Link>
              <Link href="/docs">
                <button 
                  className="au-button-orange text-lg px-10 py-4 shadow-lg" 
                  data-testid="button-explore-apis"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Explore APIs
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* API Categories Section */}
      <section className="w-full bg-white py-20 lg:py-28" id="apis">
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900" data-testid="section-title-api-categories">
              API Categories
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-600 leading-relaxed" data-testid="section-subtitle-api-categories">
              Explore our comprehensive suite of banking APIs designed for modern financial applications
            </p>
          </div>
          
          {/* API Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Accounts API Card */}
            <Link href="/apis">
              <div className="au-card p-8" data-testid="card-accounts-api">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #F3E8FF 0%, #FFF7ED 100%)'}}>
                    <Building2 className="w-8 h-8 text-purple-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4" data-testid="title-accounts-api">
                    Accounts API
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed" data-testid="description-accounts-api">
                    Access account balances, transaction history, and comprehensive account management features
                  </p>
                  <span 
                    className="au-purple font-medium hover:text-purple-800 transition-colors duration-200"
                    data-testid="button-learn-more-accounts"
                  >
                    Learn More →
                  </span>
                </div>
              </div>
            </Link>
            
            {/* Payments API Card */}
            <Link href="/apis">
              <div className="au-card p-8" data-testid="card-payments-api">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #FFF7ED 0%, #F3E8FF 100%)'}}>
                    <CreditCard className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4" data-testid="title-payments-api">
                    Payments API
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed" data-testid="description-payments-api">
                    Secure payment processing with CNB payments, UPI, and real-time transaction tracking
                  </p>
                  <span 
                    className="au-orange font-medium hover:text-orange-800 transition-colors duration-200"
                    data-testid="button-learn-more-payments"
                  >
                    Learn More →
                  </span>
                </div>
              </div>
            </Link>
            
            {/* KYC API Card */}
            <Link href="/apis">
              <div className="au-card p-8" data-testid="card-kyc-api">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #F3E8FF 0%, #FFF7ED 100%)'}}>
                    <Shield className="w-8 h-8 text-purple-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4" data-testid="title-kyc-api">
                    KYC API
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed" data-testid="description-kyc-api">
                    Complete customer verification with identity validation and compliance management
                  </p>
                  <span 
                    className="au-purple font-medium hover:text-purple-800 transition-colors duration-200"
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
