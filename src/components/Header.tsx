import React, { useState } from 'react';
import { NavTab } from '../types';
import { Mail, Award, TrendingUp, Menu, X, Building2 } from 'lucide-react';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onNavigateHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTabs: NavTab[] = [
    'HOME',
    'ABOUT US',
    'PRODUCT',
    'QUALITY SYSTEM',
    'INFRASTRUCTURE',
    'FEEDBACK',
    'CONTACT US',
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top Utility Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-b border-blue-800/40 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Status Pills */}
          <div className="flex items-center space-x-3 text-slate-300">
            <span className="inline-flex items-center space-x-1 bg-blue-500/20 text-blue-300 font-semibold px-2.5 py-0.5 rounded-full border border-blue-500/30 text-[11px]">
              <TrendingUp className="w-3 h-3 mr-1 text-blue-400" />
              <span>BSE Code: 524680</span>
            </span>
            <span className="hidden md:inline-flex items-center space-x-1 text-slate-400 text-[11px]">
              <Award className="w-3 h-3 text-[#38bdf8]" />
              <span>WHO-GMP & ISO 9001:2015 Certified</span>
            </span>
          </div>

          {/* Quick Info & Email */}
          <div className="flex items-center space-x-4 text-[11px] text-slate-300">
            <span className="hidden sm:inline text-slate-400">Regd. Office: Indore (M.P.) India</span>
            <a
              href="mailto:info@beryldrugs.com"
              className="flex items-center space-x-1 hover:text-blue-300 transition-colors font-medium text-blue-200"
            >
              <Mail className="w-3 h-3" />
              <span>info@beryldrugs.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Brand & Logo Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={onNavigateHome}
          className="cursor-pointer flex items-center space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl md:text-3xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                BERYL
              </span>
              <span className="text-lg md:text-xl font-light tracking-widest text-slate-300">
                DRUGS
              </span>
            </div>
            <span className="text-[10px] tracking-widest text-blue-400 uppercase font-semibold">
              Corporate & Investor Portal
            </span>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navbar Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 shadow-inner">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'HOME') {
                    onNavigateHome();
                  } else {
                    onTabChange(tab);
                  }
                }}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 font-extrabold scale-102'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-1">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'HOME') {
                    onNavigateHome();
                  } else {
                    onTabChange(tab);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
