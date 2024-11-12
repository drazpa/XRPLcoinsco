import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { ViewToggle } from './ViewToggle';
import { Menu, X, ArrowUpRight, ArrowDownRight, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useMobileView } from '../context/MobileContext';
import { useXRPPrice } from '../hooks/useXRPPrice';
import { useTickers } from '../context/TickerContext';
import { formatUSDPrice } from '../utils/formatters';

const Logo = () => (
  <div className="relative w-8 h-8 logo-coins">
    <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg animate-gradient" />
    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg animate-gradient" />
  </div>
);

export const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobileView } = useMobileView();
  const { price, loading, error, change24h } = useXRPPrice();
  const { showTickers, toggleTickers } = useTickers();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const XRPPrice = () => {
    if (isMobileView) return null;

    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">XRP</span>
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {loading ? '...' : formatUSDPrice(price || 0)}
        </span>
        {!loading && !error && change24h !== undefined && (
          <div className={`flex items-center ${
            change24h >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {change24h >= 0 ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            <span className="text-xs font-bold ml-0.5">
              {Math.abs(change24h).toFixed(2)}%
            </span>
          </div>
        )}
      </div>
    );
  };

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      onClick={() => setIsMenuOpen(false)}
      className={`text-sm font-bold button-glow px-4 py-2 rounded-lg transition-all ${
        location.pathname === to
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className="bg-white/90 dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm header-glow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center glow-effect">
            <Logo />
            <div className="ml-3">
              <span className="text-xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">
                  XRPL
                </span>
                <span className="text-gray-900 dark:text-white">Coins</span>
                <span className="text-gray-900 dark:text-white">.co</span>
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
                Discover the Future of Digital Assets
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-center space-x-4">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/featured">Featured</NavLink>
            <NavLink to="/all-coins">All Coins</NavLink>
            <NavLink to="/network">Network</NavLink>
          </div>

          {/* Right Side Controls */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/top-100"
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="font-medium">Top 100</span>
            </Link>
            <button
              onClick={toggleTickers}
              className="p-2 rounded-lg bg-gray-200/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 hover:bg-gray-300/80 dark:hover:bg-gray-600/80 backdrop-blur-sm transition-colors duration-200"
              title={showTickers ? 'Hide tickers' : 'Show tickers'}
            >
              {showTickers ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            <XRPPrice />
            <ViewToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link
              to="/top-100"
              className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              <TrendingUp className="h-4 w-4" />
            </Link>
            <button
              onClick={toggleTickers}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              title={showTickers ? 'Hide tickers' : 'Show tickers'}
            >
              {showTickers ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            <ViewToggle />
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-48 opacity-100 py-4'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="flex flex-col space-y-2">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/featured">Featured</NavLink>
            <NavLink to="/all-coins">All Coins</NavLink>
            <NavLink to="/network">Network</NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}