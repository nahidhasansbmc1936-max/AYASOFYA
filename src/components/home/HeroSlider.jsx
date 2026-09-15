import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api/axios';

const G = '#1a3a2a';
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

// ─── Animation variants ───────────────────────────────────────────────────────
// Slide stays 7 s visible. Zoom starts at 1.0 and slowly drifts to 1.10 —
// a very gentle Ken Burns "push" feel. On exit the fade removes it while the
// incoming slide fades in from 1.0, so there's no abrupt jump.
const BG_SCALE_START = 1.0;
const BG_SCALE_END   = 1.10;
const ZOOM_DURATION  = 9;   // seconds — slow, premium
const FADE_IN_DUR    = 1.1; // crossfade in
const FADE_OUT_DUR   = 1.0; // crossfade out
const INTERVAL_MS    = 7000; // 7 s per slide

const bgVariants = {
  enter: {
    opacity: 0,
    scale: BG_SCALE_START,
  },
  active: {
    opacity: 1,
    scale: BG_SCALE_END,
    transition: {
      opacity: { duration: FADE_IN_DUR, ease: [0.4, 0, 0.2, 1] },
      scale:   { duration: ZOOM_DURATION, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  exit: {
    opacity: 0,
    scale: BG_SCALE_END, // keep current scale on exit — no snap
    transition: {
      opacity: { duration: FADE_OUT_DUR, ease: [0.4, 0, 1, 1] },
      scale:   { duration: FADE_OUT_DUR, ease: 'linear' },
    },
  },
};

// Content: gentle fade + upward drift, no horizontal movement
const contentVariants = {
  enter: { opacity: 0, y: 28 },
  active: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.45, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.45, ease: [0.4, 0, 1, 1] },
  },
};

export default function HeroSlider() {
  const [slides, setSlides]   = useState(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const timerRef              = useRef(null);

  useEffect(() => {
    api.get('/settings/banners?type=hero').then((res) => {
      if (res.data.banners?.length) setSlides(res.data.banners);
    }).catch(() => {});
  }, []);

  const startTimer = (len = slides.length) => {
    clearInterval(timerRef.current);
    if (len < 2) return;
    timerRef.current = setInterval(
      () => setCurrent((c) => (c + 1) % len),
      INTERVAL_MS
    );
  };

  useEffect(() => {
    startTimer(slides.length);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  const goTo = (idx) => {
    setCurrent(idx);
    startTimer();
  };

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      // Desktop: tall hero. Mobile: shorter so content is always visible.
      style={{ height: 'clamp(360px, 58vw, 700px)' }}
    >
      {/* ── Background layer: zoom + crossfade, zero horizontal movement ── */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={`bg-${current}`}
          variants={bgVariants}
          initial="enter"
          animate="active"
          exit="exit"
          className="absolute inset-0"
          style={{ transformOrigin: 'center center', willChange: 'transform, opacity' }}
        >
          {slide.desktop_image ? (
            <img
              src={slide.desktop_image}
              alt={slide.heading || 'AYASOFYA'}
              // object-cover keeps aspect ratio; position ensures focal point stays centred
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: slide.bg || `linear-gradient(135deg, ${G}, #0d2218)` }}
            >
              {/* Decorative rings — pointer-events-none so they don't block touch */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute top-8 right-[8%] w-72 h-72 border rounded-full opacity-10"
                  style={{ borderColor: GOLD }}
                />
                <div
                  className="absolute top-16 right-[12%] w-52 h-52 border rounded-full opacity-10"
                  style={{ borderColor: GOLD }}
                />
                <div
                  className="absolute -bottom-16 -left-8 w-80 h-80 border rounded-full opacity-5"
                  style={{ borderColor: '#fff' }}
                />
                <div
                  className="absolute top-0 left-0 w-1.5 h-full opacity-60"
                  style={{ background: `linear-gradient(to bottom, ${GOLD}, transparent)` }}
                />
              </div>
            </div>
          )}

          {/* Dark overlay — slightly heavier on mobile so text stays readable */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.40)' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Content layer: fade + rise, zero horizontal movement ── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`content-${current}`}
          variants={contentVariants}
          initial="enter"
          animate="active"
          exit="exit"
          className="absolute inset-0 flex items-center"
        >
          <div className="max-w-7xl mx-auto w-full px-5 sm:px-10 lg:px-12">
            <div className="max-w-xl">
              {/* Badge */}
              <span
                className="inline-block text-xs font-bold tracking-[0.22em] uppercase px-3.5 py-1.5 rounded mb-3 sm:mb-4"
                style={{ background: GOLD, color: G }}
              >
                {slide.subtitle || 'Premium Collection 2024'}
              </span>

              {/* Heading — fluid font size so it fits on small screens */}
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

              {/* CTA buttons */}
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
                    className="text-sm underline underline-offset-4 transition-opacity hover:opacity-100"
                    style={{ color: 'rgba(255,255,255,0.62)' }}
                  >
                    View All
                  </Link>
                </div>
              )}

              {/* Trust badges — hidden on very small screens to avoid clutter */}
              <div className="hidden sm:flex items-center gap-5 mt-7 flex-wrap">
                {['Free Delivery', '7-Day Return', 'Authentic Quality'].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                      style={{ background: GOLD, color: G }}
                    >
                      ✓
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation controls ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 text-white rounded-full p-2 sm:p-2.5 transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ background: 'rgba(0,0,0,0.38)', minWidth: 40, minHeight: 40 }}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => goTo((current + 1) % slides.length)}
            aria-label="Next slide"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 text-white rounded-full p-2 sm:p-2.5 transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ background: 'rgba(0,0,0,0.38)', minWidth: 40, minHeight: 40 }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Dot indicators — larger tap targets on mobile */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 items-center">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="rounded-full transition-all focus:outline-none"
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  minWidth: 8,
                  minHeight: 8,
                  background: i === current ? GOLD : 'rgba(255,255,255,0.5)',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
