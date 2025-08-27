import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { University, MessageCircle, Instagram, Twitter, FileSpreadsheet, Menu, X, User, Award, Briefcase, Zap, Download, Upload, Archive, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/customize-results', label: 'Result Creator', icon: University },
    { path: '/report-card-editor', label: 'Report Cards', icon: FileText },
    // { path: '/whatsapp-generator', label: 'WhatsApp Chat', icon: MessageCircle },
    // { path: '/instagram-generator', label: 'Instagram DM', icon: Instagram },
    { path: '/twitter-generator', label: 'Twitter Post', icon: Twitter },
    { path: '/linkedin-generator', label: 'LinkedIn Post', icon: User },
    { path: '/portfolio-generator', label: 'Portfolio', icon: Briefcase },
    { path: '/certificate-generator', label: 'Certificates', icon: Award },
    { path: '/excel-generator', label: 'Excel Generator', icon: FileSpreadsheet },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-2 left-10 w-2 h-2 bg-blue-200 rounded-full animate-float opacity-30"></div>
        <div className="absolute top-3 right-20 w-1.5 h-1.5 bg-purple-200 rounded-full animate-float opacity-25" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-2 left-1/3 w-1 h-1 bg-green-200 rounded-full animate-float opacity-20" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-3 right-1/4 w-1.5 h-1.5 bg-orange-200 rounded-full animate-float opacity-30" style={{animationDelay: '0.7s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-16">
          {/* Animated Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="group relative flex items-center gap-3 font-bold text-xl text-gray-900 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {/* Logo Icon with Animation */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-6">
                  <University className="h-6 w-6 text-white" />
                </div>
                
                {/* Floating Mini Icons */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-100 rounded border border-green-300 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300">
                  <Upload className="h-2 w-2 text-green-600 p-0.5" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-100 rounded border border-blue-300 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300" style={{animationDelay: '0.2s'}}>
                  <Download className="h-2 w-2 text-blue-600 p-0.5" />
                </div>
              </div>
              
              {/* Resulty Text with Effects */}
              <div className="hidden sm:block relative">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-500">
                  Resulty
                </span>
                
                {/* Processing Indicators */}
                <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
                
                {/* Hover Data Flow */}
                <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-4 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"></div>
                  </div>
                </div>
                
                <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Click Ripple Effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-20 group-active:bg-blue-500 group-active:animate-ping transition-all duration-200"></div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isActive(link.path)
                    ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-md'
                }`}
              >
                {/* Icon with Hover Animation */}
                <div className="relative">
                  <link.icon className={`h-4 w-4 transition-all duration-300 ${
                    isActive(link.path) 
                      ? 'text-blue-600' 
                      : 'group-hover:text-blue-600 group-hover:scale-110'
                  }`} />
                  
                  {/* Processing Dot for Active Link */}
                  {isActive(link.path) && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                  
                  {/* Hover Mini Animation */}
                  <div className="absolute -top-2 -right-2 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300"></div>
                </div>
                
                <span className="relative overflow-hidden">
                {link.label}
                  
                  {/* Hover Underline Animation */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
                </span>
                
                {/* Bulk Processing Indicator on Hover */}
                {link.path === '/' && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-lg border text-xs">
                      <div className="flex gap-0.5">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                      <span className="text-gray-600">Bulk Ready</span>
                    </div>
                  </div>
                )}
                
                {/* Click Ripple Effect */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-active:opacity-20 group-active:bg-blue-500 group-active:animate-ping transition-all duration-200"></div>
                
                {/* Floating Animation on Hover */}
                <div className="absolute inset-0 pointer-events-none">
                  <div 
                    className="absolute top-1 right-1 w-0.5 h-0.5 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float transition-all duration-300"
                    style={{animationDelay: `${index * 0.1}s`}}
                  ></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="group relative hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="relative">
                {isOpen ? (
                  <X className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-all duration-300 group-hover:rotate-90" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-all duration-300" />
                )}
                
                {/* Processing Indicators */}
                {isOpen && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
                
                {/* Hover Animation */}
                <div className="absolute -top-1 -right-1 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300"></div>
              </div>
              
              {/* Click Ripple Effect */}
              <div className="absolute inset-0 rounded opacity-0 group-active:opacity-20 group-active:bg-blue-500 group-active:animate-ping transition-all duration-200"></div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-slide-in-up">
            <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 bg-gradient-to-br from-white to-blue-50 border-t border-gray-200 relative">
              {/* Mobile Menu Background Animation */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-2 right-4 w-1 h-1 bg-blue-300 rounded-full animate-float opacity-40"></div>
                <div className="absolute bottom-2 left-6 w-1.5 h-1.5 bg-purple-300 rounded-full animate-float opacity-30" style={{animationDelay: '1s'}}></div>
              </div>
              
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                    isActive(link.path)
                      ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-md'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-white hover:to-blue-50 hover:shadow-lg'
                  }`}
                  onClick={() => setIsOpen(false)}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Icon with Animation */}
                  <div className="relative">
                    <link.icon className={`h-5 w-5 transition-all duration-300 ${
                      isActive(link.path) 
                        ? 'text-blue-600' 
                        : 'group-hover:text-blue-600 group-hover:scale-110'
                    }`} />
                    
                    {/* Active Processing Dot */}
                    {isActive(link.path) && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                    
                    {/* Hover Ping */}
                    <div className="absolute -top-1 -right-1 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300"></div>
                  </div>
                  
                  <span className="relative flex-1">
                  {link.label}
                    
                    {/* Hover Underline */}
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
                  </span>
                  
                  {/* Bulk Ready Badge for Result Creator */}
                  {link.path === '/' && (
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 border text-xs">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-600">Bulk</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Click Ripple Effect */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-active:opacity-20 group-active:bg-blue-500 group-active:animate-ping transition-all duration-200"></div>
                  
                  {/* Slide Animation on Hover */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    <div className="w-full h-full bg-blue-400 rounded-full"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
