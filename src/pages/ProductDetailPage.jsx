import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, Truck, RotateCcw, ShieldCheck, ChevronRight, Minus, Plus, ShoppingCart, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice, imgUrl } from '../utils/format';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ProductCard from '../components/product/ProductCard';
const G='#1a3a2a';const GOLD='#f5c518';
export default function ProductDetailPage() {
  const {slug}=useParams();const navigate=useNavigate();
  const [data,setData]=useState(null);const [loading,setLoading]=useState(true);
  const [activeImg,setActiveImg]=useState(0);const [quantity,setQuantity]=useState(1);
  const [selectedVariations,setSelectedVariations]=useState({});const [activeTab,setActiveTab]=useState('description');const [wishlisted,setWishlisted]=useState(false);
  const {addItem}=useCartStore();const {customer}=useAuthStore();
  useEffect(()=>{
    setLoading(true);setActiveImg(0);setQuantity(1);setSelectedVariations({});
    api.get(`/products/${slug}`).then(res=>setData(res.data)).catch(()=>navigate('/shop')).finally(()=>setLoading(false));
  }, [slug]);
  if(loading) return(
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-gray-100 animate-pulse rounded-2xl"></div>
      <div className="space-y-4">{[...Array(6)].map((_,i)=><div key={i} className="h-6 bg-gray-100 animate-pulse rounded"></div>)}</div>
    </div>
  );
  if(!data?.product) return null;
  const {product,variations=[],reviews=[],related=[]}=data;
  const images=(product.images||[]).map(imgUrl); const img=images[activeImg];
  const price=product.sale_price||product.regular_price;
  const hasDiscount=product.sale_price&&product.sale_price<product.regular_price;
  const outOfStock=product.stock_status==='out_of_stock';
  const attrNames=[...new Set(variations.flatMap(v=>Object.keys(v.attributes||{})))];
  const getPrice=()=>{const m=variations.find(v=>Object.entries(selectedVariations).every(([k,val])=>v.attributes[k]===val));return m?(m.sale_price||m.regular_price||price):price;};
  const currentPrice=getPrice();
  const handleAddToCart=()=>{addItem(product,quantity,selectedVariations);toast.success(`${product.name} added to cart!`,{icon:'🛒'});};
  const handleBuyNow=()=>{addItem(product,quantity,selectedVariations);navigate('/checkout');};
  const handleWishlist=async()=>{if(!customer){toast.error('Please login');return;}try{const res=await api.post(`/customers/wishlist/${product.id}`);setWishlisted(res.data.added);toast.success(res.data.message);}catch{toast.error('Failed');}};
  const handleShare=()=>{if(navigator.share)navigator.share({title:product.name,url:window.location.href});else{navigator.clipboard.writeText(window.location.href);toast.success('Link copied!');}};
  return(
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="py-3" style={{background:'#fffbe6'}}>
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-green-800">Home</Link><ChevronRight size={12}/>
            <Link to="/shop" className="hover:text-green-800">Shop</Link>
            {product.category_name&&<><ChevronRight size={12}/><Link to={`/category/${product.category_slug}`} className="hover:text-green-800">{product.category_name}</Link></>}
            <ChevronRight size={12}/><span className="font-medium truncate max-w-[200px]" style={{color:G}}>{product.name}</span>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-3">
            <motion.div key={activeImg} initial={{opacity:0}} animate={{opacity:1}} className="relative aspect-square rounded-2xl overflow-hidden" style={{background:'#fffbe6'}}>
              {img?<img src={img} alt={product.name} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-6xl">👔</div>}
              {hasDiscount&&<span className="absolute top-4 left-4 badge-discount">{product.discount_percent}% OFF</span>}
            </motion.div>
            {images.length>1&&(
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((im,i)=>(
                  <button key={i} onClick={()=>setActiveImg(i)} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all" style={{borderColor:activeImg===i?G:'transparent'}}>
                    <img src={im} alt="" className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Info */}
          <div className="space-y-5">
            <div>
              {product.category_name&&<Link to={`/category/${product.category_slug}`} className="text-xs font-semibold uppercase tracking-wider hover:opacity-70" style={{color:G}}>{product.category_name}</Link>}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 leading-tight" style={{fontFamily:"'Playfair Display',serif"}}>{product.name}</h1>
              {product.sku&&<p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>}
            </div>
            {product.rating_count>0&&(
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">{[1,2,3,4,5].map(s=><Star key={s} size={15} fill={s<=Math.round(product.rating_avg)?GOLD:'none'} style={{color:s<=Math.round(product.rating_avg)?GOLD:'#d1d5db'}}/>)}</div>
                <span className="text-sm text-gray-500">({product.rating_count} reviews)</span>
              </div>
            )}
            {/* Price */}
            <div className="flex items-baseline gap-3 py-3 border-y border-gray-100">
              <span className="text-3xl font-bold" style={{color:G}}>{formatPrice(currentPrice)}</span>
              {hasDiscount&&<><span className="text-lg text-gray-400 line-through">{formatPrice(product.regular_price)}</span><span className="text-sm font-semibold" style={{color:GOLD}}>Save {formatPrice(product.regular_price-currentPrice)}</span></>}
            </div>
            {product.short_description&&<p className="text-gray-600 text-sm leading-relaxed">{product.short_description}</p>}
            {/* Variations */}
            {attrNames.map(attrName=>{
              const vals=[...new Set(variations.map(v=>v.attributes[attrName]).filter(Boolean))];
              return(
                <div key={attrName}>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">{attrName}: <span className="font-bold" style={{color:G}}>{selectedVariations[attrName]||'Select'}</span></label>
                  <div className="flex flex-wrap gap-2">
                    {vals.map(val=>(
                      <button key={val} onClick={()=>setSelectedVariations(prev=>({...prev,[attrName]:val}))} className="px-4 py-2 rounded-lg text-sm border-2 transition-all font-medium" style={{borderColor:selectedVariations[attrName]===val?G:'#e5e7eb',background:selectedVariations[attrName]===val?G:'#fff',color:selectedVariations[attrName]===val?'#fff':'#374151'}}>{val}</button>
                    ))}
                  </div>
                </div>
              );
            })}
            {/* Quantity */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={()=>setQuantity(q=>Math.max(1,q-1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"><Minus size={15}/></button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button onClick={()=>setQuantity(q=>Math.min(product.stock_quantity||99,q+1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"><Plus size={15}/></button>
                </div>
                <span className={`text-sm font-medium ${outOfStock?'text-red-500':'text-green-600'}`}>{outOfStock?'❌ Out of Stock':`✅ In Stock (${product.stock_quantity} left)`}</span>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart} disabled={outOfStock} className="flex-1 flex items-center justify-center gap-2 border-2 font-bold py-3.5 rounded-xl transition-all disabled:opacity-40" style={{borderColor:G,color:G}} onMouseEnter={e=>{e.currentTarget.style.background=G;e.currentTarget.style.color='#fff';}} onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color=G;}}>
                <ShoppingCart size={18}/> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={outOfStock} className="flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all disabled:opacity-40 shadow-md" style={{background:GOLD,color:G}}>
                <Zap size={18}/> Buy Now
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={handleWishlist} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors" style={{borderColor:wishlisted?'#ef4444':'#e5e7eb',color:wishlisted?'#ef4444':'#4b5563',background:wishlisted?'#fef2f2':'#fff'}}>
                <Heart size={16} fill={wishlisted?'#ef4444':'none'}/> {wishlisted?'Wishlisted':'Add to Wishlist'}
              </button>
              <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:border-green-700 transition-colors">
                <Share2 size={16}/> Share
              </button>
            </div>
            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[{icon:Truck,label:product.delivery_info||'Free delivery on orders ৳2000+'},{icon:RotateCcw,label:product.return_policy||'7-day return policy'},{icon:ShieldCheck,label:'Authentic product'}].map((item,i)=>(
                <div key={i} className="flex flex-col items-center text-center p-3 rounded-xl" style={{background:'#fffbe6'}}>
                  <item.icon size={18} className="mb-1.5" style={{color:G}}/>
                  <p className="text-[10px] text-gray-600 leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-0 border-b border-gray-200">
            {['description','specifications','reviews'].map(tab=>(
              <button key={tab} onClick={()=>setActiveTab(tab)} className="px-6 py-3 text-sm font-semibold capitalize transition-all border-b-2" style={{borderColor:activeTab===tab?G:'transparent',color:activeTab===tab?G:'#6b7280'}}>
                {tab} {tab==='reviews'&&reviews.length>0&&`(${reviews.length})`}
              </button>
            ))}
          </div>
          <div className="py-6">
            {activeTab==='description'&&<div className="text-gray-600 text-sm leading-relaxed">{product.description||<p className="text-gray-400">No description.</p>}</div>}
            {activeTab==='specifications'&&<div className="text-gray-600 text-sm leading-relaxed">{product.specifications||<p className="text-gray-400">No specifications.</p>}</div>}
            {activeTab==='reviews'&&(
              <div>
                {reviews.length===0?<p className="text-gray-400 text-sm">No reviews yet.</p>:(
                  <div className="space-y-5">
                    {reviews.map(review=>(
                      <div key={review.id} className="border-b pb-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{review.customer_name}</span>
                              {review.is_verified_purchase===1&&<span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded"><CheckCircle size={10}/>Verified</span>}
                            </div>
                            <div className="flex items-center gap-1 mt-1">{[1,2,3,4,5].map(s=><Star key={s} size={12} fill={s<=review.rating?GOLD:'none'} style={{color:s<=review.rating?GOLD:'#e5e7eb'}}/>)}</div>
                          </div>
                          <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        {review.title&&<h4 className="font-medium text-sm mb-1">{review.title}</h4>}
                        {review.body&&<p className="text-sm text-gray-600">{review.body}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Related */}
        {related.length>0&&(
          <div className="mt-10">
            <h2 className="text-xl md:text-2xl font-bold mb-6" style={{fontFamily:"'Playfair Display',serif",color:G}}>Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.slice(0,4).map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}
            </div>
          </div>
        )}
      </div>
      {/* Mobile sticky */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 p-3 flex gap-3">
        <button onClick={handleAddToCart} disabled={outOfStock} className="flex-1 flex items-center justify-center gap-2 border-2 font-bold py-3 rounded-xl text-sm disabled:opacity-40" style={{borderColor:G,color:G}}><ShoppingCart size={16}/>Add to Cart</button>
        <button onClick={handleBuyNow} disabled={outOfStock} className="flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-sm disabled:opacity-40 shadow-lg" style={{background:GOLD,color:G}}><Zap size={16}/>Buy Now</button>
      </div>
    </div>
  );
}
