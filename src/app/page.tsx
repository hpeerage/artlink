'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Box, CreditCard, Layers, Smartphone, Sparkles, CheckCircle2, User, LogOut } from "lucide-react";
import { MOCK_ARTWORKS } from '@/lib/mock-data';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const [featuredArtworks, setFeaturedArtworks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-50 px-8 py-5">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.svg" alt="ArtLink Logo" className="h-10 w-auto transition-transform group-hover:scale-105" />
          </Link>
          <div className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
            <Link href="/explore" className="text-gray-900 hover:text-primary transition-colors">Explore</Link>
            <Link href="/ar" className="hover:text-primary transition-colors">AR Gallery</Link>
            <Link href="/my" className="hover:text-primary transition-colors">My Page</Link>
          </div>
          
          <div className="flex items-center gap-6">
            {status === 'authenticated' ? (
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Authenticated</span>
                  <span className="text-xs font-black text-gray-900">{session?.user?.name || 'Artist'}</span>
                </div>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-gray-100 text-gray-500 p-3 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all border border-gray-200 hover:border-red-100"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="bg-gray-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all hover:shadow-2xl hover:shadow-primary/40 active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Modern Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden px-8">
          <div className="container mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                <Sparkles className="h-3 w-3 animate-pulse" />
                Next Generation Art Platform
              </div>
              <h1 className="mb-8 font-accent text-6xl md:text-8xl font-black leading-[1.05] tracking-tighter text-gray-900">
                예술을 <br />
                <span className="text-primary">일상의 스케일</span>로 <br />
                링크하다.
              </h1>
              <p className="mb-12 max-w-lg text-lg leading-relaxed text-gray-500 font-medium">
                ArtLink는 WebAR 기술을 통해 작품의 감동을 그대로 전달합니다. 
                1:1 실물 크기로 당신의 공간에 작품을 배치하고, 
                합리적인 정기 렌탈로 소유의 부담을 덜어보세요.
              </p>
              <div className="flex flex-wrap gap-5">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-3 rounded-[2rem] bg-primary px-10 py-5 text-lg font-black text-white transition-all hover:bg-[#00B8A6] hover:shadow-[0_20px_50px_rgba(0,207,187,0.3)] hover:-translate-y-1"
                >
                  작품 탐색하기
                  <ArrowRight className="h-6 w-6" />
                </Link>
                <Link
                  href="/ar"
                  className="inline-flex items-center gap-3 rounded-[2rem] bg-gray-50 border border-gray-100 px-10 py-5 text-lg font-black text-gray-900 transition-all hover:bg-white hover:border-primary/30"
                >
                  AR 체험기술 보기
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
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-blob"></div>
              <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </section>

        {/* Curation Section */}
        <section className="py-32 bg-gray-50/50">
          <div className="container mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
              <div className="max-w-2xl">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-5">Curated Collection</h2>
                <h3 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
                  공간의 가치를 높이는 <br />
                  <span className="italic text-gray-400">선별된 원화 컬렉션</span>
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

        {/* Technology Features */}
        <section className="py-32 px-8">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Smartphone, title: 'WebAR Experience', color: 'text-primary' },
                    { icon: Box, title: '1:1 Real Scale', color: 'text-secondary' },
                    { icon: Layers, title: 'Texture Mapping', color: 'text-orange-500' },
                    { icon: CreditCard, title: 'Billkey Payment', color: 'text-blue-900' },
                  ].map((feat, i) => (
                    <div key={i} className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex flex-col items-center text-center transition-all hover:bg-white hover:shadow-xl hover:scale-105 duration-300">
                      <feat.icon className={`h-10 w-10 mb-6 ${feat.color}`} />
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Feature {i+1}</p>
                      <h4 className="font-bold text-gray-900">{feat.title}</h4>
                    </div>
                  ))}
                </div>
                {/* Visual Accent */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center z-20">
                  <Sparkles className="h-10 w-10 text-primary animate-spin-slow" />
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-5">Our Technology</h2>
                <h3 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight mb-8">
                  단순한 전시를 넘어, <br />
                  <span className="text-primary italic">실감나는 가상의 가변성</span>
                </h3>
                <p className="text-gray-500 text-lg leading-relaxed mb-10 font-medium">
                  ArtLink는 모델과 텍스처를 브라우저 단에서 실시간으로 결합합니다. 
                  기존의 비싼 서버 연동 방식이 아닌, 사용자의 기기에서 즉시 처리되는 
                  혁신적인 아키텍처로 딜레이 없는 AR 경험을 제공합니다.
                </p>
                <div className="space-y-4">
                  {[
                    '실시간 2D 이미지 -> 3D 텍스처 매핑 엔진',
                    'ARCore / ARKit 기반 1:1 리얼 스케일링',
                    'PortOne 기반 안전한 정기 결제 암호화',
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-secondary" />
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
              <img src="/logo.svg" alt="ArtLink Logo" className="h-12 w-auto mb-8 opacity-80 hover:opacity-100 transition-opacity" />
              <p className="text-gray-400 max-w-sm font-medium">
                예술과 기술의 결합으로 당신의 공간에 새로운 영감을 링크합니다. 
                가장 쉬운 WebAR 기반 작품 전시 및 렌탈 서비스.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 uppercase tracking-widest text-[10px] font-black">
              <div className="space-y-5">
                <p className="text-gray-500">Service</p>
                <p><Link href="/explore">Explore</Link></p>
                <p>AR Gallery</p>
                <p>Artist Apply</p>
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
            <p>© 2026 ARTLINK INC. ALL RIGHTS RESERVED.</p>
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
