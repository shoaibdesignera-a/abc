
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import AIChatAssistant from './components/AIChatAssistant';
import { SAMPLE_PROPERTIES } from './constants';
import { getMarketInsights } from './services/geminiService';
import { MarketInsight } from './types';

const App: React.FC = () => {
  const [insightLocation, setInsightLocation] = useState('London');
  const [insight, setInsight] = useState<MarketInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const fetchInsights = async () => {
    setIsLoadingInsight(true);
    try {
      const data = await getMarketInsights(insightLocation);
      setInsight(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-slate-900 selection:text-white">
      <Navbar />
      
      <main>
        <Hero />

        {/* Featured Properties */}
        <section className="py-24 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Curated Collection</h2>
                <p className="text-slate-600 max-w-xl">Explore our hand-picked selection of global residences that redefine luxury and comfort.</p>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 hover:bg-slate-50 transition">
                  Filter Listings
                </button>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                  View All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SAMPLE_PROPERTIES.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        {/* AI Market Insights Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
              <div className="flex-1 p-10 lg:p-20 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-6">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-bold tracking-widest uppercase">Live AI Intelligence</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  Real-time <span className="serif italic font-light">Market Intelligence</span>.
                </h2>
                <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                  Leverage our proprietary AI models to understand global market shifts before they happen. Get instant reports on any luxury neighborhood worldwide.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <input 
                    type="text" 
                    value={insightLocation}
                    onChange={(e) => setInsightLocation(e.target.value)}
                    placeholder="Enter location (e.g. Dubai, London, NYC)"
                    className="flex-1 bg-white/10 border-white/20 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-white/50 text-white placeholder:text-white/30"
                  />
                  <button 
                    onClick={fetchInsights}
                    disabled={isLoadingInsight}
                    className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition disabled:opacity-50"
                  >
                    {isLoadingInsight ? 'Analyzing...' : 'Generate Report'}
                  </button>
                </div>

                {insight && (
                  <div className="bg-white/5 rounded-3xl p-8 border border-white/10 animate-in fade-in zoom-in duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold">{insight.location} Overview</h4>
                      <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                        insight.trend === 'up' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-red-400/20 text-red-400'
                      }`}>
                        {insight.trend === 'up' ? '↑ Rising' : '↓ Cooling'}
                      </div>
                    </div>
                    <div className="text-slate-300 text-sm leading-relaxed mb-6 space-y-2">
                       {insight.summary.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                    {insight.sources.length > 0 && (
                      <div className="pt-6 border-t border-white/10">
                        <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">Sources Verified</span>
                        <div className="flex flex-wrap gap-2">
                          {insight.sources.slice(0, 3).map((source, i) => (
                            <a 
                              key={i} 
                              href={source.uri} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-xs bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition truncate max-w-[150px]"
                            >
                              {source.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="lg:w-1/3 bg-slate-800 relative hidden lg:block overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/luxuryarch/800/1200" 
                  alt="Architecture" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to find your <span className="serif italic font-light">dream estate</span>?</h2>
            <p className="text-slate-600 text-xl mb-12">Connect with our senior consultants today and experience the MM&GG advantage.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition shadow-2xl">
                Contact an Agent
              </button>
              <button className="px-10 py-5 border-2 border-slate-900 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-50 transition">
                List Your Property
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold">M</div>
                <span className="font-bold text-xl tracking-tight">MM&GG</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Excellence in luxury real estate, powered by artificial intelligence and decades of local expertise.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-6">Properties</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-900 transition">Buy a Home</a></li>
                <li><a href="#" className="hover:text-slate-900 transition">Sell Your Estate</a></li>
                <li><a href="#" className="hover:text-slate-900 transition">Luxury Rentals</a></li>
                <li><a href="#" className="hover:text-slate-900 transition">Investment Portfolio</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-6">Company</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-900 transition">Our Story</a></li>
                <li><a href="#" className="hover:text-slate-900 transition">AI Technology</a></li>
                <li><a href="#" className="hover:text-slate-900 transition">Careers</a></li>
                <li><a href="#" className="hover:text-slate-900 transition">Press Room</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-6">Newsletter</h5>
              <p className="text-sm text-slate-500 mb-4">Subscribe to receive curated luxury listings and market reports.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email address" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm w-full focus:ring-2 focus:ring-slate-900 outline-none" />
                <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">Join</button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
            <p>© 2025 MM&GG Real Estate Ltd. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-slate-900 transition">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 transition">Terms of Service</a>
              <a href="#" className="hover:text-slate-900 transition">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant */}
      <AIChatAssistant />
    </div>
  );
};

export default App;
