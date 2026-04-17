'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  priceRental: number;
  imageUrl: string;
  category: string;
}

const RecommendationsSection = () => {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/artworks/recommendations');
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, [session]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 opacity-30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-[10px] font-black uppercase tracking-widest">Finding art you'll love...</span>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="flex items-center gap-2 mb-4">
               <Sparkles className="h-4 w-4 text-primary fill-primary/10" />
               <span className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Curated for You</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">취향 저격, 추천 컬렉션</h2>
          </div>
          <Link href="/explore" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
             전체 보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {recommendations.map((art, i) => (
             <Link 
               key={art.id} 
               href={`/artwork/${art.id}`}
               className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
               style={{ animationDelay: `${i * 100}ms` }}
             >
                <div className="relative aspect-[3/4] mb-6 rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-50 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                   <img 
                     src={art.imageUrl} 
                     alt={art.title} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Art Details View →</p>
                      <h3 className="text-lg font-black leading-tight mb-2">{art.title}</h3>
                      <p className="text-xs font-medium opacity-60 italic">{art.artist}</p>
                   </div>
                   <div className="absolute top-6 left-6 flex gap-2">
                      <span className="bg-white/90 backdrop-blur-md text-[9px] font-black px-3 py-1.5 rounded-full text-gray-900 uppercase tracking-tighter shadow-sm">
                        {art.category}
                      </span>
                   </div>
                </div>
                <div className="px-2">
                   <h3 className="text-sm font-black text-gray-900 mb-1 truncate">{art.title}</h3>
                   <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-gray-400 italic">By {art.artist}</p>
                      <p className="text-xs font-black text-primary">₩{art.priceRental.toLocaleString()}/mo</p>
                   </div>
                </div>
             </Link>
           ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;
