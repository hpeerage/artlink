'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Box, 
  Users, 
  DollarSign, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  Calendar,
  MessageSquare,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const ArtistDashboard = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/artist/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const userName = session?.user?.name || 'Artist';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-black text-[10px] uppercase tracking-widest text-gray-400">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Side Navigation (Minimal) */}
      <nav className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-100 flex flex-col items-center py-8 z-50">
        <Link href="/" className="mb-12">
          <div className="text-xl font-black text-primary italic">A.</div>
        </Link>
        <div className="flex-1 flex flex-col gap-8">
          <button className="p-3 bg-primary/10 text-primary rounded-2xl shadow-sm"><Box className="h-6 w-6" /></button>
          <button className="p-3 text-gray-300 hover:text-primary transition-colors"><MessageSquare className="h-6 w-6" /></button>
          <button className="p-3 text-gray-300 hover:text-primary transition-colors"><TrendingUp className="h-6 w-6" /></button>
          <button className="p-3 text-gray-300 hover:text-primary transition-colors"><Settings className="h-6 w-6" /></button>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="p-3 text-gray-300 hover:text-red-500 transition-colors"
        >
          <Calendar className="h-6 w-6" />
        </button>
      </nav>

      <main className="pl-28 pr-12 py-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-2 block">Artist Console</span>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">반가워요, {userName} 작가님!</h1>
          </div>
          <Link 
            href="/artist/works/new"
            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-[2rem] font-black text-sm hover:bg-primary transition-all shadow-xl shadow-gray-200"
          >
            <Plus className="h-5 w-5" />
            작품 등록하기
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: '활성 렌탈', value: stats?.activeRentals || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+12%' },
            { label: '내 작품 수', value: stats?.totalWorks || 0, icon: Box, color: 'text-purple-500', bg: 'bg-purple-50', trend: 'Total' },
            { label: '월 예상 수익', value: `₩${stats?.monthlyRevenue?.toLocaleString()}`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50', trend: '+5.4%' },
            { label: '누적 정산액', value: `₩${stats?.cumulativeRevenue?.toLocaleString()}`, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-50', trend: 'Confirmed' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
              <div className={`${item.bg} ${item.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon className="h-6 w-6" />
              </div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{item.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-gray-900">{item.value}</p>
                <span className={`text-[10px] font-bold ${item.trend.startsWith('+') ? 'text-green-500' : 'text-gray-400'}`}>
                   {item.trend}
                </span>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 opacity-20 rounded-full translate-x-12 -translate-y-12"></div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Performance Chart (Placeholder UI) */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-gray-900">수익 리포트</h3>
              <select className="bg-gray-50 border-none text-xs font-bold rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none">
                <option>최근 6개월</option>
                <option>최근 1년</option>
              </select>
            </div>
            
            <div className="h-64 flex items-end gap-2 px-4">
              {[40, 70, 45, 90, 65, 80, 55, 95, 75, 40, 60, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-gray-50 rounded-t-xl relative group hover:bg-primary/10 transition-colors">
                  <div 
                    className="absolute bottom-0 w-full bg-primary rounded-t-xl opacity-20 group-hover:opacity-100 transition-all cursor-pointer" 
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
                       ₩{(h * 10).toLocaleString()}k
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 px-4">
               {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                 <span key={m} className="text-[10px] font-black text-gray-300 uppercase">{m}</span>
               ))}
            </div>
          </div>

          {/* Quick Actions & Recent Subs */}
          <div className="space-y-8">
             <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-gray-200 relative overflow-hidden">
                <h3 className="text-xl font-black mb-2 relative z-10">작가 등급: Professional</h3>
                <p className="text-gray-400 text-sm mb-8 font-medium relative z-10">다음 등급까지 3건의 활성 렌탈이 더 필요합니다.</p>
                <div className="w-full bg-white/10 h-2 rounded-full mb-8 relative z-10 overflow-hidden">
                   <div className="w-[70%] h-full bg-primary rounded-full"></div>
                </div>
                <button className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-xs hover:bg-primary hover:text-white transition-all relative z-10 shadow-lg">혜택 확인하기</button>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full translate-x-16 -translate-y-16"></div>
             </div>

             <div className="bg-white rounded-[3rem] p-10 border border-gray-50 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-6">최신 렌탈 소식</h3>
                <div className="space-y-6">
                   {[
                     { name: '김민준', work: 'Urban Echoes', date: '2시간 전', type: '신규 구독' },
                     { name: '이서윤', work: 'Silent Peaks', date: '5시간 전', type: '구독 갱신' },
                     { name: '박지민', work: 'Neon Pulse', date: '어제', type: '신규 구독' },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center font-black text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors text-xs">
                             {item.name[0]}
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-900 leading-none mb-1">{item.name}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{item.work} | {item.date}</p>
                           </div>
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase group-hover:translate-x-1 transition-transform tracking-widest">{item.type}</span>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-8 py-3 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                   더 보기
                   <ChevronRight className="h-4 w-4" />
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistDashboard;
