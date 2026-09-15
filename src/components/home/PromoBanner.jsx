import { motion } from 'framer-motion';
import { Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react';

const G = '#1a3a2a';
const GOLD = '#f5c518';

const FEATURES = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ৳2000', color: G },
  { icon: RotateCcw, title: '7-Day Returns', desc: 'Hassle-free returns', color: GOLD },
  { icon: ShieldCheck, title: 'Authentic Quality', desc: 'Premium products only', color: G },
  { icon: Clock, title: 'Fast Processing', desc: 'Same day dispatch', color: GOLD },
];

export default function PromoBanner() {
  return (
    <section className="py-8 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((feat, i) => (
            <motion.div key={feat.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-4 rounded-xl" style={{ background: '#fffbe6' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${feat.color}15` }}>
                <feat.icon size={20} style={{ color: feat.color }} />
              </div>
              <div>
                <h4 className="font-semibold text-sm" style={{ color: G }}>{feat.title}</h4>
                <p className="text-xs text-gray-500">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
