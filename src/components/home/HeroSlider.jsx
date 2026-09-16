import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api/axios';

const G    = '#1a3a2a';
const GOLD = '#f5c518';

const FALLBACK_SLIDES = [
  {
    id: 1,
    heading: 'WHERE STYLE\nMEETS ELEGANCE',
    subheading: 'Discover the Premium AYASOFYA Collection',
    button_text: 'SHOP NOW',
    button_url: '/shop',
    subtitle: 'New Arrivals 2024',
    bg: `linear-gradient(135deg, ${G} 0%, #2a5c3f 50%, #0d2218 100%)`,
  },
  {
    id: 2,
    heading: "WOMEN'S\nCOLLECTION",
    subheading: 'Premium Abaya, Hijab & Modest Fashion',
    button_text: 'EXPLORE NOW',
    button_url: '/category/womens-collection',
    subtitle: 'Modest & Beautiful',
    bg: `linear-gradient(135deg, #0d2218 0%, ${G} 60%, #2a5c3f 100%)`,
  },
  {
    id: 3,
    heading: 'EID SPECIAL\nCOLLECTION',
    subheading: 'Celebrate with Premium Fashion — Up to 40% OFF',
    button_text: 'SHOP SALE',
    button_url: '/offers',
    subtitle: 'Up to 40% OFF',
    bg: `linear-gradient(135deg, #2a5c3f 0%, ${G} 50%, #0d2218 100%)`,
  },
];

const INTERVAL_MS = 7000;

export default function HeroSlider() {
  const [slides, setSlides]   = useState(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState(null);
  const [fading, setFading]   = useState(false);
  const timerRef              = useRef(null);

  useEffect(() => {
    api.get('/settings/banners?type=hero').then(res => {
      if (res.data.banners?.length) setSlides(res.data.banners);
    }).catch(() => {});
  }, []);

  const startTimer = (len) => {
    clearInterval(timerRef.current);
    if ((len ?? slides.length) < 2) return;
    timerRef.current = setInterval(() => advance(), INTERVAL_MS);
  };

  const advance = () => {
    setCurrent(c => {
      setPrev(c);
      setFading(true);
      setTimeout(() => setFading(false), 700);
      return (c + 1) % slides.length;
    });
  };

  useEffect(() => {
    startTimer(slides.length);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  const goTo = (idx) => {
    if (idx === current) return;
    setPrev(current);
    setFading(true);
    setTimeout(() => setFading(false), 700);
    setCurrent(idx);
    startTimer();
  };

  const slide = slides[current];

  return (
    <>
      {/* ─── keyframes injected once ─── */}
      <style>{`
        @keyframes ayaZoom {
          0%   { transform: scale(1.00); }
          50%  { transform: scale(1.12); }
          100% { transform: scale(1.00); }
        }
        .aya-zoom-bg {
          animation: ayaZoom 13s ease-in-out infinite;
          transform-origin: center center;
          will-change: transform;
        }
        @keyframes ayaFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .aya-slide-in  { animation: ayaFadeIn 0.7s ease-in-out forwards; }
        .aya-slide-out { animation: ayaFadeIn 0.7s ease-in-out reverse forwards; }
        .aya-content-in {
          animation: ayaContentIn 0.8s ease-out 0.3s both;
        }
        @keyframes ayaContentIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section
        className="relative w-full overflow-hidden"
        style={{ height: 'clamp(360px, 58vw, 700px)' }}
      >
        {/* ── Previous slide (fading out) ── */}
        {fading && prev !== null && (
          <div
            key={`prev-${prev}`}
            className="absolute inset-0 aya-slide-out"
            style={{ zIndex: 1 }}
          >
            <SlideBackground slide={slides[prev]} />
          </div>
        )}

        {/* ── Current slide (fading in) ── */}
        <div
          key={`curr-${current}`}
          className="absolute inset-0 aya-slide-in"
          style={{ zIndex: 2 }}
        >
          <SlideBackground slide={slide} />

          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.42)', zIndex: 1 }}
          />

          {/* Content */}
          <div
            className="absolute inset-0 flex items-center"
            style={{ zIndex: 2 }}
          >
            <div className="max-w-7xl mx-auto w-full px-5 sm:px-10 lg:px-12">
              <div className="max-w-xl aya-content-in">
                {/* Badge */}
                <span
                  className="inline-block text-xs font-bold tracking-[0.22em] uppercase px-3.5 py-1.5 rounded mb-3 sm:mb-4"
                  style={{ background: GOLD, color: G }}
                >
                  {slide.subtitle || 'Premium Collection 2024'}
                </span>

                {/* Heading */}
                <h1
                  className="text-white mb-3 sm:mb-4 leading-tight"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(1.65rem, 5.5vw, 3.8rem)',
                    fontWeight: 700,
                  }}
                >
                  {(slide.heading || '').split('\n').map((line, i) => (
                    <span key={i} className="block">
                      {i === 0 ? line : <span style={{ color: GOLD }}>{line}</span>}
                    </span>
                  ))}
                </h1>

                {/* Subheading */}
                {slide.subheading && (
                  <p
                    className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 font-light"
                    style={{ color: 'rgba(255,255,255,0.82)' }}
                  >
                    {slide.subheading}
                  </p>
                )}

                {/* CTA */}
                {slide.button_text && (
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <Link
                      to={slide.button_url || '/shop'}
                      className="inline-flex items-center gap-2 font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm tracking-wider uppercase transition-opacity hover:opacity-90 shadow-lg"
                      style={{ background: GOLD, color: G, minHeight: 44 }}
                    >
                      {slide.button_text}
                    </Link>
                    <Link
                      to="/shop"
                      className="text-sm underline underline-offset-4"
                      style={{ color: 'rgba(255,255,255,0.62)' }}
                    >
                      View All
                    </Link>
                  </div>
                )}

                {/* Trust badges — hide on tiny screens */}
                <div className="hidden sm:flex items-center gap-5 mt-7 flex-wrap">
                  {['Free Delivery', '7-Day Return', 'Authentic Quality'].map(b => (
                    <div key={b} className="flex items-center gap-1.5">
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                        style={{ background: GOLD, color: G }}
                      >✓</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => goTo((current - 1 + slides.length) % slides.length)}
              aria-label="Previous"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white rounded-full p-2 sm:p-2.5 transition-all hover:scale-110 focus:outline-none"
              style={{ background: 'rgba(0,0,0,0.38)', zIndex: 10, minWidth: 40, minHeight: 40 }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => goTo((current + 1) % slides.length)}
              aria-label="Next"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white rounded-full p-2 sm:p-2.5 transition-all hover:scale-110 focus:outline-none"
              style={{ background: 'rgba(0,0,0,0.38)', zIndex: 10, minWidth: 40, minHeight: 40 }}
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 items-center"
              style={{ zIndex: 10 }}
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="rounded-full transition-all focus:outline-none"
                  style={{
                    width: i === current ? 24 : 8,
                    height: 8,
                    background: i === current ? GOLD : 'rgba(255,255,255,0.5)',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}

/* ── Background layer: ONLY zoom in/out via CSS animation, no movement ── */
function SlideBackground({ slide }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="aya-zoom-bg absolute inset-0">
        {slide.desktop_image ? (
          <img
            src={slide.desktop_image}
            alt={slide.heading || 'AYASOFYA'}
            className="w-full h-full object-cover object-center"
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: slide.bg || `linear-gradient(135deg, ${G}, #0d2218)` }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-8 right-[8%] w-72 h-72 border rounded-full opacity-10" style={{ borderColor: GOLD }} />
              <div className="absolute top-16 right-[12%] w-52 h-52 border rounded-full opacity-10" style={{ borderColor: GOLD }} />
              <div className="absolute -bottom-16 -left-8 w-80 h-80 border rounded-full opacity-5" style={{ borderColor: '#fff' }} />
              <div className="absolute top-0 left-0 w-1.5 h-full opacity-60" style={{ background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
