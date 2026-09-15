import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const G = '#1a3a2a';
const GOLD = '#f5c518';

const REVIEWS = [
  { name: 'Fatima Rahman', location: 'Dhaka', rating: 5, text: 'Absolutely love the quality of the Abaya I purchased. The fabric is premium and the stitching is excellent. Will definitely order again!' },
  { name: 'Mohammad Ali', location: 'Chittagong', rating: 5, text: 'The Katan Jubba is perfect for Eid prayers. Very comfortable and elegant. Fast delivery and great packaging.' },
  { name: 'Ayesha Begum', location: 'Sylhet', rating: 5, text: 'The Arabic Oud perfume is absolutely divine! Long-lasting and exactly as described. AYASOFYA has the best collection.' },
  { name: 'Karim Hassan', location: 'Rajshahi', rating: 4, text: 'Great quality products at reasonable prices. The watch I bought looks premium. Customer service was very helpful.' },
];

export default function ReviewsSection() {
  return (
    <section className="py-14" style={{ background: '#fffbe6' }}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-0.5 w-12" style={{ background: GOLD }}></div>
            <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>Testimonials</span>
            <div className="h-0.5 w-12" style={{ background: GOLD }}></div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Playfair Display',serif", color: G }}>What Our Customers Say</h2>
          <p className="text-gray-500 text-sm mt-1">Trusted by thousands of happy customers</p>
          <div className="flex items-center justify-center gap-1 mt-3">
            {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={GOLD} style={{ color: GOLD }} />)}
            <span className="ml-2 text-sm text-gray-600 font-medium">4.9/5 from 500+ reviews</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEWS.map((review, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
              <Quote size={24} className="absolute top-4 right-4" style={{ color: `${GOLD}60` }} />
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= review.rating ? GOLD : 'none'} style={{ color: s <= review.rating ? GOLD : '#e5e7eb' }} />)}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{review.text}"</p>
              <div className="flex items-center gap-3 border-t pt-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: G }}>
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: G }}>{review.name}</p>
                  <p className="text-xs text-gray-400">{review.location}</p>
                </div>
                <span className="ml-auto text-[10px] bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded">Verified</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
