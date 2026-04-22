'use client';

import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  Globe, 
  Users, 
  Heart, 
  ArrowUpRight, 
  Loader2, 
  Box, 
  ExternalLink 
} from 'lucide-react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';

interface ArtistProfile {
  artist: {
    id: string;
    name: string;
    image: string;
    bio: string;
    website: string;
    instagramUrl: string;
    otherSnsUrl: string;
  };
  artworks: any[];
  followerCount: number;
  isFollowing: boolean;
}

const ArtistPortfolioPage = ({ params }: { params: { id: string } }) => {
  const { data: session } = useSession();
  const [data, setData] = useState<ArtistProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const fetchArtistData = async () => {
    try {
      const res = await fetch(`/api/artist/${params.id}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error('Error fetching artist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistData();
  }, [params.id, session]);

  const handleFollow = async () => {
    if (!session) {
      if (confirm('작가를 팔로우하려면 로그인이 필요합니다.')) signIn();
      return;
    }

    setIsFollowLoading(true);
    try {
      const res = await fetch('/api/my/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: params.id }),
      });
      if (res.ok) {
        await fetchArtistData();
      }
    } catch (err) {
      console.error('Follow failed:', err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center opacity-30">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!data) return <div>Artist not found.</div>;

  const { artist, artworks, followerCount, isFollowing } = data;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero Profile Section */}
      <section className="bg-white border-b border-gray-100 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
            {/* Profile Image */}
            <div className="relative group">
               <div className="w-48 h-48 rounded-[3rem] overflow-hidden bg-gray-100 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                  <img 
                    src={artist.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'} 
                    alt={artist.name} 
                    className="w-full h-full object-cover"
                  />
               </div>
               <div className="absolute -bottom-4 -right-4 bg-primary text-white p-4 rounded-3xl shadow-xl shadow-primary/20">
                  <Users className="h-6 w-6" />
               </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tighter">{artist.name}</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic shadow-sm bg-gray-50/50 inline-block px-3 py-1 rounded">Certified Artist</p>
                  </div>
                  <div className="flex gap-4 justify-center md:justify-start">
                     <button 
                       onClick={handleFollow}
                       disabled={isFollowLoading}
                       className={`px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center gap-2 shadow-xl ${
                         isFollowing 
                         ? 'bg-white border-2 border-gray-100 text-gray-400' 
                         : 'bg-gray-900 text-white hover:bg-primary shadow-gray-200'
                       }`}
                     >
                        {isFollowLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
                        {isFollowing ? 'Following' : 'Follow Artist'}
                     </button>
                  </div>
               </div>

               <p className="text-lg text-gray-500 leading-relaxed font-medium max-w-3xl whitespace-pre-wrap">
                  {artist.bio || '등록된 작가 소개가 없습니다.'}
               </p>

               <div className="flex flex-wrap gap-8 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                     <div className="text-2xl font-black text-gray-900">{artworks.length}</div>
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Artworks<br/>Total</div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="text-2xl font-black text-gray-900">{followerCount}</div>
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Fans<br/>Followers</div>
                  </div>
                  <div className="h-10 w-px bg-gray-100 hidden sm:block"></div>
                  
                  {/* SNS Links */}
                  <div className="flex gap-4">
                     {artist.instagramUrl && (
                       <a href={artist.instagramUrl} target="_blank" rel="noreferrer" className="w-12 h-12 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all shadow-sm">
                          <Instagram className="h-5 w-5" />
                       </a>
                     )}
                     {artist.website && (
                       <a href={artist.website} target="_blank" rel="noreferrer" className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                          <Globe className="h-5 w-5" />
                       </a>
                     )}
                     {artist.otherSnsUrl && (
                       <a href={artist.otherSnsUrl} target="_blank" rel="noreferrer" className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all shadow-sm">
                          <ExternalLink className="h-5 w-5" />
                       </a>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <main className="container mx-auto px-6 py-24 max-w-6xl">
        <div className="mb-16 flex justify-between items-end">
           <div>
              <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-2 block animate-in fade-in slide-in-from-bottom-2 duration-700">Official Gallery</span>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter">작가의 철학이 담긴 컬렉션</h2>
           </div>
           <p className="text-xs font-bold text-gray-400 italic">Total {artworks.length} Pieces</p>
        </div>

        {artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
             {artworks.map((art, i) => (
               <Link key={art.id} href={`/artwork/${art.id}`} className="group animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-white shadow-sm border border-gray-50 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                     <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-10">
                        <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">View 3D & AR</span>
                        <h3 className="text-white text-xl font-black leading-tight">{art.title}</h3>
                     </div>
                  </div>
                  <div className="mt-6 px-4">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-gray-900 group-hover:text-primary transition-colors">{art.title}</h3>
                        <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded uppercase">{art.category}</span>
                     </div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">₩{art.priceRental.toLocaleString()} / mo</p>
                  </div>
               </Link>
             ))}
          </div>
        ) : (
          <div className="py-40 text-center bg-white rounded-[4rem] border border-gray-50 shadow-sm border-dashed">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Box className="h-10 w-10 text-gray-200" />
             </div>
             <p className="text-gray-400 font-bold italic">아직 공개된 작품이 없습니다.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-gray-100 bg-white">
        <div className="text-2xl font-black tracking-tighter mb-4 opacity-20">
          ART<span className="text-primary italic">LINK</span>
        </div>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Linking Art to Your Space Scale.</p>
      </footer>
    </div>
  );
};

export default ArtistPortfolioPage;
