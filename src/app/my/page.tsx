'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, CreditCard, Box, LogOut, ChevronRight, Bookmark, Loader2 } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  price_buy: number;
  price_rental: number;
  image_url: string;
}

const MyPage = () => {
  const { data: session } = useSession();
  const [subscribedWork, setSubscribedWork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/artlink/api/my/subscriptions');
        if (response.ok) {
          const data = await response.json();
          // 가장 최근 구독 대상을 표시 (현재 환경 가정)
          if (data && data.length > 0) {
            setSubscribedWork(data[0].artwork);
          }
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const userInitial = session?.user?.name?.[0]?.toUpperCase() || 'H';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b border-gray-100 px-8 py-5">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/artlink/logo.svg" alt="ArtLink Logo" className="h-8 w-auto transition-transform group-hover:scale-105" />
          </Link>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => signOut({ callbackUrl: "/artlink" })}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
            >
              Logout
            </button>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black shadow-inner">
              {userInitial}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="space-y-2">
            {[
              { icon: User, label: '프로필 설정', active: true },
              { icon: Box, label: '내 렌탈 내역', active: false },
              { icon: Bookmark, label: '관심 작품', active: false },
              { icon: CreditCard, label: '결제 수단 관리', active: false },
              { icon: LogOut, label: '로그아웃', active: false },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${
                  item.active 
                  ? 'bg-white text-gray-900 shadow-sm font-bold border border-gray-100' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.active && <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-10">
            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50 overflow-hidden relative">
               <div className="relative z-10">
                <h1 className="text-3xl font-black text-gray-900 mb-2">안녕하세요, 훈님!</h1>
                <p className="text-gray-400 font-medium mb-8">ArtLink와 함께 예술적인 공간을 만들어가고 있습니다.</p>
                
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { label: '구독 중인 작품', value: subscribedWork ? '1' : '0', unit: '점' },
                    { label: '누적 렌탈 기간', value: '124', unit: '일' },
                    { label: '아티스트 팔로우', value: '12', unit: '명' },
                  ].map((stat, i) => (
                    <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-2xl font-black text-gray-900">{stat.value}<span className="text-xs font-medium ml-1 text-gray-400">{stat.unit}</span></p>
                    </div>
                  ))}
                </div>
               </div>
               {/* Decorative background shape */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-32 -translate-y-32"></div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900">최근 구독 내역</h3>
                <Link href="/explore" className="text-sm font-bold text-primary">더 보기</Link>
              </div>
              
              {isLoading ? (
                <div className="bg-white rounded-[2.5rem] p-24 border border-gray-50 shadow-sm flex flex-col items-center justify-center gap-4 text-gray-400">
                   <Loader2 className="h-10 w-10 animate-spin text-primary" />
                   <p className="font-bold">최신 구독 정보를 불러오는 중...</p>
                </div>
              ) : subscribedWork ? (
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-32 h-40 bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
                    <img src={subscribedWork.image_url} alt={subscribedWork.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-500 text-[10px] font-black uppercase tracking-tighter rounded-full mb-3">구독 중 (Active)</span>
                    <h4 className="text-2xl font-black text-gray-900 mb-1">{subscribedWork.title}</h4>
                    <p className="text-gray-400 font-bold italic mb-5">{subscribedWork.artist}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <button className="px-6 py-2 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-black transition-all">결제 정보</button>
                      <button className="px-6 py-2 border border-gray-200 text-gray-500 text-xs font-black rounded-xl hover:bg-gray-50 transition-all">구독 취소</button>
                    </div>
                  </div>
                  <div className="text-right border-t md:border-t-0 md:border-l border-gray-50 pt-6 md:pt-0 md:pl-12 w-full md:w-auto">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">다음 결제일</p>
                     <p className="text-xl font-black text-gray-900">2026.04.28</p>
                     <p className="text-xs font-bold text-primary mt-1 italic">₩{subscribedWork.price_rental?.toLocaleString()} 예정</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] p-24 border border-gray-50 shadow-sm text-center text-gray-400">
                   <p className="font-bold italic mb-4">현재 구독 중인 작품이 없습니다.</p>
                   <Link href="/explore" className="text-primary font-black underline">작품 둘러보기</Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPage;
