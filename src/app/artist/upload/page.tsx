'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Info, CheckCircle2, Box, ShieldCheck, Ruler, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const ArtworkUploadPage = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    priceBuy: '',
    priceRental: '',
    width: '',
    height: '',
    category: 'Modern',
    description: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newArtworkId, setNewArtworkId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep(2);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      let finalImageUrl = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5';

      // 1. Cloudinary Signed Upload 진행
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        timestamp,
        folder: 'artlink'
      };

      // 서명 받기
      const signResponse = await fetch('/api/auth/cloudinary-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign }),
      });

      if (!signResponse.ok) throw new Error('Cloudinary 서명을 가져오는데 실패했습니다.');
      const { signature } = await signResponse.json();

      // 실제 업로드
      const formDataUpload = new FormData();
      formDataUpload.append('file', selectedFile);
      formDataUpload.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '');
      formDataUpload.append('timestamp', timestamp.toString());
      formDataUpload.append('signature', signature);
      formDataUpload.append('folder', 'artlink');

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formDataUpload }
      );

      if (!uploadResponse.ok) {
        console.error('Cloudinary upload error:', await uploadResponse.text());
        alert('이미지 업로드에 실패했습니다. 환경 변수 설정을 확인해 주세요.');
      } else {
        const uploadData = await uploadResponse.json();
        // AR 뷰어 및 비용 최적화를 위한 변환 옵션 추가 (w_1024, f_webp, q_auto)
        const baseUrl = uploadData.secure_url;
        finalImageUrl = baseUrl.replace('/upload/', '/upload/w_1024,f_webp,q_auto/');
      }

      // 2. API를 호출하여 데이터베이스에 메타데이터 저장
      const response = await fetch('/api/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          artist: formData.artist,
          description: formData.description,
          category: formData.category,
          price_buy: parseFloat(formData.priceBuy) || 0,
          price_rental: parseFloat(formData.priceRental) || 0,
          width_mm: parseInt(formData.width) || 0,
          height_mm: parseInt(formData.height) || 0,
          image_url: finalImageUrl,
          model_url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // 기본 모델
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save artwork metadata');
      }

      const dbData = await response.json();
      if (dbData && dbData.id) {
        setNewArtworkId(dbData.id);
      }

      setStep(3);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('업로드 중 오류가 발생했습니다. 로컬 DB 서버 상태를 확인해 주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-50 px-8 py-5">
        <div className="container mx-auto flex justify-between items-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 font-bold hover:text-black transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>{t('auth.back_to_store')}</span>
          </button>
          <div className="flex gap-4">
             <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
               {[1, 2, 3].map((s) => (
                 <div key={s} className={`h-2 w-8 rounded-full transition-all ${step >= s ? 'bg-primary' : 'bg-gray-200'}`}></div>
               ))}
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {step === 1 && (
          <div className="space-y-12 animate-in slide-in-from-bottom-5 duration-500">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-4">{t('artist.upload_title')}</h1>
              <p className="text-gray-500 font-medium italic">{t('artist.upload_subtitle')}</p>
            </div>

            <div className="border-4 border-dashed border-gray-100 rounded-[3rem] p-24 flex flex-col items-center text-center transition-all hover:bg-gray-50/50 hover:border-primary/20 group relative overflow-hidden">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-8 border border-primary/10 group-hover:scale-110 transition-transform">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">{t('artist.image_upload')} (PNG, JPG)</h2>
              <p className="text-gray-400 mb-8 max-w-sm">{t('artist.image_upload_guide')}</p>
              <div className="bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black shadow-xl shadow-gray-200 group-hover:bg-primary transition-all">
                {t('common.all')}
              </div>
            </div>
            
            <div className="bg-orange-50/50 border border-orange-100 p-8 rounded-3xl flex gap-5">
              <Info className="h-6 w-6 text-orange-400 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-orange-900 mb-1">{t('artist.optimization_guide')}</h4>
                <p className="text-sm text-orange-700 leading-relaxed">
                  {t('artist.optimization_guide_desc')}
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleFinish} className="space-y-12 animate-in slide-in-from-right-5 duration-500">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-4">{t('artist.upload_title')}</h1>
              <p className="text-gray-500 font-medium italic">{t('artist.upload_subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('artist.artwork_title')}</label>
                  <input name="title" value={formData.title} onChange={handleChange} required placeholder={t('artist.artwork_title')} className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('auth.name')}</label>
                  <input name="artist" value={formData.artist} onChange={handleChange} required placeholder={t('auth.name')} className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t('artist.price_buy')}</label>
                    <input name="priceBuy" value={formData.priceBuy} onChange={handleChange} required placeholder="0" className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">{t('artist.price_rental')}</label>
                    <input name="priceRental" value={formData.priceRental} onChange={handleChange} required placeholder="0" className="w-full bg-gray-50 border border-primary/20 p-5 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 shadow-sm space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <Ruler className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-black text-primary tracking-tighter">{t('artist.dimensions')}</h3>
                </div>
                <p className="text-primary/60 text-xs font-bold leading-relaxed mb-6">
                  {t('artist.dimensions_guide')}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{t('artist.width')} (mm)</label>
                    <input name="width" value={formData.width} onChange={handleChange} required placeholder={t('artist.width')} className="w-full bg-white border border-primary/10 p-5 rounded-2xl focus:ring-2 focus:ring-primary/40 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{t('artist.height')} (mm)</label>
                    <input name="height" value={formData.height} onChange={handleChange} required placeholder={t('artist.height')} className="w-full bg-white border border-primary/10 p-5 rounded-2xl focus:ring-2 focus:ring-primary/40 outline-none transition-all" />
                  </div>
                </div>
                
                <div className="p-5 bg-white/60 rounded-2xl border border-primary/5">
                  <div className="flex items-center justify-between text-xs font-bold text-primary/80">
                     <span>Estimated Ratio</span>
                     <span>{formData.width && formData.height ? (parseFloat(formData.width) / parseFloat(formData.height)).toFixed(2) : '0.00'} : 1</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-gray-50 flex justify-between items-center">
              <button onClick={() => setStep(1)} className="text-gray-400 font-black tracking-widest uppercase text-xs hover:text-black transition-colors">Go Back</button>
              <button 
                disabled={isUploading}
                className="bg-primary text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl shadow-primary/30 flex items-center gap-3 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    {t('artist.submit')}
                    <CheckCircle2 className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-10 animate-in zoom-in-95 duration-500">
            <div className="w-32 h-32 bg-green-50 text-green-500 rounded-[2.5rem] border border-green-100 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100">
               <CheckCircle2 className="h-16 w-16" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-gray-900 mb-4 leading-tight">{t('artist.upload_success')}</h1>
              <p className="text-gray-400 font-bold max-w-lg mx-auto">
                {t('artist.upload_success_desc')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-10">
              <Link href="/artist" className="flex flex-col items-center gap-4 p-8 rounded-[2.5rem] border border-gray-100 hover:bg-gray-50 transition-all group">
                <Box className="h-8 w-8 text-gray-400 group-hover:text-primary transition-colors" />
                <span className="font-black text-gray-900">{t('artist.go_to_dashboard')}</span>
              </Link>
              <Link href={newArtworkId ? `/artwork/${newArtworkId}` : '/explore'} className="flex flex-col items-center gap-4 p-8 rounded-[2.5rem] bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                <ShieldCheck className="h-8 w-8" />
                <span className="font-black">{t('artist.view_published')}</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArtworkUploadPage;
