'use client';

import React, { useEffect, useRef, useState } from 'react';

// model-viewer를 동적으로 가져와서 클라이언트 측에서만 로드되도록 합니다.
if (typeof window !== 'undefined') {
  import('@google/model-viewer');
}

interface ArtLinkModelViewerProps {
  modelUrl: string; // 3D 액자 모델 (.glb)
  textureUrl: string; // 매핑할 2D 작품 이미지 (.jpg, .png)
  frameType?: 'wood' | 'white' | 'black'; // 액자 프레임 재질
  onSnapshot?: (dataUrl: string) => void; // 스냅샷 캡처 콜백
  alt?: string;
  width?: string;
  height?: string;
}

const ArtLinkModelViewer: React.FC<ArtLinkModelViewerProps> = ({
  modelUrl,
  textureUrl,
  frameType = 'wood',
  onSnapshot,
  alt = 'ArtLink 3D Frame View',
  width = '100%',
  height = '500px',
}) => {
  const viewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleProgress = (event: any) => {
      setProgress(Math.floor(event.detail.totalProgress * 100));
    };

    const applyTexture = async () => {
      try {
        // 모델이 완전히 로드될 때까지 기다림
        if (!viewer.model) {
          viewer.addEventListener('load', applyTexture, { once: true });
          return;
        }

        // 'art_surface' 재질 찾기
        const material = viewer.model.materials.find(
          (m: any) => m.name === 'art_surface'
        );

        if (material) {
          console.log('art_surface material found. Applying texture:', textureUrl);
          // 새로운 텍스처 생성 및 적용
          const texture = await viewer.createTexture(textureUrl);
          
          if (material.pbrMetallicRoughness.baseColorTexture) {
            material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
          } else {
            // baseColorTexture가 없는 경우 설정 (재질 설정에 따라 다를 수 있음)
            material.pbrMetallicRoughness.setBaseColorTexture(texture);
          }
        } else {
          console.warn('Material named "art_surface" not found in the model.');
          // 유틸리티: 모든 재질 목록 출력 (디버깅용)
          console.log('Available materials:', viewer.model.materials.map((m: any) => m.name));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to apply texture:', error);
        setIsLoading(false);
      }
    };

    const applyFrameMaterial = () => {
      const viewer = viewerRef.current;
      if (!viewer || !viewer.model) return;

      // 'frame_surface' 또는 유사한 이름의 프레임 재질 찾기
      const frameMaterial = viewer.model.materials.find(
        (m: any) => m.name.toLowerCase().includes('frame') || m.name === 'body'
      );

      if (frameMaterial) {
        console.log('Frame material found. Applying high-fidelity params:', frameType);
        const pbr = frameMaterial.pbrMetallicRoughness;
        
        switch (frameType) {
          case 'wood':
            // 매트한 나무 질감
            pbr.setBaseColorFactor([0.62, 0.45, 0.32, 1.0]); 
            pbr.setRoughnessFactor(0.85);
            pbr.setMetallicFactor(0.05);
            break;
          case 'white':
            // 부드러운 화이트 광택
            pbr.setBaseColorFactor([0.98, 0.98, 0.98, 1.0]);
            pbr.setRoughnessFactor(0.4);
            pbr.setMetallicFactor(0.1);
            break;
          case 'black':
            // 세련된 블랙 반사광
            pbr.setBaseColorFactor([0.05, 0.05, 0.05, 1.0]);
            pbr.setRoughnessFactor(0.3);
            pbr.setMetallicFactor(0.2);
            break;
        }
      }
    };

    viewer.addEventListener('progress', handleProgress);
    viewer.addEventListener('load', () => {
      applyTexture();
      applyFrameMaterial();
    });
    
    // frameType 변경 시 즉시 적용
    if (viewer.model) {
      applyFrameMaterial();
    }
    
    return () => {
      viewer.removeEventListener('load', applyTexture);
      viewer.removeEventListener('progress', handleProgress);
    };
  }, [textureUrl, frameType]);

  return (
    <div style={{ width, height, position: 'relative' }} className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-inner">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 backdrop-blur-md z-10">
          <div className="w-48 space-y-4">
             <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] font-black tracking-widest text-primary uppercase">Loading Asset</span>
                <span className="text-[10px] font-black text-gray-400">{progress}%</span>
             </div>
             <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
             </div>
             <p className="text-center text-[9px] font-bold text-gray-300 italic">Optimizing 3D Real-scale Experience...</p>
          </div>
        </div>
      )}
      <model-viewer
        ref={viewerRef}
        src={modelUrl}
        alt={alt}
        ar
        ar-modes="scene-viewer quick-look webxr"
        ar-scale="fixed"
        camera-controls
        touch-action="pan-y"
        shadow-intensity="1.5"
        shadow-softness="0.5"
        exposure="1.2"
        environment-image="neutral"
        auto-rotate
        rotation-per-second="30deg"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-primary text-white px-8 py-4 rounded-[2rem] font-black shadow-2xl flex flex-col items-center gap-1 hover:bg-blue-700 transition-all active:scale-95"
        >
          <span className="text-xs opacity-80 uppercase tracking-widest">AR EXPERIENCE</span>
          <span className="text-lg">내 공간에 1:1로 배치하기</span>
        </button>
        <button
          onClick={() => {
            const dataUrl = viewerRef.current?.toDataURL();
            if (dataUrl && onSnapshot) onSnapshot(dataUrl);
          }}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
          title="AR 스냅샷 촬영"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <div slot="ar-failure" className="absolute inset-0 flex items-center justify-center bg-black/60 text-white p-10 text-center">
          <p className="font-bold">이 기기는 AR 기능을 지원하지 않거나 설정이 필요합니다.</p>
        </div>
      </model-viewer>
    </div>
  );
};

export default ArtLinkModelViewer;
