import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import api from '../api/axios';
import { formatDate, imgUrl } from '../utils/format';
const G='#1a3a2a';const GOLD='#f5c518';
export function BlogListPage() {
  const [posts,setPosts]=useState([]);const [loading,setLoading]=useState(true);
  useEffect(()=>{api.get('/blog?limit=12').then(res=>setPosts(res.data.posts||[])).finally(()=>setLoading(false));}, []);
  return(
    <div className="min-h-screen bg-white">
      <div className="py-10 text-white text-center" style={{background:G}}><h1 className="text-3xl font-bold" style={{fontFamily:"'Playfair Display',serif"}}>Blog</h1><p className="mt-1 text-sm" style={{color:'rgba(255,255,255,0.7)'}}>Fashion tips, style guides & more</p></div>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading?<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">{[...Array(6)].map((_,i)=><div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse"/>)}</div>
        :posts.length===0?<div className="text-center py-16 text-gray-400">No blog posts yet.</div>
        :<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map(post=>(
            <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden" style={{background:'#fffbe6'}}>
                {post.featured_image?<img src={imgUrl(post.featured_image)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>:<div className="w-full h-full flex items-center justify-center text-4xl">📝</div>}
              </div>
              <div className="p-4">
                {post.category_name&&<span className="text-xs font-semibold uppercase" style={{color:GOLD}}>{post.category_name}</span>}
                <h2 className="font-bold text-gray-800 mt-1 mb-2 line-clamp-2">{post.title}</h2>
                {post.excerpt&&<p className="text-gray-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar size={11}/>{formatDate(post.published_at)}</span>
                  {post.author_name&&<span className="flex items-center gap-1"><User size={11}/>{post.author_name}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>}
      </div>
    </div>
  );
}
export function BlogPostPage() {
  const {slug}=useParams();const [data,setData]=useState(null);const [loading,setLoading]=useState(true);
  useEffect(()=>{api.get(`/blog/${slug}`).then(res=>setData(res.data)).finally(()=>setLoading(false));}, [slug]);
  if(loading) return<div className="max-w-3xl mx-auto px-4 py-10 animate-pulse"><div className="h-8 bg-gray-100 rounded mb-4"/><div className="h-64 bg-gray-100 rounded-xl mb-6"/>{[...Array(5)].map((_,i)=><div key={i} className="h-4 bg-gray-100 rounded mb-2"/>)}</div>;
  if(!data?.post) return<div className="text-center py-20 text-gray-400">Post not found</div>;
  const {post}=data;
  return(
    <div className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-4 py-10">
        {post.category_name&&<span className="text-xs font-semibold uppercase" style={{color:GOLD}}>{post.category_name}</span>}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-4" style={{fontFamily:"'Playfair Display',serif"}}>{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
          {post.author_name&&<span className="flex items-center gap-1"><User size={13}/>{post.author_name}</span>}
          <span className="flex items-center gap-1"><Calendar size={13}/>{formatDate(post.published_at)}</span>
        </div>
        {post.featured_image&&<img src={imgUrl(post.featured_image)} alt={post.title} className="w-full rounded-2xl mb-8 object-cover max-h-72"/>}
        <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{__html:post.content||post.excerpt||''}}/>
      </article>
    </div>
  );
}
