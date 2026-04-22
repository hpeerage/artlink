'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Share2, Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react';

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

      <main className="container mx-auto px-6 py-12">
        {/* Best Collector Spotlight */}
        <section className="mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="bg-gray-900 rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl relative">
             <div className="lg:w-2/3 relative h-[400px] lg:h-[600px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41fa68c8?q=80&w=2000&auto=format&fit=crop" 
                  alt="Best Collector Space" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent"></div>
                <div className="absolute top-10 left-10 flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/10">
                   <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Collector Spotlight</span>
                </div>
             </div>
             <div className="lg:w-1/3 p-12 lg:p-16 flex flex-col justify-center text-white">
                <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Honor of the Month</h2>
                <h1 className="text-4xl font-black mb-6 tracking-tight leading-tight">심플함 속의 <br/>묵직한 울림, <br/>거실의 갤러리화.</h1>
                <p className="text-gray-400 text-sm font-medium mb-10 leading-relaxed italic">
                   "오후의 자연광이 비칠 때 그림의 텍스처가 살아나는 순간이 가장 경이롭습니다. ArtLink 덕분에 이 공간의 온도가 바뀌었어요."
                </p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-10">
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-primary">K</div>
                   <div>
                      <p className="text-sm font-black text-white">Collector. Kim</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Verified Art Enthusiast</p>
                   </div>
                </div>
             </div>
             {/* Decor UI */}
             <div className="absolute bottom-10 right-10 opacity-10">
                <div className="text-9xl font-black tracking-tighter select-none">ART</div>
             </div>
          </div>
        </section>

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
