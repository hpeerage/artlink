'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArtLinkModelViewer from '@/components/ar/ModelViewer';
import BillingKeyForm from '@/components/payment/BillingKeyForm';
import { 
  ArrowLeft, 
  Box, 
  ShieldCheck, 
  Share2, 
  Info, 
  CheckCircle2, 
  X, 
  Heart, 
  MessageSquare, 
  Loader2,
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import ChatWindow from '@/components/common/ChatWindow';

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
  widthMm: number;
  heightMm: number;
  userId?: string;
}

interface ArtworkDetailClientProps {
  artwork: Artwork;
}

const ArtworkDetailClient: React.FC<ArtworkDetailClientProps> = ({ artwork }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [showPayment, setShowPayment] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoadingSub, setIsLoadingSub] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isTogglingFav, setIsTogglingFav] = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);
  const [frameType, setFrameType] = useState<'wood' | 'white' | 'black'>('wood');
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [rentalType, setRentalType] = useState<'rental' | 'buy'>('rental');

  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [isAiDocentLoading, setIsAiDocentLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const fetchAiDocent = async () => {
    setIsAiDocentLoading(true);
    setIsAiModalOpen(true);
    try {
      const res = await fetch('/api/ai/docent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId: artwork.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('AI Docent failed:', err);
    } finally {
      setIsAiDocentLoading(false);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      if (!session) {
        setIsLoadingSub(false);
      } else {
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

          // 3. 작가 팔로우 확인
          if (artwork.userId) {
            const followRes = await fetch('/api/my/following');
            if (followRes.ok) {
              const following = await followRes.json();
              const isFol = following.some((f: any) => f.followingId === artwork.userId);
              setIsFollowing(isFol);
            }
          }
        } catch (err) {
          console.error('Error checking status:', err);
        } finally {
          setIsLoadingSub(false);
        }
      }

      // 4. 리뷰 데이터 로드
      try {
        const revRes = await fetch(`/api/reviews?artworkId=${artwork.id}`);
        if (revRes.ok) {
          const revData = await revRes.json();
          setReviews(revData || []);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    checkStatus();
  }, [artwork.id, artwork.userId, session]);

  const handleFavoriteClick = async () => {
    if (!session) {
      if (confirm(t('common.error_auth_required'))) signIn();
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

  const handleFollowClick = async () => {
    if (!session) {
      if (confirm(t('common.error_auth_required'))) signIn();
      return;
    }

    if (isTogglingFollow || !artwork.userId) return;
    setIsTogglingFollow(true);

    try {
      const res = await fetch('/api/my/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: artwork.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.status === 'followed');
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    } finally {
      setIsTogglingFollow(false);
    }
  };

  const handleShare = async (platform?: string) => {
    if (!snapshot) return;

    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
      try {
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
      if (confirm(t('common.error_auth_required'))) {
        signIn();
      }
      return;
    }
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-white">
      
      <div className="container mx-auto px-6 pt-8 flex justify-between items-center">
        <Link href="/explore" className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back_to_list')}
        </Link>
      </div>

      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: AR Viewer */}
          <section className="sticky top-24">
            <div className="mb-6 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-2xl text-xs font-black tracking-widest uppercase">
              <Box className="h-4 w-4" />
              1:1 Real Scale WebAR
            </div>
            
            <div className="w-full aspect-square bg-[#F8FAFC] rounded-[3rem] overflow-hidden relative shadow-inner group">
              <ArtLinkModelViewer 
                modelUrl={artwork.model_url || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'} 
                textureUrl={artwork.image_url} 
                frameType={frameType}
                onSnapshot={(data) => setSnapshot(data)}
                height="100%"
                alt={artwork.title}
              />
              
              <div className="absolute top-8 right-8 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                   onClick={handleFavoriteClick}
                   className={`p-4 rounded-2xl shadow-xl transition-all ${isFavorited ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
                 >
                    <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />
                 </button>
                 <button 
                   onClick={() => handleShare('save')}
                   className="bg-white p-4 rounded-2xl shadow-xl text-gray-400 hover:text-primary transition-all"
                 >
                    <Share2 className="h-6 w-6" />
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
               {[
                 { label: t('artwork.width'), value: `${artwork.widthMm}mm` },
                 { label: t('artwork.height'), value: `${artwork.heightMm}mm` },
                 { label: t('artwork.format'), value: '3D/AR Ready' }
               ].map((spec, i) => (
                 <div key={i} className="bg-gray-50 p-6 rounded-3xl text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{spec.label}</p>
                    <p className="text-sm font-black text-gray-900">{spec.value}</p>
                 </div>
               ))}
            </div>
          </section>

          {/* Right: Info & Purchase */}
          <section className="space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{artwork.category}</span>
                  <div className="h-px flex-1 bg-gray-100"></div>
               </div>
               <h1 className="text-5xl font-black text-gray-900 leading-none mb-4 tracking-tighter">{artwork.title}</h1>
                  <div className="flex items-center gap-3 group">
                    <div className="cursor-pointer flex items-center gap-3" onClick={() => setIsChatOpen(true)}>
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center font-black text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {artwork.artist[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{artwork.artist}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{t('artwork.artist_consult')} →</p>
                      </div>
                    </div>
                    
                    {session?.user && (session.user as any).id !== artwork.userId && (
                      <button 
                        onClick={handleFollowClick}
                        disabled={isTogglingFollow}
                        className={`ml-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          isFollowing 
                          ? 'bg-gray-100 text-gray-400 hover:bg-gray-200' 
                          : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={fetchAiDocent}
                    className="ml-auto flex items-center gap-2 bg-gradient-to-r from-primary to-blue-500 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                  >
                    <Sparkles className="h-4 w-4" />
                    {t('artwork.aiDocent')}
                  </button>
               </div>
            </div>
              
            <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 mb-10">
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  {artwork.description}
                </p>
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t('artwork.select_frame')}</p>
                  <div className="flex gap-3">
                    {[
                      { id: 'wood', label: 'Classic Wood', color: '#6B4423' },
                      { id: 'white', label: 'Modern White', color: '#FFFFFF' },
                      { id: 'black', label: 'Sleek Black', color: '#1A1A1A' },
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
                          className="w-10 h-10 rounded-full border border-gray-100 shadow-sm mb-1" 
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

              {!isSubscribed ? (
                <div className="space-y-6">
                  <div className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer ${rentalType === 'rental' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-gray-50 bg-white hover:border-gray-100'}`} onClick={() => setRentalType('rental')}>
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black uppercase text-primary tracking-widest">Monthly Rental</span>
                       {rentalType === 'rental' && <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center font-bold text-white text-[10px]">✓</div>}
                    </div>
                    <div className="flex items-baseline gap-1">
                       <span className="text-3xl font-black text-gray-900">₩{artwork.price_rental?.toLocaleString()}</span>
                       <span className="text-sm font-black text-gray-400 uppercase">/ Month</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleRentalClick}
                      className="bg-gray-900 text-white py-6 rounded-[2rem] font-black text-sm hover:bg-primary transition-all active:scale-95 shadow-2xl shadow-gray-200"
                    >
                      {t('artwork.rental')}
                    </button>
                    <button 
                      onClick={() => setIsChatOpen(true)}
                      className="bg-white border-2 border-gray-100 text-gray-900 py-6 rounded-[2rem] font-black text-sm hover:border-primary hover:text-primary transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="h-5 w-5" />
                      {t('artwork.artist_consult')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-green-50 border border-green-100 rounded-[2.5rem] flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-black text-green-900 mb-2">{t('artwork.subscribed')}</h3>
                  <p className="text-green-700 text-sm mb-6">{t('artwork.go_to_my')}</p>
                  <Link href="/my" className="text-green-900 font-bold underline">{t('common.mypage')}</Link>
                </div>
              )}

              <section className="pt-10 border-t border-gray-100">
                <h3 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-xs flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary"></div>
                  {t('artwork.comparison')}
                </h3>
                <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm mb-10 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 font-black text-gray-400 uppercase tracking-tighter">
                      <tr>
                        <th className="px-6 py-4">{t('artwork.benefit_item')}</th>
                        <th className="px-6 py-4">{t('artwork.rental')}</th>
                        <th className="px-6 py-4">{t('artwork.buy')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-bold">
                      <tr>
                        <td className="px-6 py-4 text-gray-500">{t('artwork.initial_cost')}</td>
                        <td className="px-6 py-4 text-primary">₩{artwork.price_rental?.toLocaleString()}</td>
                        <td className="px-6 py-4">₩{artwork.price_buy?.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-gray-500">{t('artwork.style_change')}</td>
                        <td className="px-6 py-4 text-secondary">Free (Every 3mo)</td>
                        <td className="px-6 py-4">N/A</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-gray-500">{t('artwork.maintenance')}</td>
                        <td className="px-6 py-4 text-secondary">Pro Support</td>
                        <td className="px-6 py-4">Self</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
          </section>
        </div>
      </main>

      {/* Review Section */}
      <section className="bg-gray-50/50 py-24 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex justify-between items-end mb-12">
            <div>
               <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-2 block">{t('artwork.reviews')}</span>
               <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t('artwork.review_subtitle')}</h2>
            </div>
            {reviews.length > 0 && (
              <div className="text-right">
                <p className="text-4xl font-black text-gray-900 mb-1">
                  {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                </p>
                <div className="flex gap-0.5 text-amber-400 justify-end mb-2">
                  {[...Array(5)].map((_, i) => <Heart key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-xs font-bold text-gray-400">{reviews.length} reviews</p>
              </div>
            )}
          </div>

          {isLoadingReviews ? (
            <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/30" /></div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400">
                        {rev.user?.name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{rev.user?.name || 'Anonymous'}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Verified Collector</p>
                      </div>
                      <div className="ml-auto flex gap-0.5 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => <Heart key={i} className="h-3 w-3 fill-current" />)}
                      </div>
                   </div>
                   
                   {rev.imageUrl && (
                     <div className="aspect-video mb-6 rounded-2xl overflow-hidden bg-gray-100">
                        <img src={rev.imageUrl} alt="Review" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     </div>
                   )}
                   
                   <p className="text-sm text-gray-600 leading-relaxed font-medium italic">"{rev.comment}"</p>
                   <p className="text-[10px] text-gray-300 mt-6 font-bold uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-[3rem] border border-gray-100 text-center text-gray-300">
               <MessageSquare className="h-10 w-10 mx-auto mb-4 opacity-20" />
               <p className="text-sm font-bold italic">{t('artwork.no_reviews')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-20 text-center border-t border-gray-50 bg-white">
        <div className="text-2xl font-black tracking-tighter mb-4 opacity-20">
          ART<span className="text-primary italic">LINK</span>
        </div>
        <p className="text-xs text-gray-400 font-bold">© 2026 ArtLink Platform. {t('common.rights')}</p>
      </footer>

      {/* Modals */}
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

      {/* Snapshot Preview */}
      {snapshot && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSnapshot(null)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="relative aspect-square md:aspect-video bg-gray-900">
              <img src={snapshot} alt="AR Snapshot" className="w-full h-full object-contain" />
              <div className="absolute top-6 right-6">
                 <button onClick={() => setSnapshot(null)} className="bg-white/20 hover:bg-white/40 backdrop-blur p-2 rounded-full text-white transition-all">
                   <X className="h-6 w-6" />
                 </button>
              </div>
            </div>
            <div className="p-10 text-center">
              <h4 className="text-2xl font-black text-gray-900 mb-2">{t('artwork.share_ar')}</h4>
              <button 
                onClick={() => handleShare('save')}
                className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl hover:bg-primary transition-all"
              >
                {t('artwork.save_share')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isChatOpen && artwork.userId && (
        <ChatWindow 
          otherUserId={artwork.userId} 
          otherUserName={artwork.artist} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
      {/* AI Docent Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsAiModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[3.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
             <div className="bg-gradient-to-r from-primary to-blue-600 p-10 text-white relative">
                <button 
                  onClick={() => setIsAiModalOpen(false)}
                  className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                   <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                      <Sparkles className="h-6 w-6" />
                   </div>
                   <span className="text-xs font-black uppercase tracking-widest opacity-80">AI Intelligent Docent</span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter leading-tight">작품에 담긴 <br/>예술적 서사를 읽어드립니다.</h2>
             </div>
             
             <div className="p-10 max-h-[60vh] overflow-y-auto space-y-10 custom-scrollbar">
                {isAiDocentLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4 text-gray-300">
                     <Loader2 className="h-10 w-10 animate-spin text-primary" />
                     <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Analyzing Artwork with Vision AI...</p>
                  </div>
                ) : aiAnalysis && (
                  <>
                     <div className="space-y-4">
                        <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                           <BookOpen className="h-4 w-4" /> 01. Artistic Philosophy
                        </h4>
                        <p className="text-gray-600 font-medium leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2 bg-gray-50/50 rounded-r-2xl">
                           {aiAnalysis.philosophy}
                        </p>
                     </div>
                     <div className="space-y-4">
                        <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                           <Box className="h-4 w-4" /> 02. Technical Methodology
                        </h4>
                        <p className="text-gray-600 font-medium leading-relaxed">
                           {aiAnalysis.technique}
                        </p>
                     </div>
                     <div className="space-y-4">
                        <h4 className="text-xs font-black text-purple-500 uppercase tracking-widest flex items-center gap-2">
                           <Info className="h-4 w-4" /> 03. Creative Context
                        </h4>
                        <p className="text-gray-600 font-medium leading-relaxed">
                           {aiAnalysis.context}
                        </p>
                     </div>
                     <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100/50">
                        <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3">Curator's Placement Tip</h4>
                        <p className="text-sm font-bold text-orange-900 leading-relaxed">
                           {aiAnalysis.curatorTip}
                        </p>
                     </div>
                  </>
                )}
             </div>
             <div className="p-10 border-t border-gray-50 text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">ArtLink AI Intelligence Engine v2.0</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtworkDetailClient;
