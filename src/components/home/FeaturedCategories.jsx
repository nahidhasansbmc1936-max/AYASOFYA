import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const G = '#1a3a2a';
const GOLD = '#f5c518';

const CATEGORIES = [
  { name: 'Cloth', slug: 'cloth', icon: '👔', desc: 'Jubba, Panjabi & More' },
  { name: "Women's", slug: 'womens-collection', icon: '🧕', desc: 'Abaya, Hijab & More' },
  { name: "Men's", slug: 'mens-collection', icon: '🤵', desc: 'Shirts, Kurta & More' },
  { name: 'Perfume', slug: 'perfume', icon: '🌸', desc: 'Arabic & Premium' },
  { name: 'Watch', slug: 'watch', icon: '⌚', desc: 'Elegant Timepieces' },
  { name: 'Shoes', slug: 'shoes', icon: '👟', desc: 'Premium Footwear' },
  { name: 'Sunnah', slug: 'sunnah', icon: '🌙', desc: 'Islamic Lifestyle' },
];

export default function FeaturedCategories() {
  return (
    <section className="py-12" style={{ background: '#fffbe6' }}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-0.5 w-12" style={{ background: GOLD }}></div>
            <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>Browse</span>
            <div className="h-0.5 w-12" style={{ background: GOLD }}></div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Playfair Display',serif", color: G }}>Shop by Category</h2>
          <p className="text-gray-500 text-sm mt-1">Explore our curated collections</p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.slug} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <Link to={`/category/${cat.slug}`}
                className="group flex flex-col items-center p-4 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-3 transition-all group-hover:scale-110"
                  style={{ background: `${G}12` }}>
                  {cat.icon}
                </div>
                <h3 className="text-xs md:text-sm font-semibold leading-tight" style={{ color: G }}>{cat.name}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{cat.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
