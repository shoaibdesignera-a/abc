
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              MM&GG <span className="font-light text-slate-500 text-sm">Real Estate</span>
            </span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Listings</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Market Insights</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Selling</a>
            <a href="#" className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
