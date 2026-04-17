'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Filter, Search, Grid, List, ArrowRight, Heart, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Header from '@/components/common/Header';

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
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchArtworks = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'All') params.append('category', filter);
      if (searchQuery) params.append('q', searchQuery);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const response = await fetch(`/api/artworks?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setArtworks(data || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArtworks();
    }, 500); // 디바운싱 추가

    return () => clearTimeout(timer);
  }, [filter, searchQuery, minPrice, maxPrice]);

  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">작품 탐색하기</h1>
            <p className="text-gray-500 italic">Find your perfect piece of art for your space.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 min-w-[240px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="작가나 작품명 검색..." 
                className="w-full bg-white border border-gray-100 py-4 pl-11 pr-4 rounded-3xl text-sm shadow-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-4 rounded-3xl transition-all border ${showFilters ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'}`}
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Advanced Filters Drawer */}
        {showFilters && (
          <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Min Price (Rental)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₩</span>
                  <input 
                    type="number" 
                    placeholder="최소 금액"
                    className="w-full bg-gray-50 border-none py-4 pl-10 pr-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Max Price (Rental)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₩</span>
                  <input 
                    type="number" 
                    placeholder="최대 금액"
                    className="w-full bg-gray-50 border-none py-4 pl-10 pr-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={() => { setMinPrice(''); setMaxPrice(''); setFilter('All'); setSearchQuery(''); }}
                  className="w-full py-4 text-xs font-black text-gray-400 hover:text-primary transition-colors uppercase tracking-widest underline underline-offset-4"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

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
