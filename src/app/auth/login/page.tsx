'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from '@/lib/i18n/LanguageContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl,
      });

      if (result?.error) {
        setError(t('auth.error_invalid'));
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(t('auth.error_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex font-sans">
      {/* Left Decoration - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-901 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/10 opacity-50"></div>
        <div className="relative z-10 p-24 text-right">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
            Welcome Back to ArtLink
            <Sparkles className="h-3 w-3 animate-pulse" />
          </div>
          <h1 className="text-6xl font-black text-white leading-tight tracking-tighter mb-8 whitespace-pre-line">
            {t('auth.login_title')} <br />
            <span className="text-primary italic">{t('auth.login_subtitle')}</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md ml-auto font-medium">
            {t('auth.login_desc')}
          </p>
        </div>
        {/* Animated Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-950">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-black uppercase tracking-widest">Explore Art</span>
          </Link>

          <div className="mb-12">
            <img src="/logo.svg" alt="ArtLink Logo" className="h-10 w-auto mb-8" />
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Welcome Back</h2>
            <p className="text-gray-500 font-bold tracking-tight">ArtLink Login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder={t('auth.email')}
                  required
                  className="w-full bg-gray-901 border border-gray-800 text-white pl-14 pr-6 py-5 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder={t('auth.password')}
                  required
                  className="w-full bg-gray-901 border border-gray-800 text-white pl-14 pr-6 py-5 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-[#00B8A6] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:shadow-[0_20px_50px_rgba(0,207,187,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
            >
              {isLoading ? t('common.loading') : t('auth.login_now')}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-bold text-sm">
            {t('auth.no_account')}{' '}
            <Link href="/auth/register" className="text-primary hover:underline underline-offset-4">
              {t('auth.register_now')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
