'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import { Heart, MessageSquare, Share2, Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const CommunityPage = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error('Error fetching community reviews:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <header className="mb-16 text-center">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-4 block animate-in fade-in slide-in-from-bottom-2 duration-700">ArtLink Community</span>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-6">컬렉터들의 아트 라이프</h1>
          <p className="text-gray-500 italic max-w-xl mx-auto">일상에 스며든 예술, AR로 경험하고 나만의 스타일로 완성한 실제 후기를 만나보세요.</p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
             <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Community Feed...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
             {reviews.map((rev) => (
               <div key={rev.id} className="break-inside-avoid bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden flex flex-col">
                  {rev.imageUrl ? (
                    <div className="relative aspect-auto overflow-hidden">
                       <img src={rev.imageUrl} alt="Review" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-xl text-[10px] font-black text-gray-900 flex items-center gap-1 shadow-sm">
                          <ImageIcon className="h-3 w-3" />
                          AR SNAPSHOT
                       </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-gray-50 flex items-center justify-center italic text-gray-300 text-xs">
                       이미지 없이 작성된 후기입니다.
                    </div>
                  )}

                  <div className="p-8 flex-1 flex flex-col">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-[10px]">
                           {rev.user.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold text-gray-900 truncate">{rev.user.name}</p>
                           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-0.5 text-amber-400">
                           {[...Array(rev.rating)].map((_, i) => <Heart key={i} className="h-2.5 w-2.5 fill-current" />)}
                        </div>
                     </div>

                     <p className="text-sm text-gray-600 leading-relaxed font-medium mb-8">
                        "{rev.comment}"
                     </p>

                     <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                        <Link 
                           href={`/artwork/${rev.artworkId}`}
                           className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors group/link"
                        >
                           <span className="truncate max-w-[120px]">{rev.artwork.title}</span>
                           <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                        <div className="flex items-center gap-3 text-gray-300">
                           <Heart className="h-4 w-4 hover:text-red-400 cursor-pointer transition-colors" />
                           <MessageSquare className="h-4 w-4 hover:text-primary cursor-pointer transition-colors" />
                        </div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white rounded-[4rem] border border-gray-50 shadow-sm">
             <MessageSquare className="h-16 w-16 text-gray-100 mx-auto mb-6" />
             <p className="text-gray-400 font-bold italic">커뮤니티의 첫 번째 주인공이 되어보세요!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CommunityPage;
