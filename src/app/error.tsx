'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('ArtLink Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white">

      <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8">
           <AlertTriangle className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">예상치 못한 오류가 발생했습니다.</h1>
        <p className="text-gray-400 font-medium max-w-md leading-relaxed mb-10">
          서비스 이용에 불편을 드려 죄송합니다. 기술 팀에 오류 보고가 완료되었으며, 아래 버튼을 통해 재시도하거나 홈으로 이동하실 수 있습니다.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
           <button 
             onClick={() => reset()}
             className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-200"
           >
              <RotateCcw className="h-4 w-4" /> Try Again
           </button>
           <Link 
             href="/"
             className="flex items-center gap-2 bg-gray-100 text-gray-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
           >
              <Home className="h-4 w-4" /> Go Home
           </Link>
        </div>
      </div>
    </div>
  );
}
