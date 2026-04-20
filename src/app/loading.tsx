'use client';

import React from 'react';
import Header from '@/components/common/Header';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-col items-center justify-center py-40 gap-6 opacity-30">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">
          Optimizing your Art Experience...
        </p>
      </div>
    </div>
  );
}
