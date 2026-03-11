import React, { useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  category: string;
  priceAED: number;
  rangeKm: number;
  topSpeedKmh: number;
  image: string;
  description: string;
  featured?: boolean;
};

const STORAGE_KEY = 'zaplon-cms-products-v1';

const defaultProducts: Product[] = [
  {
    id: 's1',
    name: 'Zaplon Falcon X Pro',
    category: 'Performance',
    priceAED: 6990,
    rangeKm: 90,
    topSpeedKmh: 65,
    image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&w=1400&q=80',
    description: 'Dual-motor powerhouse engineered for high-speed commuting in Dubai Marina.',
    featured: true,
  },
  {
    id: 's2',
    name: 'Zaplon Urban Glide 3',
    category: 'Commuter',
    priceAED: 3890,
    rangeKm: 55,
    topSpeedKmh: 42,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1400&q=80',
    description: 'Daily city cruiser with comfort suspension and rapid-charging battery.',
    featured: true,
  },
  {
    id: 's3',
    name: 'Zaplon Junior Spark',
    category: 'Kids',
    priceAED: 1490,
    rangeKm: 20,
    topSpeedKmh: 18,
    image: 'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=1400&q=80',
    description: 'Safety-first electric scooter with app-based parental speed lock.',
    featured: true,
  },
];

const trustBadges = [
  'Same-Day Dubai Delivery',
  '12-Month Local Warranty',
  'Certified Original Products',
  '5-Star Service Center',
];

const reviewCards = [
  {
    quote: 'Best scooter buying experience in UAE. Delivery in 6 hours and setup support was perfect.',
    author: 'Maha A.',
  },
  {
    quote: 'Their recommendation quiz matched me with the exact scooter for my office commute.',
    author: 'Rohan K.',
  },
  {
    quote: 'Very premium website and transparent specs. Service team is super responsive on WhatsApp.',
    author: 'Hassan M.',
  },
];

const useRevealOnScroll = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15 }
    );

    const targets = document.querySelectorAll('.reveal');
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const [showCms, setShowCms] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Commuter',
    priceAED: '',
    rangeKm: '',
    topSpeedKmh: '',
    image: '',
    description: '',
  });

  useRevealOnScroll();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsHeaderCompact(y > 24);
      setParallaxY(y * 0.25);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Zaplon Electric Scooter Collection',
      itemListElement: products.map((product, index) => ({
        '@type': 'Product',
        position: index + 1,
        name: product.name,
        image: product.image,
        description: product.description,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'AED',
          price: product.priceAED,
          availability: 'https://schema.org/InStock',
        },
      })),
    };

    const existing = document.getElementById('seo-products-schema');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'seo-products-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => script.remove();
  }, [products]);

  const featuredProducts = useMemo(() => products.filter((p) => p.featured).slice(0, 8), [products]);

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const next: Product = {
      id: crypto.randomUUID(),
      name: form.name,
      category: form.category,
      priceAED: Number(form.priceAED),
      rangeKm: Number(form.rangeKm),
      topSpeedKmh: Number(form.topSpeedKmh),
      image: form.image,
      description: form.description,
      featured: true,
    };

    setProducts((prev) => [next, ...prev]);
    setForm({
      name: '',
      category: 'Commuter',
      priceAED: '',
      rangeKm: '',
      topSpeedKmh: '',
      image: '',
      description: '',
    });
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden">
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isHeaderCompact ? 'py-2 backdrop-blur-2xl bg-slate-950/80 border-b border-white/10' : 'py-4 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <a href="#" className="font-black tracking-wide text-xl">ZAPLON.AE</a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#brands" className="hover:text-cyan-300 transition">Brands</a>
            <a href="#featured" className="hover:text-cyan-300 transition">Best Sellers</a>
            <a href="#quiz" className="hover:text-cyan-300 transition">Find Your Ride</a>
            <a href="#reviews" className="hover:text-cyan-300 transition">Reviews</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCms((v) => !v)} className="px-4 py-2 rounded-full border border-cyan-300/50 text-cyan-200 text-sm hover:bg-cyan-300/10 transition">CMS Console</button>
            <button className="px-4 py-2 rounded-full bg-cyan-400 text-slate-950 font-semibold text-sm hover:scale-105 transition">Shop Now</button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-[92vh] flex items-center">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              transform: `translateY(${parallaxY}px) scale(1.08)`,
              backgroundImage: "url('https://images.unsplash.com/photo-1623072389569-4f5f3ef7f87d?auto=format&fit=crop&w=2200&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-cyan-950/30" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="reveal max-w-3xl">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs tracking-widest uppercase">Dubai's Premium Electric Mobility Store</span>
              <h1 className="mt-6 text-5xl md:text-7xl font-black leading-[1.05]">Zap Your Way Through The City.</h1>
              <p className="mt-6 text-lg text-slate-300">Professional-grade scooters, local UAE warranty, and high-performance models curated for commuters, enthusiasts, and families.</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-cyan-400 text-slate-950 rounded-2xl font-bold hover:scale-105 transition">Shop Scooters</button>
                <button className="px-8 py-4 border border-white/30 rounded-2xl font-semibold hover:bg-white/10 transition">Explore Brands</button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6 bg-slate-900 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustBadges.map((badge) => (
              <div key={badge} className="reveal px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-medium">
                {badge}
              </div>
            ))}
          </div>
        </section>

        <section id="brands" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal mb-10">
              <h2 className="text-4xl font-bold">Brand & Category Grid</h2>
              <p className="text-slate-400 mt-2">Hover-animated experience for Segway, Xiaomi, Kugoo, commuter, performance and kids rides.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Segway', 'Xiaomi', 'Kugoo', 'Commuter', 'Performance', 'Kids'].map((item) => (
                <article key={item} className="reveal group relative rounded-3xl overflow-hidden border border-white/10 min-h-52">
                  <img src={`https://source.unsplash.com/900x700/?electric-scooter,${item}`} alt={item} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                  <h3 className="absolute left-6 bottom-6 text-2xl font-bold">{item}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="featured" className="py-20 bg-slate-900/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal flex justify-between items-end mb-10">
              <div>
                <h2 className="text-4xl font-bold">Featured / Best Selling Products</h2>
                <p className="text-slate-400 mt-2">CMS-connected product grid. Add new products below and they instantly appear here.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <article key={product.id} className="reveal bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:-translate-y-1.5 transition">
                  <img src={product.image} alt={product.name} className="w-full h-44 object-cover" />
                  <div className="p-5">
                    <div className="inline-block text-xs px-2 py-1 rounded-full bg-rose-400/20 text-rose-200 mb-3">Sale</div>
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{product.description}</p>
                    <p className="mt-4 text-cyan-300 font-extrabold text-xl">AED {product.priceAED.toLocaleString()}</p>
                    <div className="mt-4 text-xs text-slate-300">Range {product.rangeKm}km • Top Speed {product.topSpeedKmh}km/h</div>
                    <button className="mt-4 w-full py-2 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition">Quick View</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="quiz" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
            <div className="rounded-3xl p-8 border border-cyan-300/30 bg-gradient-to-br from-cyan-500/10 to-slate-900/40">
              <h2 className="text-3xl font-bold">Interactive “Find Your Ride”</h2>
              <p className="text-slate-300 mt-3">Need a recommendation? We map your speed, range, and budget to the right product on WhatsApp in under 2 minutes.</p>
              <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">Speed: City / Balanced / Performance</div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">Range: 20–100km</div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">Budget: AED 1,000–8,000+</div>
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="py-20 bg-slate-900/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="reveal text-4xl font-bold mb-10">Social Proof & Reviews</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {reviewCards.map((review) => (
                <blockquote key={review.author} className="reveal p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-slate-200">“{review.quote}”</p>
                  <footer className="mt-4 text-cyan-300 font-semibold">— {review.author}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {showCms && (
          <section className="py-20 border-t border-white/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
              <h2 className="text-3xl font-bold mb-2">CMS Product Upload Console</h2>
              <p className="text-slate-400 mb-8">Local CMS for now (Vercel-ready). You can connect this form to headless CMS/API later without changing UI blocks.</p>
              <form onSubmit={addProduct} className="grid sm:grid-cols-2 gap-4">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" className="input" />
                <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="input" />
                <input required type="number" value={form.priceAED} onChange={(e) => setForm({ ...form, priceAED: e.target.value })} placeholder="Price AED" className="input" />
                <input required type="number" value={form.rangeKm} onChange={(e) => setForm({ ...form, rangeKm: e.target.value })} placeholder="Range (km)" className="input" />
                <input required type="number" value={form.topSpeedKmh} onChange={(e) => setForm({ ...form, topSpeedKmh: e.target.value })} placeholder="Top speed (km/h)" className="input" />
                <input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="input" />
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="input sm:col-span-2 min-h-24" />
                <button className="sm:col-span-2 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300">Publish Product</button>
              </form>
            </div>
          </section>
        )}
      </main>

      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="font-bold text-lg mb-3">ZAPLON.AE</h3>
            <p className="text-slate-400">Premium electric scooters in UAE with fast support and certified servicing.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-slate-400"><li>Electric Scooters</li><li>Accessories</li><li>Repair & Service</li></ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-slate-400"><li>Dubai, UAE</li><li>+971 50 000 0000</li><li>support@zaplon.ae</li></ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Newsletter</h4>
            <div className="flex gap-2"><input placeholder="Email" className="input !py-2" /><button className="px-4 rounded-xl bg-cyan-400 text-slate-950 font-semibold">Join</button></div>
          </div>
        </div>
      </footer>

      <style>{`
        .reveal { opacity: 0; transform: translateY(26px); transition: 700ms ease; }
        .reveal.in-view { opacity: 1; transform: translateY(0); }
        .input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          color: #e2e8f0;
          outline: none;
        }
        .input::placeholder { color: #94a3b8; }
        .input:focus { border-color: rgba(34,211,238,0.7); box-shadow: 0 0 0 3px rgba(34,211,238,0.2); }
      `}</style>
    </div>
  );
};

export default App;
