import HeroSlider from '../components/home/HeroSlider';
import FeaturedCategories from '../components/home/FeaturedCategories';
import ProductSection from '../components/home/ProductSection';
import PromoBanner from '../components/home/PromoBanner';
import ReviewsSection from '../components/home/ReviewsSection';
import NewsletterSection from '../components/home/NewsletterSection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const G = '#1a3a2a';
const GOLD = '#f5c518';

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <PromoBanner />
      <FeaturedCategories />

      <ProductSection title="New Arrivals" subtitle="Fresh styles just landed" queryParams={{ new_arrival: '1' }} viewAllUrl="/shop?new_arrival=1" />

      <ProductSection title="Best Sellers" subtitle="Most loved by our customers" queryParams={{ bestseller: '1' }} viewAllUrl="/shop?bestseller=1" bgClass="bg-[#fffbe6]" />

      {/* Offer banner */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="rounded-2xl overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${G} 0%, #0d2218 60%, #2a5c3f 100%)`, minHeight: 200 }}>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-4 right-10 w-48 h-48 border rounded-full" style={{ borderColor: `${GOLD}25` }}></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 border rounded-full" style={{ borderColor: 'rgba(255,255,255,0.08)' }}></div>
              <div className="absolute top-0 left-0 w-1.5 h-full opacity-80" style={{ background: `linear-gradient(to bottom, ${GOLD}, transparent)` }}></div>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 md:px-12 py-10">
              <div>
                <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 rounded mb-3" style={{ background: GOLD, color: G }}>Limited Time Offer</span>
                <h2 className="text-white text-2xl md:text-4xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display',serif" }}>
                  Up to <span style={{ color: GOLD }}>40% OFF</span><br />on Selected Items
                </h2>
                <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>Don't miss our biggest sale of the season</p>
              </div>
              <Link to="/offers" className="flex-shrink-0 font-bold px-8 py-4 rounded-xl text-sm tracking-wider uppercase transition-all hover:scale-105 shadow-lg" style={{ background: GOLD, color: G }}>
                SHOP NOW
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <ProductSection title="Special Offers" subtitle="Exclusive deals just for you" queryParams={{ offer: '1' }} viewAllUrl="/offers" />
      <ProductSection title="Women's Collection" subtitle="Modest fashion, maximum elegance" queryParams={{ category: 'womens-collection' }} viewAllUrl="/category/womens-collection" bgClass="bg-[#fffbe6]" />
      <ProductSection title="Men's Collection" subtitle="Style for every occasion" queryParams={{ category: 'mens-collection' }} viewAllUrl="/category/mens-collection" />
      <ProductSection title="Perfume Collection" subtitle="Arabic & Premium fragrances" queryParams={{ category: 'perfume' }} viewAllUrl="/category/perfume" bgClass="bg-[#fffbe6]" />
      <ProductSection title="Watch Collection" subtitle="Timeless elegance on your wrist" queryParams={{ category: 'watch' }} viewAllUrl="/category/watch" />
      <ProductSection title="Sunnah Collection" subtitle="Authentic Islamic lifestyle products" queryParams={{ category: 'sunnah' }} viewAllUrl="/category/sunnah" bgClass="bg-[#fffbe6]" />

      <ReviewsSection />
      <NewsletterSection />
    </div>
  );
}
