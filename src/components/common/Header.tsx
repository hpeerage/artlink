'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Image from 'next/image';
import NotificationHub from './NotificationHub';

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const isArtist = (session?.user as any)?.role === 'artist' || (session?.user as any)?.role === 'admin';
  const isAdmin = (session?.user as any)?.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-28 h-8 group-hover:scale-105 transition-all duration-300">
             <Image 
               src="/artlink_logo.svg"
               alt="ArtLink"
               fill
               className="object-contain"
               priority
             />
          </div>
        </Link>
        <div className="hidden md:flex gap-8 font-bold text-[10px] text-gray-400 uppercase tracking-[0.2em]">
          <Link 
            href="/explore" 
            className={`hover:text-primary transition-colors ${pathname === '/explore' ? 'text-primary' : ''}`}
          >
            {t('common.explore')}
          </Link>
          <Link 
            href="/community" 
            className={`hover:text-primary transition-colors ${pathname === '/community' ? 'text-primary' : ''}`}
          >
            {t('common.community')}
          </Link>
          <Link 
            href="/ar" 
            className={`hover:text-primary transition-colors ${pathname === '/ar' ? 'text-primary' : ''}`}
          >
            AR Gallery
          </Link>
          <Link 
            href="/b2b" 
            className={`hover:text-primary transition-colors flex items-center gap-1 ${pathname === '/b2b' ? 'text-primary' : ''}`}
          >
             <span className="w-1 h-1 bg-primary rounded-full animate-pulse"></span>
             {t('common.b2b')}
          </Link>
          {status === 'authenticated' && (
            <Link 
              href="/my" 
              className={`hover:text-primary transition-colors ${pathname === '/my' ? 'text-primary' : ''}`}
            >
              {t('common.mypage')}
            </Link>
          )}
          {isArtist && (
            <Link 
              href="/artist/dashboard" 
              className={`hover:text-primary transition-colors ${pathname.startsWith('/artist') ? 'text-primary' : ''}`}
            >
              Console
            </Link>
          )}
          {isAdmin && (
            <Link 
              href="/admin/dashboard" 
              className={`hover:text-primary transition-colors ${pathname.startsWith('/admin') ? 'text-primary' : ''}`}
            >
              Admin
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          {/* Language Switcher */}
          <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
             <button 
               onClick={() => setLanguage('ko')}
               className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'ko' ? 'bg-white text-primary shadow-sm' : 'text-gray-300 hover:text-gray-500'}`}
             >
               KO
             </button>
             <button 
               onClick={() => setLanguage('en')}
               className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'en' ? 'bg-white text-primary shadow-sm' : 'text-gray-300 hover:text-gray-500'}`}
             >
               EN
             </button>
          </div>

          <div className="flex items-center gap-4">
            {status === 'authenticated' && <NotificationHub />}
            
            {status === 'authenticated' ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">Verified User</p>
                  <p className="text-[11px] font-bold text-gray-900">{session?.user?.name}</p>
                </div>
                <button 
                  onClick={async () => {
                    await signOut({ callbackUrl: "/", redirect: true });
                  }}
                  className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                >
                  {t('common.logout')}
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="bg-gray-900 text-white px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-primary transition-all active:scale-95"
              >
                {t('common.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
