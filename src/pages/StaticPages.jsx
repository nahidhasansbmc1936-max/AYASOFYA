import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import api from '../api/axios';
import useSettingsStore from '../store/useSettingsStore';
const G='#1a3a2a';const GOLD='#f5c518';
export function StaticPage({slug:propSlug}) {
  const {slug:paramSlug}=useParams();const slug=propSlug||paramSlug;
  const [page,setPage]=useState(null);const [loading,setLoading]=useState(true);
  useEffect(()=>{api.get(`/settings/pages/${slug}`).then(res=>setPage(res.data.page)).catch(()=>setPage(null)).finally(()=>setLoading(false));}, [slug]);
  if(loading) return<div className="max-w-3xl mx-auto px-4 py-12 animate-pulse"><div className="h-8 bg-gray-100 rounded w-64 mb-6"/>{[...Array(8)].map((_,i)=><div key={i} className="h-4 bg-gray-100 rounded mb-3"/>)}</div>;
  return(
    <div className="min-h-screen bg-white">
      <div className="py-10 text-white text-center" style={{background:G}}>
        <h1 className="text-3xl font-bold" style={{fontFamily:"'Playfair Display',serif"}}>{page?.title||slug.replace(/-/g,' ')}</h1>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10">
        {page?<div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{__html:page.content}}/>:<p className="text-gray-400 text-center py-10">Page content coming soon.</p>}
      </div>
    </div>
  );
}
export function ContactPage() {
  const {get:getSetting}=useSettingsStore();
  const [form,setForm]=useState({name:'',email:'',phone:'',message:''});const [sent,setSent]=useState(false);
  return(
    <div className="min-h-screen bg-white">
      <div className="py-10 text-white text-center" style={{background:G}}><h1 className="text-3xl font-bold" style={{fontFamily:"'Playfair Display',serif"}}>Contact Us</h1></div>
      <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{fontFamily:"'Playfair Display',serif",color:G}}>Get in Touch</h2>
          <div className="space-y-4">
            {[{icon:Phone,label:'Phone',val:getSetting('site_phone'),href:`tel:${getSetting('site_phone')}`},{icon:Mail,label:'Email',val:getSetting('site_email'),href:`mailto:${getSetting('site_email')}`}].map(item=>(
              <a key={item.label} href={item.href} className="flex items-center gap-4 p-4 rounded-xl hover:opacity-80 transition-opacity" style={{background:'#fffbe6'}}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:G}}><item.icon size={18} className="text-white"/></div>
                <div><p className="font-semibold text-sm" style={{color:G}}>{item.label}</p><p className="text-gray-600 text-sm">{item.val}</p></div>
              </a>
            ))}
            {getSetting('site_whatsapp')&&<a href={`https://wa.me/${getSetting('site_whatsapp').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500"><MessageCircle size={18} className="text-white"/></div>
              <div><p className="font-semibold text-sm text-green-700">WhatsApp</p><p className="text-gray-600 text-sm">Chat with us</p></div>
            </a>}
          </div>
        </div>
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
          {sent?(
            <div className="text-center py-10"><div className="text-5xl mb-4">✉️</div><h3 className="text-xl font-bold mb-2" style={{color:G}}>Message Sent!</h3><p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p><button onClick={()=>setSent(false)} className="mt-4 text-sm underline" style={{color:G}}>Send another</button></div>
          ):(
            <>
              <h2 className="text-xl font-bold mb-5" style={{fontFamily:"'Playfair Display',serif",color:G}}>Send a Message</h2>
              <form onSubmit={e=>{e.preventDefault();setSent(true);}} className="space-y-4">
                {[{k:'name',l:'Full Name',t:'text',r:true},{k:'email',l:'Email',t:'email'},{k:'phone',l:'Phone',t:'tel'}].map(f=>(
                  <div key={f.k}><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">{f.l}</label><input type={f.t} required={f.r} value={form[f.k]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/></div>
                ))}
                <div><label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Message</label><textarea required rows={4} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor='#e5e7eb'}/></div>
                <button type="submit" className="w-full text-white font-bold py-3.5 rounded-xl" style={{background:G}}>Send Message</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export function AboutPage() {
  const {get:getSetting}=useSettingsStore();
  return(
    <div className="min-h-screen bg-white">
      <div className="py-16 text-white text-center relative overflow-hidden" style={{background:G}}>
        <div className="absolute top-0 left-0 w-1.5 h-full" style={{background:`linear-gradient(to bottom, ${GOLD}, transparent)`}}/>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4"><div className="w-3 h-0.5" style={{background:GOLD}}/><span className="text-xs tracking-[0.3em] uppercase font-bold" style={{color:GOLD}}>Est. 2024</span><div className="w-3 h-0.5" style={{background:GOLD}}/></div>
          <h1 className="text-4xl font-bold" style={{fontFamily:"'Playfair Display',serif"}}>About AYASOFYA</h1>
          <p className="mt-2" style={{color:'rgba(255,255,255,0.65)'}}>Where Style Meets Elegance</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-lg text-gray-600 leading-relaxed mb-8">{getSetting('about_text')}</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {[{icon:'🎯',title:'Our Mission',desc:'To provide premium quality fashion products that combine style, comfort and Islamic values.'},{icon:'👁',title:'Our Vision',desc:'To be the most trusted fashion brand for Muslim families in Bangladesh and beyond.'},{icon:'💎',title:'Our Values',desc:'Quality, authenticity, customer satisfaction and honoring Islamic principles.'}].map(item=>(
            <div key={item.title} className="rounded-2xl p-6 text-center" style={{background:'#fffbe6'}}>
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold mb-2" style={{fontFamily:"'Playfair Display',serif",color:G}}>{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
