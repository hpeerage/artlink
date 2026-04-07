'use client';

import React, { useState } from 'react';
import BillingKeyForm from '@/components/payment/BillingKeyForm';
import { CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PaymentTestPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [billingKey, setBillingKey] = useState<string | null>(null);

  const handleSuccess = (key: string) => {
    setBillingKey(key);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-500 rounded-full mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">렌탈 신청 완료!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            빌링키가 정상적으로 발급되어 정기 렌탈 서비스가 시작되었습니다.<br />
            첫 달 렌탈료는 영업일 기준 1-2일 내에 결제됩니다.
          </p>
          <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-left border border-gray-100">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">발급된 빌링키(ID)</p>
            <p className="font-mono text-sm text-primary break-all">{billingKey}</p>
          </div>
          <Link
            href="/"
            className="block w-full bg-primary text-white py-4 rounded-2xl font-bold transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 text-primary font-bold mb-4">
            <ShieldCheck className="h-5 w-5" />
            <span>SECURE PAYMENT TEST</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PortOne V2 정기 결제 테스트</h1>
          <p className="text-gray-600">
            카드 정보 등록 후 빌링키가 정상적으로 발급되는지 시뮬레이션합니다.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-12 items-start justify-center">
          {/* 결제 폼 */}
          <section className="w-full md:w-1/2">
            <BillingKeyForm 
              artworkTitle="정선 아리아 블루 (Original #08)"
              monthlyAmount={35000}
              onSuccess={handleSuccess}
            />
          </section>

          {/* 테스트 사양 설명 */}
          <aside className="w-full md:w-1/3 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm self-stretch">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
              테스트 프로세스
            </h3>
            <ul className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'SDK 호출',
                  desc: '포트원 V2 브라우저 SDK를 호출하여 결제창을 띄웁니다.'
                },
                {
                  step: '02',
                  title: '빌링키 발급',
                  desc: '카드사로부터 암호화된 토큰(Billing Key)을 전달받습니다.'
                },
                {
                  step: '03',
                  title: '서버 등록',
                  desc: '발급받은 키를 서버 API를 통해 저장하고 자동 결제 스케줄을 등록합니다.'
                }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-xl font-black text-gray-100">{item.step}</span>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-10 pt-6 border-t border-gray-50">
              <Link href="/test/ar" className="text-sm text-gray-400 flex items-center gap-2 hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                AR 체험 테스트로 돌아가기
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PaymentTestPage;
