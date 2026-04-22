'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Loading() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="animate-in fade-in zoom-in duration-700 flex flex-col items-center gap-12">
        <div className="relative">
          <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex items-center justify-center animate-pulse">
            <img src="/logo.svg" alt="ArtLink" className="h-12 w-auto" />
          </div>
          <div className="absolute inset-0 border-2 border-primary/20 rounded-[2.5rem] animate-ping opacity-20"></div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary opacity-50" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">
            {t('recommendations.loading')}
          </p>
        </div>
      </div>
    </div>
  );
}
