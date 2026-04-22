'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Box, CreditCard, Layers, Smartphone, Sparkles, CheckCircle2 } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import RecommendationsSection from '@/components/home/RecommendationsSection';

export default function Home() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [featuredArtworks, setFeaturedArtworks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch('/api/artworks');
        if (response.ok) {
          const data = await response.json();
          setFeaturedArtworks(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch artworks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      <main>
        {/* Modern Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden px-8 py-20">
          <div className="container mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                <Sparkles className="h-3 w-3 animate-pulse" />
                {t('hero.badge')}
              </div>
              <h1 className="mb-8 text-6xl md:text-8xl font-black leading-[1.05] tracking-tighter text-gray-900 whitespace-pre-line">
                {t('hero.title')}
              </h1>
              <p className="mb-12 max-w-lg text-lg leading-relaxed text-gray-500 font-medium whitespace-pre-line">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-5">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-3 rounded-[2rem] bg-gray-900 px-10 py-5 text-lg font-black text-white transition-all hover:bg-primary hover:shadow-[0_20px_50px_rgba(0,207,187,0.3)] hover:-translate-y-1 shadow-xl shadow-gray-200"
                >
                  {t('hero.btn_explore')}
                  <ArrowRight className="h-6 w-6" />
                </Link>
                <Link
                  href="/ar"
                  className="inline-flex items-center gap-3 rounded-[2rem] bg-gray-50 border border-gray-100 px-10 py-5 text-lg font-black text-gray-900 transition-all hover:bg-white hover:border-primary/30"
                >
                  {t('hero.btn_ar')}
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl scale-105 rotate-2 transition-transform hover:rotate-0 duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1544161515-41e734149581?q=80&w=1200&auto=format&fit=crop" 
                  alt="Gallery Hero"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-10 left-10 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.3em] mb-2 opacity-80">Featured Artist</p>
                  <h3 className="text-3xl font-black">정선 아리아 #08</h3>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl opacity-30"></div>
            </div>
          </div>
        </section>

        {/* Personalized Recommendations Section (Phase 5) */}
        <RecommendationsSection />

        {/* Curation Section (Legacy/Fallback) */}
        {!isLoading && featuredArtworks.length > 0 && (
          <section className="py-32 bg-gray-50/50">
            <div className="container mx-auto px-8">
              <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                <div className="max-w-2xl">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-5">Featured Collection</h2>
                  <h3 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
                    Elevating Space Value <br />
                    <span className="italic text-gray-400 font-medium">Curated Original Collection</span>
                  </h3>
                </div>
                <Link href="/explore" className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-2 transition-all hover:text-primary hover:border-primary">
                  View All Collection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                {featuredArtworks.map((art) => (
                  <Link key={art.id} href={`/artwork/${art.id}`} className="group block">
                    <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-8 shadow-sm transition-all group-hover:shadow-2xl group-hover:-translate-y-3 duration-500">
                      <img 
                        src={art.imageUrl} 
                        alt={art.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                      <div className="absolute bottom-8 left-8 right-8">
                         <span className="inline-block px-4 py-1.5 bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-widest text-gray-900 rounded-full mb-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                          {art.category}
                         </span>
                      </div>
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 mb-1">{art.title}</h4>
                    <p className="text-gray-400 font-bold italic">{art.artist}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Technology Features */}
        <section className="py-32 px-8">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Smartphone, title: 'WebAR Experience', color: 'text-primary' },
                    { icon: Box, title: '1:1 Real Scale', color: 'text-blue-500' },
                    { icon: Layers, title: 'Chat Consultation', color: 'text-orange-500' },
                    { icon: CreditCard, title: 'Safe Payment', color: 'text-blue-900' },
                  ].map((feat, i) => (
                    <div key={i} className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex flex-col items-center text-center transition-all hover:bg-white hover:shadow-xl hover:scale-105 duration-300">
                      <feat.icon className={`h-10 w-10 mb-6 ${feat.color}`} />
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Feature {i+1}</p>
                      <h4 className="font-bold text-gray-900">{feat.title}</h4>
                    </div>
                  ))}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center z-20">
                  <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-5">Our Technology</h2>
                <h3 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight mb-8">
                  Beyond exhibition, <br />
                  <span className="text-primary italic">Immersive Virtual Scalability</span>
                </h3>
                <p className="text-gray-500 text-lg leading-relaxed mb-10 font-medium">
                  ArtLink combines models and textures in real-time on the browser.
                  Instead of expensive server-side rendering, our innovative architecture
                  processes everything on the user's device for a lag-free AR experience.
                </p>
                <div className="space-y-4">
                  {[
                    'Real-time 2D Image to 3D Texture Mapping',
                    'ARCore / ARKit based 1:1 Real Scaling',
                    '1:1 Real-time Chat with Artists',
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="font-bold text-gray-700">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-24 px-8 mt-24">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-20 items-start mb-20">
            <div>
               <div className="text-3xl font-black tracking-tighter mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                ART<span className="text-primary italic">LINK</span>
              </div>
              <p className="text-gray-400 max-w-sm font-medium whitespace-pre-line">
                {t('common.footer_desc')}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 uppercase tracking-widest text-[10px] font-black">
              <div className="space-y-5">
                <p className="text-gray-500">Service</p>
                <p><Link href="/explore">Explore</Link></p>
                <p><Link href="/community">Community</Link></p>
                <p><Link href="/ar">AR Gallery</Link></p>
              </div>
              <div className="space-y-5">
                <p className="text-gray-500">About</p>
                <p>Company</p>
                <p>Technology</p>
                <p>Contact</p>
              </div>
              <div className="space-y-5">
                <p className="text-gray-500">Legal</p>
                <p>Privacy</p>
                <p>Terms</p>
                <p>Copyright</p>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-gray-800 flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            <p>© 2026 ARTLINK INC. {t('common.rights')}</p>
            <div className="flex gap-8">
              <p>Instagram</p>
              <p>Twitter</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
