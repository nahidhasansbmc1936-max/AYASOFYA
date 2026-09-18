/**
 * AYASOFYA Hero Banner
 * - Pure CSS scale zoom-in / zoom-out animation (no slide, no fade, no movement)
 * - No text/heading overlay on the image
 * - Two centred CTA buttons from banner data (btn1 and btn2)
 * - btn1: button_text / button_url
 * - btn2: heading (text) / subheading (url) — repurposed from unused fields
 * - btn2 shown only when heading is set
 * - Buttons editable from Admin Panel → Banners
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { imgUrl } from '../../utils/format';

const G    = '#1a3a2a';
const GOLD = '#f5c518';

/* ─── Fallback slides shown when no banners are saved in the DB ─── */
const FALLBACK_SLIDES = [
  {
    id: 'f1',
    desktop_image: '',
    mobile_image: '',
    bg: `linear-gradient(135deg, ${G} 0%, #2a5c3f 50%, #0d2218 100%)`,
    button_text: 'OFFER SALE',
    button_url:  '/offers',
    heading:     'EID COLLECTION',   // btn2 text
    subheading:  '/category/cloth',  // btn2 url
  },
];

export default function HeroSlider() {
  const [slides,   setSlides]   = useState(FALLBACK_SLIDES);
  const [current,  setCurrent]  = useState(0);

  /* Load banners from backend */
  useEffect(() => {
    api.get('/settings/banners?type=hero').then(res => {
      if (res.data.banners?.length) setSlides(res.data.banners);
    }).catch(() => {});
  }, []);

  /* Auto-advance when multiple slides */
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide  = slides[current];
  const btn1   = slide.button_text?.trim();
  const btn1Url = slide.button_url  || '/';
  const btn2   = slide.heading?.trim();      // repurposed field
  const btn2Url = slide.subheading?.trim() || '/'; // repurposed field
  const bgSrc  = slide.desktop_image ? imgUrl(slide.desktop_image) : null;
  const bgColor = slide.bg || `linear-gradient(135deg, ${G}, #0d2218)`;

  return (
    <>
      {/* ── Keyframes — injected once, no external dependency ── */}
      <style>{`
        @keyframes ayaZoom {
          0%   { transform: scale(1.00); }
          50%  { transform: scale(1.10); }
          100% { transform: scale(1.00); }
        }
        .aya-hero-zoom {
          animation: ayaZoom 12s ease-in-out infinite;
          transform-origin: center center;
          will-change: transform;
        }
      `}</style>

      <section
        className="relative w-full overflow-hidden"
        style={{ height: 'clamp(360px, 58vw, 700px)' }}
      >
        {/* ── Background: ONLY scale zoom, absolutely no position movement ── */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="aya-hero-zoom absolute inset-0">
            {bgSrc ? (
              <img
                src={bgSrc}
                alt="Hero Banner"
                className="w-full h-full object-cover object-center"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full" style={{ background: bgColor }}>
                {/* Decorative rings */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-8 right-[8%] w-72 h-72 border rounded-full opacity-10"
                    style={{ borderColor: GOLD }} />
                  <div className="absolute top-16 right-[12%] w-52 h-52 border rounded-full opacity-10"
                    style={{ borderColor: GOLD }} />
                  <div className="absolute -bottom-16 -left-8 w-80 h-80 border rounded-full opacity-5"
                    style={{ borderColor: '#fff' }} />
                  <div className="absolute top-0 left-0 w-1.5 h-full opacity-60"
                    style={{ background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Dark overlay ── */}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.38)' }} />

        {/* ── TWO CENTRED BUTTONS — no heading, no description ── */}
        {(btn1 || btn2) && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* gap-4 on all screens — same as before on desktop, wraps nicely on mobile */}
            <div className="flex flex-col items-center gap-4 px-4 w-full" style={{ maxWidth: 340 }}>
              {/* Button 1 */}
              {btn1 && (
                <Link
                  to={btn1Url}
                  className="font-bold tracking-widest uppercase text-center transition-all hover:scale-105 active:scale-95 shadow-lg w-full"
                  style={{
                    background: GOLD,
                    color: G,
                    padding: 'clamp(10px,2.5vw,14px) clamp(20px,5vw,36px)',
                    borderRadius: 12,
                    fontSize: 'clamp(12px, 3vw, 16px)',
                    letterSpacing: '0.18em',
                    display: 'block',
                  }}
                >
                  {btn1}
                </Link>
              )}

              {/* Button 2 */}
              {btn2 && (
                <Link
                  to={btn2Url}
                  className="font-bold tracking-widest uppercase text-center transition-all hover:scale-105 active:scale-95 shadow-lg w-full"
                  style={{
                    background: 'transparent',
                    color: '#fff',
                    border: `2.5px solid ${GOLD}`,
                    padding: 'clamp(8px,2.5vw,12px) clamp(18px,5vw,34px)',
                    borderRadius: 12,
                    fontSize: 'clamp(12px, 3vw, 16px)',
                    letterSpacing: '0.18em',
                    display: 'block',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {btn2}
                </Link>
              )}
            </div>
          </div>
        )}

      </section>
    </>
  );
}
