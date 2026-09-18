import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const G    = '#1a3a2a';
const GOLD = '#f5c518';

export default function NewsletterSection() {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/customers/newsletter', { email });
      setSubmitted(true);
      setEmail('');
      toast.success('Subscribed successfully!');
    } catch {
      toast.error('Subscription failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-14" style={{ background: G }}>
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Elegant bracket / border frame — uses brand colors, symmetrical */}
          <div
            className="relative mx-auto px-6 sm:px-10 py-8 sm:py-10"
            style={{
              maxWidth: 560,
              // Corner-bracket effect via box-shadow + border
              border: `1px solid ${GOLD}40`,
              borderRadius: 4,
              boxShadow: `
                inset  8px  8px 0 -6px ${GOLD},
                inset -8px  8px 0 -6px ${GOLD},
                inset  8px -8px 0 -6px ${GOLD},
                inset -8px -8px 0 -6px ${GOLD}
              `,
            }}
          >
            {/* Top decorative line */}
            <div className="flex items-center gap-3 justify-center mb-6">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${GOLD}60)` }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
              <div className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: GOLD }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${GOLD}60)` }} />
            </div>

            <Mail size={32} className="mx-auto mb-3" style={{ color: GOLD }} />
            <h2
              className="text-2xl md:text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Stay Updated
            </h2>
            <p className="mb-6 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Subscribe for exclusive offers, new arrivals and style tips. No spam, ever.
            </p>

            {submitted ? (
              <div className="flex items-center justify-center gap-2 font-semibold" style={{ color: GOLD }}>
                <CheckCircle size={20} /> Thank you! You&apos;re subscribed.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 rounded-l-xl focus:outline-none text-gray-800 text-sm"
                  style={{ fontSize: 16 }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="font-bold px-6 py-3 rounded-r-xl transition-opacity disabled:opacity-70 text-sm"
                  style={{ background: GOLD, color: G }}
                >
                  {loading ? '…' : 'Subscribe'}
                </button>
              </form>
            )}

            {/* Bottom decorative line */}
            <div className="flex items-center gap-3 justify-center mt-6">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${GOLD}60)` }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
              <div className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: GOLD }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${GOLD}60)` }} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
