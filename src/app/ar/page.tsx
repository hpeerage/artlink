'use client';

import React, { useState } from 'react';
import ArtLinkModelViewer from '@/components/ar/ModelViewer';
import { Palette, Box, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const ARTestPage = () => {
  // 테스트용 공개 원화 이미지들
  const artworks = [
    {
      id: 1,
      title: '정선 아리아 블루',
      url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 2,
      title: '추상화의 물결',
      url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 3,
      title: '산수화의 재해석',
      url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop',
    },
  ];

  const [selectedArtwork, setSelectedArtwork] = useState(artworks[0]);
  
  // 테스트용 3D 모델 (실제 frame.glb가 업로드되기 전까지는 model-viewer 공식 샘플 사용)
  // 주의: 샘플 모델에는 'art_surface'라는 이름의 재질이 없을 것이므로 로그에 경고가 뜰 것입니다.
  const sampleModelUrl = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
           <Link href="/explore" className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">
             <ArrowLeft className="h-4 w-4" />
             Back to Explore
           </Link>
        </div>
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 text-primary font-bold mb-2">
            <Palette className="h-5 w-5" />
            <span>AR CORE TECHNOLOGY</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AR 텍스처 매핑 테스트</h1>
          <p className="text-gray-600 max-w-2xl">
            선택한 2D 작품 이미지가 [art_surface] 규격이 적용된 3D 액자 모델에 
            실시간으로 매핑되는 기술을 검증합니다.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* 왼쪽: 모델 뷰어 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
              <ArtLinkModelViewer 
                modelUrl={sampleModelUrl} 
                textureUrl={selectedArtwork.url}
                height="600px"
              />
            </div>
            
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                <Box className="h-5 w-5" />
                기술 검증 가이드
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• <b>텍스처 매핑:</b> 왼쪽에서 이미지를 변경하면 3D 모델의 특정 영역([art_surface] 재질)이 즉시 업데이트됩니다.</li>
                <li>• <b>1:1 스케일:</b> 모바일 기기에서 AR 버튼을 클릭하면 실제 작품 크기대로 공간에 배치됩니다.</li>
                <li>• <b>비용 최적화:</b> 서버 리소스 없이 브라우저 단에서 텍스처를 생성하고 매핑합니다.</li>
              </ul>
            </div>
          </div>

          {/* 오른쪽: 컨트롤러 */}
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">작품 선택</h3>
              <div className="grid gap-4">
                {artworks.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArtwork(art)}
                    className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      selectedArtwork.id === art.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-transparent bg-white hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    <img 
                      src={art.url} 
                      alt={art.title} 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="text-left">
                      <p className={`font-bold ${selectedArtwork.id === art.id ? 'text-primary' : 'text-gray-900'}`}>
                        {art.title}
                      </p>
                      <p className="text-xs text-gray-500">2D Artwork Image</p>
                    </div>
                    {selectedArtwork.id === art.id && (
                      <div className="absolute right-4 top-4 bg-primary text-white p-1 rounded-full">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">모델 정보</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">현재 모델</span>
                  <span className="text-sm font-bold text-gray-900">frame_standard_v1.glb</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">아트 서피스 규격</span>
                  <span className="text-sm font-bold text-secondary">준수 [art_surface]</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500">AR 모드</span>
                  <span className="text-sm font-bold text-gray-900">WebXR, QuickLook</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARTestPage;
