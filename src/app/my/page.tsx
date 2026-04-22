'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Settings, 
  CreditCard, 
  Box, 
  LogOut, 
  ChevronRight, 
  Bookmark, 
  Loader2, 
  Heart, 
  Users, 
  Star, 
  Building2, 
  Clock,
  ExternalLink,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  priceRental: number;
  imageUrl: string;
}

type TabType = 'rentals' | 'favorites' | 'following' | 'reviews' | 'b2b';

const MyPage = () => {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [b2bInquiries, setB2bInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('rentals');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subRes, favRes, followRes, reviewRes, b2bRes] = await Promise.all([
        fetch('/api/my/subscriptions'),
        fetch('/api/my/favorites'),
        fetch('/api/my/following'),
        fetch('/api/my/reviews'),
        fetch('/api/my/b2b-inquiries')
      ]);
      
      if (subRes.ok) setSubscriptions(await subRes.json());
      if (favRes.ok) setFavorites(await favRes.json());
      if (followRes.ok) setFollowing(await followRes.json());
      if (reviewRes.ok) setReviews(await reviewRes.json());
      if (b2bRes.ok) setB2bInquiries(await b2bRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchData();
  }, [session]);

  const userName = session?.user?.name || 'User';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="space-y-2 h-fit sticky top-24">
            <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm mb-6 flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl">
                 {userName.substring(0, 1)}
               </div>
               <div>
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Collector</p>
                 <p className="font-black text-gray-900">{userName}</p>
               </div>
            </div>

            {[
              { id: 'rentals', icon: Box, label: t('mypage.tab_rentals'), active: activeTab === 'rentals' },
              { id: 'favorites', icon: Heart, label: t('mypage.tab_favorites'), active: activeTab === 'favorites' },
              { id: 'following', icon: Users, label: t('mypage.tab_following'), active: activeTab === 'following' },
              { id: 'reviews', icon: MessageSquare, label: t('mypage.tab_reviews'), active: activeTab === 'reviews' },
              { id: 'b2b', icon: Building2, label: t('mypage.tab_b2b'), active: activeTab === 'b2b' },
              { id: 'logout', icon: LogOut, label: t('common.logout'), active: false },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id !== 'logout') setActiveTab(item.id as any);
                  else signOut({ callbackUrl: "/" });
                }}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${
                  item.active 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 font-black' 
                  : 'text-gray-400 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${item.active ? 'text-white' : 'text-gray-400'}`} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.active && <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Summary Banner */}
            <section className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
                 <div>
                    <h1 className="text-3xl font-black mb-2 tracking-tighter">{t('mypage.title')}</h1>
                    <p className="text-gray-400 font-medium">{t('mypage.subtitle')}</p>
                 </div>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                   {[
                     { label: t('mypage.stat_subscribing'), value: subscriptions.length },
                     { label: t('mypage.stat_favorites'), value: favorites.length },
                     { label: t('mypage.stat_following'), value: following.length },
                     { label: t('mypage.stat_reviews'), value: reviews.length },
                   ].map((stat, i) => (
                     <div key={i} className="text-center md:text-left">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-2xl font-black">{stat.value}</p>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full translate-x-16 -translate-y-16 blur-3xl"></div>
            </section>

            {/* Dynamic Content Area */}
            <section className="min-h-[600px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 text-gray-400 gap-4 opacity-50">
                   <Loader2 className="h-10 w-10 animate-spin text-primary" />
                   <p className="font-bold tracking-widest text-[10px] uppercase">{t('mypage.syncing')}</p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-500">
                  {activeTab === 'rentals' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-gray-900 px-2 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        {t('mypage.timeline')}
                      </h3>
                      {subscriptions.length > 0 ? (
                        <div className="space-y-4">
                          {subscriptions.map((sub) => (
                            <div key={sub.id} className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-8">
                              <div className="w-24 h-32 rounded-2xl overflow-hidden bg-gray-100 shadow-sm shrink-0">
                                <img src={sub.artwork.image_url} alt={sub.artwork.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 w-full text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                   <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-full">Active</span>
                                   <span className="text-[10px] font-bold text-gray-400">{new Date(sub.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h4 className="text-xl font-black text-gray-900">{sub.artwork.title}</h4>
                                <p className="text-sm text-gray-400 font-bold italic">{sub.artwork.artist}</p>
                              </div>
                              <div className="w-full md:w-auto pt-6 md:pt-0 md:pl-8 border-t md:border-t-0 md:border-l border-gray-50 flex flex-col items-center md:items-end">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">{t('mypage.next_payment')}</p>
                                <p className="text-lg font-black text-gray-900">{new Date(sub.nextPaymentDate).toLocaleDateString()}</p>
                                <p className="text-sm font-bold text-primary mt-1">₩{sub.amount?.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState message={t('mypage.empty_rentals')} link="/explore" />
                      )}
                    </div>
                  )}

                  {activeTab === 'favorites' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.length > 0 ? (
                        favorites.map((fav) => (
                          <ArtworkCard key={fav.id} artwork={fav.artwork} />
                        ))
                      ) : (
                        <div className="col-span-full"><EmptyState message={t('mypage.empty_favorites')} /></div>
                      )}
                    </div>
                  )}

                  {activeTab === 'following' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {following.length > 0 ? (
                        following.map((f) => (
                          <Link 
                            key={f.id} 
                            href={`/artist/${f.following.id}`}
                            className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm hover:shadow-xl transition-all flex items-center gap-6 group"
                          >
                             <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform">
                                <img src={f.following.image || '/icons/user-placeholder.svg'} alt={f.following.name} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1">
                                <h4 className="font-black text-gray-900 text-lg">{f.following.name}</h4>
                                <p className="text-xs text-gray-400 font-medium line-clamp-1">{f.following.bio || 'Artist bio not available.'}</p>
                             </div>
                             <ArrowRight className="h-5 w-5 text-gray-200 group-hover:text-primary transition-colors" />
                          </Link>
                        ))
                      ) : (
                        <div className="col-span-full"><EmptyState message={t('mypage.empty_following')} /></div>
                      )}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                       {reviews.length > 0 ? (
                         reviews.map((review) => (
                           <div key={review.id} className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm">
                              <div className="flex items-center gap-4 mb-4">
                                 <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100">
                                    <img src={review.artwork.image_url} alt={review.artwork.title} className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                    <p className="text-xs font-black text-gray-900">{review.artwork.title}</p>
                                    <div className="flex gap-0.5 mt-0.5">
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-primary fill-primary' : 'text-gray-200'}`} />
                                      ))}
                                    </div>
                                 </div>
                                 <span className="ml-auto text-[10px] font-bold text-gray-300">{new Date(review.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm font-medium text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                           </div>
                         ))
                       ) : (
                         <EmptyState message={t('mypage.empty_reviews')} />
                       )}
                    </div>
                  )}

                  {activeTab === 'b2b' && (
                    <div className="space-y-6">
                       {b2bInquiries.length > 0 ? (
                         b2bInquiries.map((inq) => (
                           <div key={inq.id} className="bg-white rounded-3xl p-8 border border-gray-50 shadow-sm group">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                 <div>
                                    <div className="flex items-center gap-2 mb-2">
                                       <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${
                                         inq.status === 'pending' ? 'bg-orange-50 text-orange-500' :
                                         inq.status === 'contacted' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                                       }`}>
                                          {inq.status}
                                       </span>
                                       <span className="text-[10px] font-bold text-gray-400">ID: {inq.id.substring(0, 8)}</span>
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900">{inq.companyName}</h4>
                                    <p className="text-sm text-gray-400 font-medium">Manager: {inq.managerName}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Inquiry Date</p>
                                    <p className="text-sm font-black text-gray-900">{new Date(inq.createdAt).toLocaleDateString()}</p>
                                 </div>
                              </div>
                              <div className="mt-6 pt-6 border-t border-gray-50 bg-gray-50/50 rounded-2xl p-6">
                                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Request Message</p>
                                 <p className="text-sm font-medium text-gray-600 leading-relaxed italic">{inq.message || 'No specific requests.'}</p>
                              </div>
                           </div>
                         ))
                       ) : (
                         <EmptyState message={t('mypage.empty_b2b')} link="/b2b" />
                       )}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

const ArtworkCard = ({ artwork }: { artwork: any }) => {
  const { t } = useLanguage();
  return (
    <Link 
      href={`/artwork/${artwork.id}`}
      className="group bg-white rounded-[2rem] p-4 border border-gray-50 shadow-sm hover:shadow-xl transition-all"
    >
      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4">
        <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="px-2 pb-2">
        <h4 className="font-black text-gray-900 mb-1 truncate">{artwork.title}</h4>
        <p className="text-xs text-gray-400 font-bold mb-3">{artwork.artist}</p>
        <p className="text-[10px] font-black uppercase text-primary">₩{artwork.priceRental?.toLocaleString()} / mo</p>
      </div>
    </Link>
  );
};

const EmptyState = ({ message, link }: { message: string, link?: string }) => (
  <div className="bg-white rounded-[3rem] p-24 border border-gray-50 shadow-sm text-center">
    <p className="text-gray-300 font-bold italic mb-6">{message}</p>
    {link && (
      <Link href={link} className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-primary transition-all">
        Explore ArtWork <ArrowRight className="h-4 w-4" />
      </Link>
    )}
  </div>
);

export default MyPage;
