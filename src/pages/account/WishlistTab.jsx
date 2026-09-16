import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import api from '../../api/axios';
import { formatPrice, imgUrl } from '../../utils/format';
import useCartStore from '../../store/useCartStore';
import toast from 'react-hot-toast';
const G='#1a3a2a';const GOLD='#f5c518';
export default function WishlistTab() {
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);
  const {addItem}=useCartStore();
  useEffect(()=>{api.get('/customers/wishlist').then(res=>setItems(res.data.wishlist||[])).finally(()=>setLoading(false));}, []);
  const remove=async(pid)=>{await api.delete(`/customers/wishlist/${pid}`);setItems(prev=>prev.filter(i=>i.product_id!==pid));toast.success('Removed');};
  const addToCart=(item)=>{addItem({id:item.product_id,name:item.name,slug:item.slug,images:JSON.parse(item.images||'[]'),regular_price:item.regular_price,sale_price:item.sale_price});toast.success('Added to cart!');};
  if(loading) return <div className="bg-white rounded-2xl p-6 animate-pulse"><div className="h-8 bg-gray-100 rounded w-48 mb-6"/><div className="grid grid-cols-2 gap-4">{[...Array(4)].map((_,i)=><div key={i} className="h-48 bg-gray-100 rounded-xl"/>)}</div></div>;
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{fontFamily:"'Playfair Display',serif",color:G}}><Heart size={20} className="text-red-500"/>Wishlist ({items.length})</h2>
      {items.length===0?(
        <div className="text-center py-12"><Heart size={48} className="mx-auto mb-3" style={{color:'#d1d5db'}}/><p className="text-gray-400">Your wishlist is empty</p><Link to="/shop" className="mt-3 inline-block text-white px-6 py-2.5 rounded-xl text-sm font-medium" style={{background:G}}>Explore Products</Link></div>
      ):(
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map(item=>{
            const imgs=JSON.parse(item.images||'[]').map(imgUrl);
            return(
              <div key={item.id} className="group border-2 border-gray-100 rounded-xl overflow-hidden hover:border-opacity-50 transition-all">
                <Link to={`/product/${item.slug}`} className="block relative aspect-[3/4]" style={{background:'#fffbe6'}}>
                  {imgs[0]?<img src={imgs[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>:<div className="w-full h-full flex items-center justify-center text-3xl">👔</div>}
                </Link>
                <div className="p-3">
                  <Link to={`/product/${item.slug}`} className="text-sm font-medium text-gray-800 line-clamp-2 hover:opacity-70 block mb-1">{item.name}</Link>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm" style={{color:G}}>{formatPrice(item.sale_price||item.regular_price)}</span>
                    <div className="flex gap-1">
                      <button onClick={()=>addToCart(item)} className="p-1.5 text-white rounded-lg" style={{background:G}}><ShoppingCart size={13}/></button>
                      <button onClick={()=>remove(item.product_id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg"><Trash2 size={13}/></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
