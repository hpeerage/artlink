'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Filter, Search, Grid, List, ArrowRight, Heart, Loader2 } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  priceBuy: number;
  priceRental: number;
  imageUrl: string;
  category: string;
}

const ExplorePage = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Modern' | 'Abstract' | 'Traditional' | 'Digital'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchArtworks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/artworks');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setArtworks(data || []);
      } catch (error) {
        console.error('Error fetching artworks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const { data: session, status } = useSession();

  const filteredArtworks = useMemo(() => {
    return artworks.filter(art => {
      const categoryMatch = filter === 'All' || art.category === filter;
      const searchMatch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.artist.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [artworks, filter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.svg" alt="ArtLink Logo" className="h-8 w-auto transition-transform group-hover:scale-105" />
          </Link>
          <div className="hidden md:flex gap-8 font-bold text-sm text-gray-600 uppercase tracking-widest">
            <Link href="/explore" className="text-primary">Explore</Link>
            <Link href="/ar" className="hover:text-primary">AR Gallery</Link>
            <Link href="/my" className="hover:text-primary">My Page</Link>
          </div>
          
          <div className="flex items-center gap-4">
            {status === 'authenticated' ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">
                  Welcome, <span className="text-gray-900">{session?.user?.name || 'Artist'}</span>
                </span>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-gray-200 hover:bg-primary transition-all active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">작품 탐색하기</h1>
            <p className="text-gray-500 italic">Find your perfect piece of art for your space.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="작가나 작품명 검색..." 
                className="w-full bg-white border border-gray-200 py-3 pl-11 pr-4 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-white border border-gray-200 p-3 rounded-2xl hover:bg-gray-50 text-gray-600 transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide">
          {['All', 'Modern', 'Abstract', 'Traditional', 'Digital'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                filter === cat 
                ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                : 'bg-white text-gray-500 border border-gray-100 hover:border-primary/30 hover:text-primary'
              }`}
            >
              {cat === 'All' ? '전체 보기' : cat}
            </button>
          ))}
        </div>

        {/* Grid or Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Fetching Masterpieces...</p>
          </div>
        ) : filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((art) => (
              <div key={art.id} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-50 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={art.imageUrl} 
                    alt={art.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                <div className="absolute top-5 right-5 z-10">
                  <button className="bg-white/90 backdrop-blur p-2.5 rounded-2xl shadow-lg text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <Link 
                    href={`/artwork/${art.id}`}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-white hover:text-primary transition-all shadow-xl"
                  >
                    AR 실물 크기 체험하기
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-[10px] font-black tracking-widest text-gray-500 rounded-full uppercase mb-2">
                      {art.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                      {art.title}
                    </h3>
                    <p className="text-sm text-gray-400 italic mb-4">{art.artist}</p>
                  </div>
                </div>
                
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">구매가</p>
                      <p className="font-bold text-gray-900">₩{art.priceBuy?.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-primary tracking-tighter">정기 렌탈</p>
                      <p className="font-black text-primary text-xl">₩{art.priceRental?.toLocaleString()}<span className="text-xs font-medium ml-1">/월</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-50">
             <p className="text-gray-400 font-bold italic">검색 결과가 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExplorePage;
