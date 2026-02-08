
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50/50 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-100/50 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-slate-900"></span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Exquisite Living Redefined</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight max-w-4xl mx-auto">
          Experience Real Estate in its <span className="serif italic">Finest Form</span>.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The ultimate platform for high-end properties, powered by intelligent market insights and curated for the most discerning buyers.
        </p>

        <div className="max-w-3xl mx-auto bg-white p-2 rounded-3xl shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center px-4 gap-3 border-b md:border-b-0 md:border-r border-slate-100 py-3">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
              type="text" 
              placeholder="Search by location, neighborhood, or style..." 
              className="bg-transparent border-none focus:ring-0 w-full text-slate-800 placeholder:text-slate-400"
            />
          </div>
          <div className="flex-none px-6 flex items-center gap-3 py-3">
             <div className="text-left">
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Property Type</span>
                <select className="bg-transparent border-none focus:ring-0 p-0 text-slate-900 font-bold appearance-none cursor-pointer">
                  <option>All Properties</option>
                  <option>Villas</option>
                  <option>Penthouses</option>
                  <option>Mansions</option>
                </select>
             </div>
          </div>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg md:w-auto w-full">
            Search Now
          </button>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-2xl font-bold text-slate-800 tracking-tighter">ARCHITECTURAL</div>
          <div className="text-2xl font-bold text-slate-800 tracking-tighter">DIGEST</div>
          <div className="text-2xl font-bold text-slate-800 tracking-tighter">MANSION GLOBAL</div>
          <div className="text-2xl font-bold text-slate-800 tracking-tighter">FORBES REALTY</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
