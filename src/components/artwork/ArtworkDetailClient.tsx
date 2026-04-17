'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArtLinkModelViewer from '@/components/ar/ModelViewer';
import BillingKeyForm from '@/components/payment/BillingKeyForm';
import { ArrowLeft, Box, ShieldCheck, Share2, Info, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';

import { useSession, signIn } from 'next-auth/react';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  category: string;
  price_buy: number;
  price_rental: number;
  image_url: string;
  model_url?: string;
  description: string;
}

interface ArtworkDetailClientProps {
  artwork: Artwork;
}

const ArtworkDetailClient: React.FC<ArtworkDetailClientProps> = ({ artwork }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showPayment, setShowPayment] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoadingSub, setIsLoadingSub] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isTogglingFav, setIsTogglingFav] = useState(false);
  const [frameType, setFrameType] = useState<'wood' | 'white' | 'black'>('wood');
  const [snapshot, setSnapshot] = useState<string | null>(null);

  React.useEffect(() => {
    const checkStatus = async () => {
      if (!session) {
        setIsLoadingSub(false);
        return;
      }

      setIsLoadingSub(true);
      try {
        // 1. 구독 확인
        const subRes = await fetch('/api/my/subscriptions');
        if (subRes.ok) {
          const subscriptions = await subRes.json();
          const hasActiveSub = subscriptions.some(
            (sub: any) => sub.artworkId === artwork.id && sub.status === 'active'
          );
          if (hasActiveSub) setIsSubscribed(true);
        }

        // 2. 찜하기 확인
        const favRes = await fetch('/api/my/favorites');
        if (favRes.ok) {
          const favorites = await favRes.json();
          const isFav = favorites.some((f: any) => f.artworkId === artwork.id);
          setIsFavorited(isFav);
        }
      } catch (err) {
        console.error('Error checking status:', err);
      } finally {
        setIsLoadingSub(false);
      }
    };

    checkStatus();
  }, [artwork.id, session]);

  const handleFavoriteClick = async () => {
    if (!session) {
      if (confirm('관심 작품 등록을 위해 로그인이 필요합니다.')) signIn();
      return;
    }

    if (isTogglingFav) return;
    setIsTogglingFav(true);

    try {
      const res = await fetch('/api/my/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId: artwork.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFavorited(data.active);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsTogglingFav(false);
    }
  };

  const handleShare = async (platform?: string) => {
    if (!snapshot) return;

    // Web Share API 지원 여부 확인
    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
      try {
        // Base64를 Blob으로 변환
        const response = await fetch(snapshot);
        const blob = await response.blob();
        const file = new File([blob], `artlink-snapshot-${artwork.title}.png`, { type: 'image/png' });

        await navigator.share({
          files: [file],
          title: `ArtLink: ${artwork.title}`,
          text: `${artwork.artist} 작가의 작품을 내 공간에 배치해 보았습니다. #ArtLink #AR커머스`,
        });
        return;
      } catch (err) {
        console.error('Sharing failed:', err);
      }
    }

    // 데스크탑이나 미지원 시 기본 동작 (다운로드 등)
    if (platform === 'save') {
      const link = document.createElement('a');
      link.href = snapshot;
      link.download = `artlink-snapshot-${artwork.title}.png`;
      link.click();
    } else {
      alert('스냅샷 이미지를 저장한 후 SNS에 공유해 주세요!');
    }
  };

  const handleRentalClick = () => {
    if (!session) {
      if (confirm('렌탈 신청을 위해 로그인이 필요합니다. 로그인 페이지로 이동할까요?')) {
        signIn();
      }
      return;
    }
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 font-bold hover:text-black transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>BACK</span>
          </button>
          <div className="flex gap-4">
            <button 
              onClick={handleFavoriteClick}
              disabled={isTogglingFav}
              className={`p-2 border rounded-xl transition-all ${
                isFavorited 
                ? 'bg-red-50 border-red-100 text-red-500 shadow-sm' 
                : 'border-gray-100 text-gray-400 hover:bg-gray-50'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50">
              <Share2 className="h-5 w-5 text-gray-400" />
            </button>
            <button className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50">
              <Info className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: AR Viewer */}
          <section className="sticky top-24">
            <div className="mb-6 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-2xl text-xs font-black tracking-widest uppercase mb-6">
              <Box className="h-4 w-4" />
              1:1 Real Scale WebAR
            </div>
            <ArtLinkModelViewer 
              modelUrl={artwork.model_url || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'} 
              textureUrl={artwork.image_url} 
              frameType={frameType}
              onSnapshot={(data) => setSnapshot(data)}
              height="700px"
              alt={artwork.title}
            />
            <p className="mt-4 text-center text-sm text-gray-400 italic">
              * 모바일에서 우측 하단의 [공간에 배치하기] 버튼을 클릭하여 AR을 체험해 보세요.
            </p>
          </section>

          {/* Right: Info & Purchase */}
          <section className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-[10px] font-black text-gray-600 rounded-full">{artwork.category}</span>
                <span className="text-secondary text-[10px] font-black uppercase tracking-tighter">● In Stock</span>
              </div>
              <h1 className="text-5xl font-black text-gray-900 mb-2 leading-tight">{artwork.title}</h1>
              <p className="text-xl font-bold text-gray-400 mb-8 italic">{artwork.artist}</p>
              
              <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 mb-10">
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  {artwork.description}
                </p>
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Select Frame Material</p>
                  <div className="flex gap-3">
                    {[
                      { id: 'wood', label: 'Classic Wood', color: '#6B4423', effect: 'shadow-inner' },
                      { id: 'white', label: 'Modern White', color: '#FFFFFF', effect: 'bg-gradient-to-br from-white to-gray-100' },
                      { id: 'black', label: 'Sleek Black', color: '#1A1A1A', effect: 'bg-gradient-to-br from-gray-800 to-black' },
                    ].map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => setFrameType(frame.id as any)}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all duration-300 ${
                          frameType === frame.id 
                          ? 'border-primary bg-white shadow-xl -translate-y-1' 
                          : 'border-transparent bg-gray-50 hover:bg-white hover:shadow-md'
                        }`}
                      >
                        <div 
                          className={`w-10 h-10 rounded-full border border-gray-100 shadow-sm mb-1 ${frame.effect}`} 
                          style={{ backgroundColor: frame.color }}
                        ></div>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${frameType === frame.id ? 'text-primary' : 'text-gray-400'}`}>
                          {frame.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">일반 구매가</p>
                  <p className="text-2xl font-black text-gray-900">₩{artwork.price_buy?.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-primary/5 border border-primary/10 rounded-[2rem] shadow-sm">
                  <p className="text-[10px] font-black text-primary uppercase mb-2 tracking-widest">정기 렌탈 (구독)</p>
                  <p className="text-2xl font-black text-primary">₩{artwork.price_rental?.toLocaleString()}<span className="text-sm font-medium"> /월</span></p>
                </div>
              </div>

              {!isSubscribed ? (
                <div className="space-y-4">
                  <button 
                    onClick={handleRentalClick}
                    className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 transition-all hover:bg-blue-700 hover:-translate-y-1"
                  >
                    <ShieldCheck className="h-6 w-6" />
                    정기 렌탈 구독하기
                  </button>
                  <button className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all hover:bg-black">
                    즉시 구매하기
                  </button>
                </div>
              ) : (
                <div className="p-8 bg-green-50 border border-green-100 rounded-[2.5rem] flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-black text-green-900 mb-2">구독 중인 작품입니다</h3>
                  <p className="text-green-700 text-sm mb-6">마이페이지에서 구독 상태를 관리할 수 있습니다.</p>
                  <Link href="/my" className="text-green-900 font-bold underline">구독 정보 확인하기</Link>
                </div>
              )}
            </div>

            <section className="pt-10 border-t border-gray-100">
              <h3 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-xs flex items-center gap-2">
                <div className="w-1 h-4 bg-primary"></div>
                Service Comparison (Tab 7)
              </h3>
              <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm mb-10 text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 font-black text-gray-400 uppercase tracking-tighter">
                    <tr>
                      <th className="px-6 py-4">Benefit Items</th>
                      <th className="px-6 py-4">Rental (Subscription)</th>
                      <th className="px-6 py-4">Purchase (Sale)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-bold">
                    <tr>
                      <td className="px-6 py-4 text-gray-500">Initial Cost</td>
                      <td className="px-6 py-4 text-primary">₩{artwork.price_rental?.toLocaleString()}</td>
                      <td className="px-6 py-4">₩{artwork.price_buy?.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-500">Style Change</td>
                      <td className="px-6 py-4 text-secondary">Free (Every 3 months)</td>
                      <td className="px-6 py-4">N/A</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-gray-500">Maintenance</td>
                      <td className="px-6 py-4 text-secondary">Professional Support</td>
                      <td className="px-6 py-4">Self</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: 'FREE Delivery', desc: '전국 무료 배송 및 전문가 설치 지원' },
                  { title: 'Style Change', desc: '분기별 1회 작품 무상 교체 가능 (보험 가입 시)' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>
        </div>
      </main>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPayment(false)}></div>
          <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowPayment(false)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <BillingKeyForm 
              artworkId={artwork.id}
              artworkTitle={artwork.title}
              monthlyAmount={artwork.price_rental}
              onSuccess={() => {
                setIsSubscribed(true);
                setShowPayment(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Snapshot Preview Modal */}
      {snapshot && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSnapshot(null)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="relative aspect-square md:aspect-video bg-gray-900">
              <img src={snapshot} alt="AR Snapshot" className="w-full h-full object-contain" />
              <div className="absolute top-6 right-6">
                 <button onClick={() => setSnapshot(null)} className="bg-white/20 hover:bg-white/40 backdrop-blur p-2 rounded-full text-white transition-all">
                   <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">My Virtual Gallery</p>
                  <h3 className="text-xl font-black">{artwork.title}</h3>
                </div>
                <div className="text-right text-white/40 text-[10px] font-bold">
                  Captured via ART<span className="text-primary italic">LINK</span>
                </div>
              </div>
            </div>
            
            <div className="p-10 text-center">
              <h4 className="text-2xl font-black text-gray-900 mb-2">공간에 배치된 작품을 공유해 보세요!</h4>
              <p className="text-gray-400 text-sm mb-8 font-medium italic">당신의 예술적 감각이 닿은 공간은 어떤 모습인가요?</p>
              
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => handleShare('instagram')}
                  className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all group"
                >
                   <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                     <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.247 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.061 1.365-.333 2.633-1.308 3.608-.975.975-2.242 1.247-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.061-2.633-.333-3.608-1.308-.975-.975-1.247-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.061-1.365.333-2.633 1.308-3.608.975-.975 2.242-1.247 3.607-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.352.062-2.316.32-3.138 1.241-.822.822-1.08 1.786-1.142 3.138-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.062 1.352.32 2.316 1.241 3.138.822.822 1.786 1.08 3.138 1.142 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.352-.062 2.316-.32 3.138-1.241.822-.822 1.08-1.786 1.142-3.138.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.062-1.352-.32-2.316-1.241-3.138-.822-.822-1.786-1.08-3.138-1.142-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                   </div>
                   <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Instagram</span>
                </button>
                <button 
                  onClick={() => handleShare('kakao')}
                  className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all group"
                >
                   <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                     <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.27 6.107-.175.665-.63 2.392-.72 2.747-.11.431.155.426.326.31.135-.092 2.148-1.46 3.003-2.042.433.06.877.093 1.121.093 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"/></svg>
                   </div>
                   <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">KakaoTalk</span>
                </button>
                <button 
                  onClick={() => handleShare('save')}
                  className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-gray-900 border border-gray-900 hover:bg-primary transition-all group text-white"
                >
                   <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4-4v12" /></svg>
                   </div>
                   <span className="text-[10px] font-black tracking-widest uppercase">Save Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkDetailClient;
