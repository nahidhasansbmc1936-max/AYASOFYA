import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../product/ProductCard';
import api from '../../api/axios';

const G = '#1a3a2a';
const GOLD = '#f5c518';

export default function ProductSection({ title, subtitle, queryParams = {}, viewAllUrl = '/shop', bgClass = '' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ limit: 8, ...queryParams }).toString();
    api.get(`/products?${params}`).then(res => setProducts(res.data.products || [])).catch(() => {}).finally(() => setLoading(false));
  }, [JSON.stringify(queryParams)]);

  return (
    <section className={`py-12 md:py-16 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-0.5" style={{ background: GOLD }}></div>
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Collection</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Playfair Display',serif", color: G }}>{title}</h2>
            {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
          </motion.div>
          <Link to={viewAllUrl} className="flex items-center gap-1.5 font-semibold text-sm hover:opacity-70 transition-opacity whitespace-nowrap" style={{ color: G }}>
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-t-xl"></div>
                <div className="p-3 space-y-2"><div className="h-3 bg-gray-200 rounded w-2/3"></div><div className="h-4 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No products found</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
