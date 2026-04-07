'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User, Sparkles, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/artlink/api/auth/register', { // Added basePath /artlink
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || '회원가입 실패');
      }

      router.push('/auth/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex font-sans">
      {/* Left Decoration - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-901 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/10 opacity-50"></div>
        <div className="relative z-10 p-24">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Join the link to art
          </div>
          <h1 className="text-6xl font-black text-white leading-tight tracking-tighter mb-8">
            예술을 사랑하는 <br />
            <span className="text-primary italic">당신의 첫 걸음</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md font-medium">
            ArtLink 계정을 생성하고, 당신의 공간에 어울리는 최상의 작품들을 AR로 경험해 보세요.
          </p>
        </div>
        {/* Animated Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-950">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-black uppercase tracking-widest">Back to store</span>
          </Link>

          <div className="mb-12">
            <img src="/artlink/logo.svg" alt="ArtLink Logo" className="h-10 w-auto mb-8" />
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Create Account</h2>
            <p className="text-gray-500 font-bold tracking-tight">아트링크의 새로운 회원이 되어보세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="이름"
                  required
                  className="w-full bg-gray-901 border border-gray-800 text-white pl-14 pr-6 py-5 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="이메일 주소"
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
                  placeholder="비밀번호"
                  required
                  className="w-full bg-gray-901 border border-gray-800 text-white pl-14 pr-6 py-5 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  required
                  className="w-full bg-gray-901 border border-gray-800 text-white pl-14 pr-6 py-5 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              {isLoading ? 'Processing...' : 'Create Account'}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-bold text-sm">
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" className="text-primary hover:underline underline-offset-4">
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
