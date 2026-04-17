'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(data.error || '회원가입에 실패했습니다.');
      }
    } catch (err: any) {
      setError('서버와의 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
        <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-[2rem] border border-primary/20 flex items-center justify-center mx-auto shadow-2xl shadow-primary/20">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tighter">회원가입 완료!</h1>
            <p className="text-gray-400 font-bold">잠시 후 로그인 페이지로 이동합니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex font-sans">
      {/* Left Decoration - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-901 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/10 opacity-50"></div>
        <div className="relative z-10 p-24 text-right">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
            Join ArtLink Artist Community
            <Sparkles className="h-3 w-3 animate-pulse" />
          </div>
          <h1 className="text-6xl font-black text-white leading-tight tracking-tighter mb-8">
            당신의 예술을 <br />
            <span className="text-primary italic">세상과 연결하세요</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md ml-auto font-medium">
            ArtLink는 작가님의 작품을 1:1 리얼 스케일 AR로 구현하여 최상의 가치를 전달합니다. 지금 작가로 등록하고 새로운 가능성을 만나보세요.
          </p>
        </div>
        {/* Animated Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-950">
        <div className="w-full max-w-md">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Login</span>
          </Link>

          <div className="mb-12">
            <img src="/logo.svg" alt="ArtLink Logo" className="h-10 w-auto mb-8" />
            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Create Account</h2>
            <p className="text-gray-500 font-bold tracking-tight">ArtLink 작가 계정을 생성합니다.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="작가명 / 실명"
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
              {isLoading ? 'Creating Account...' : 'Register Now'}
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
