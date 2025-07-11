import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Plane, Menu, X } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Đóng mobile menu khi navigate
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <Plane className="h-8 w-8 text-teal-600" />
            <h1 className="text-2xl font-bold text-gray-800">Cloud Airline</h1>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => handleNavigation('/')}
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              Trang chủ
            </button>
            <button
              onClick={() => handleNavigation('/flights')}
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              Chuyến bay
            </button>
            <button
              onClick={() => handleNavigation('/promotions')}
              className="text-gray-700 hover:text-orange-500 transition-colors"
            >
              Khuyến mãi
            </button>
            <button
              onClick={() => handleNavigation('/contact')}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Liên hệ
            </button>
          </nav>
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              className="border border-teal-500 text-teal-600 bg-white hover:bg-teal-50 hover:text-teal-700"
              onClick={() => handleNavigation('/auth/sign-in')}
            >
              Đăng nhập
            </Button>
            <Button
              className="bg-teal-500 text-white hover:bg-teal-600 shadow-md"
              onClick={() => handleNavigation('/auth/sign-up')}
            >
              Đăng ký
            </Button>
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-teal-600 p-2"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => handleNavigation('/')}
                className="text-gray-700 hover:text-teal-600 transition-colors text-left"
              >
                Trang chủ
              </button>
              <button
                onClick={() => handleNavigation('/flights')}
                className="text-gray-700 hover:text-teal-600 transition-colors text-left"
              >
                Chuyến bay
              </button>
              <button
                onClick={() => handleNavigation('/promotions')}
                className="text-gray-700 hover:text-orange-500 transition-colors text-left"
              >
                Khuyến mãi
              </button>
              <button
                onClick={() => handleNavigation('/contact')}
                className="text-gray-700 hover:text-purple-600 transition-colors text-left"
              >
                Liên hệ
              </button>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Button
                  className="border border-teal-500 text-teal-600 bg-white hover:bg-teal-50 hover:text-teal-700 w-full"
                  onClick={() => handleNavigation('/auth/sign-in')}
                >
                  Đăng nhập
                </Button>
                <Button
                  className="bg-teal-500 text-white hover:bg-teal-600 w-full shadow-md"
                  onClick={() => handleNavigation('/auth/sign-up')}
                >
                  Đăng ký
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
