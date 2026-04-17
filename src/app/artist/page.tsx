'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, LayoutDashboard, ImageIcon, BarChart3, Settings, LogOut, ExternalLink, Box, Loader2 } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface Artwork {
  id: string;
  title: string;
  userId: string;
  artist: string;
  price_buy: number;
  price_rental: number;
  image_url: string;
  category: string;
  created_at: string;
}

const ArtistDashboard = () => {
  const { data: session, status } = useSession();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      if (status !== 'authenticated' || !session?.user) return;
      
      setIsLoading(true);
      try {
        const userId = (session.user as any).id;
        const response = await fetch(`/api/artworks?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setArtworks(data || []);
      } catch (error) {
        console.error('Error fetching artworks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchArtworks();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [session, status]);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed inset-y-0">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <img src="/logo.svg" alt="ArtLink Logo" className="h-8 w-auto transition-transform group-hover:scale-105" />
            <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded uppercase tracking-widest font-black">Artist</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: ImageIcon, label: 'My Gallery', active: false },
            { icon: BarChart3, label: 'Analytics', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 transition-colors text-sm font-bold"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome back, {session?.user?.name || 'Artist'}</h1>
            <p className="text-gray-500 font-medium italic">당신의 예술적 세계를 1:1 리얼 스케일로 공유하세요.</p>
          </div>
          <Link 
            href="/artist/upload"
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
          >
            <Plus className="h-5 w-5" />
            새 작품 등록하기
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Works', value: artworks.length.toString(), color: 'text-blue-600' },
            { label: 'Active Rentals', value: '0', color: 'text-green-600' },
            { label: 'AR Placements', value: '124', color: 'text-purple-600' },
            { label: 'Revenue (Month)', value: '₩0', color: 'text-gray-900' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Works List */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900">내가 등록한 작품들</h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{artworks.length} Pieces</span>
          </div>
          
          <div className="overflow-x-auto min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="font-bold animate-pulse">Loading Artwork Data...</p>
              </div>
            ) : artworks.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-10 py-5">Artwork</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Rental/Price</th>
                    <th className="px-6 py-5">AR Views</th>
                    <th className="px-10 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {artworks.map((work) => (
                    <tr key={work.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-20 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                            <img src={work.image_url} alt={work.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 leading-tight mb-1">{work.title}</p>
                            <p className="text-xs text-gray-400 font-bold italic">{work.artist}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-500 text-[10px] font-black uppercase rounded-full">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <p className="font-bold text-primary text-sm">₩{work.price_rental?.toLocaleString()}/m</p>
                        <p className="text-[10px] text-gray-400 font-medium">Sale: ₩{work.price_buy?.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-6 font-bold text-gray-900">
                        <div className="flex items-center gap-2">
                          <Box className="h-4 w-4 text-purple-400" />
                          0
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right space-x-3">
                        <Link 
                          href={`/artwork/${work.id}`}
                          className="inline-flex p-2.5 bg-gray-100 text-gray-400 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Link>
                        <button className="p-2.5 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-sm">
                          <Settings className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-24 text-gray-400">
                <p className="font-bold italic">등록된 작품이 없습니다. 새로운 작품을 등록해 보세요!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistDashboard;
