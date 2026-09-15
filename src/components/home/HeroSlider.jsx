import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api/axios';

const G = '#1a3a2a';
const GOLD = '#f5c518';

const FALLBACK_SLIDES = [
  { id: 1, heading: 'WHERE STYLE\nMEETS ELEGANCE', subheading: 'Discover the Premium AYASOFYA Collection', button_text: 'SHOP NOW', button_url: '/shop', subtitle: 'New Arrivals 2024', bg: `linear-gradient(135deg, ${G} 0%, #2a5c3f 50%, #0d2218 100%)` },
  { id: 2, heading: "WOMEN'S\nCOLLECTION", subheading: 'Premium Abaya, Hijab & Modest Fashion', button_text: 'EXPLORE NOW', button_url: '/category/womens-collection', subtitle: 'Modest & Beautiful', bg: `linear-gradient(135deg, #0d2218 0%, ${G} 60%, #2a5c3f 100%)` },
  { id: 3, heading: 'EID SPECIAL\nCOLLECTION', subheading: 'Celebrate with Premium Fashion — Up to 40% OFF', button_text: 'SHOP SALE', button_url: '/offers', subtitle: 'Up to 40% OFF', bg: `linear-gradient(135deg, #2a5c3f 0%, ${G} 50%, #0d2218 100%)` },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    api.get('/settings/banners?type=hero').then(res => {
      if (res.data.banners?.length) setSlides(res.data.banners);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => { setDirection(1); setCurrent(c => (c + 1) % slides.length); }, 5000);
    return () => clearInterval(t);
  }, [current, slides.length]);

  const goNext = () => { setDirection(1); setCurrent(c => (c + 1) % slides.length); };
  const goPrev = () => { setDirection(-1); setCurrent(c => (c - 1 + slides.length) % slides.length); };
  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(420px, 65vh, 700px)' }}>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div key={current} custom={direction}
          initial={{ x: direction * 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: direction * -60, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0">
          {slide.desktop_image ? (
            <img src={slide.desktop_image} alt={slide.heading} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: slide.bg || `linear-gradient(135deg, ${G}, #0d2218)` }}>
              {/* Decorative circles */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-8 right-[8%] w-72 h-72 border rounded-full opacity-10" style={{ borderColor: GOLD }}></div>
                <div className="absolute top-16 right-[12%] w-52 h-52 border rounded-full opacity-10" style={{ borderColor: GOLD }}></div>
                <div className="absolute -bottom-16 -left-8 w-80 h-80 border rounded-full opacity-8" style={{ borderColor: 'rgba(255,255,255,0.15)' }}></div>
                {/* Gold accent stripe */}
                <div className="absolute top-0 left-0 w-1.5 h-full opacity-70" style={{ background: `linear-gradient(to bottom, ${GOLD}, transparent)` }}></div>
              </div>
            </div>
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.38)' }} />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25, duration: 0.6 }} className="max-w-xl">
                {/* Badge */}
                <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded mb-4" style={{ background: GOLD, color: G }}>
                  {slide.subtitle || 'Premium Collection 2024'}
                </span>

                {/* Heading */}
                <h1 className="text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem, 6vw, 3.8rem)', fontWeight: 700 }}>
                  {(slide.heading || '').split('\n').map((line, i) => (
                    <span key={i} className="block">
                      {i === 0 ? line : <span style={{ color: GOLD }}>{line}</span>}
                    </span>
                  ))}
                </h1>

                {slide.subheading && (
                  <p className="text-base md:text-lg mb-8 font-light" style={{ color: 'rgba(255,255,255,0.82)' }}>{slide.subheading}</p>
                )}

                {slide.button_text && (
                  <div className="flex items-center gap-4 flex-wrap">
                    <Link to={slide.button_url || '/shop'}
                      className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl text-sm tracking-wider uppercase transition-all hover:scale-105 shadow-lg"
                      style={{ background: GOLD, color: G }}>
                      {slide.button_text}
                    </Link>
                    <Link to="/shop" className="text-sm underline underline-offset-4 transition-colors hover:opacity-100" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      View All
                    </Link>
                  </div>
                )}

                {/* Trust indicators */}
                <div className="flex items-center gap-5 mt-8 flex-wrap">
                  {['Free Delivery', '7-Day Return', 'Authentic Quality'].map(badge => (
                    <div key={badge} className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: GOLD, color: G }}>✓</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{badge}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white rounded-full p-2.5 transition-all hover:scale-110" style={{ background: 'rgba(0,0,0,0.35)' }}
            onMouseEnter={e => e.currentTarget.style.background = GOLD}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white rounded-full p-2.5 transition-all hover:scale-110" style={{ background: 'rgba(0,0,0,0.35)' }}
            onMouseEnter={e => e.currentTarget.style.background = GOLD}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}>
            <ChevronRight size={20} />
          </button>
          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2 items-center">
            {slides.map((_, i) => (
              <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className="transition-all rounded-full"
                style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? GOLD : 'rgba(255,255,255,0.5)' }} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
