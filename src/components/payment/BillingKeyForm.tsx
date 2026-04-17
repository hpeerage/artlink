'use client';

import React, { useState } from 'react';
import * as PortOne from '@portone/browser-sdk/v2';
import { CreditCard, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { PORTONE_STORE_ID, PORTONE_CHANNEL_KEY } from '@/lib/portone';
import { useSession } from 'next-auth/react';

interface BillingKeyFormProps {
  artworkId: string;
  artworkTitle: string;
  monthlyAmount: number;
  onSuccess?: (billingKey: string) => void;
  onFail?: (error: string) => void;
}

const BillingKeyForm: React.FC<BillingKeyFormProps> = ({
  artworkId,
  artworkTitle,
  monthlyAmount,
  onSuccess,
  onFail,
}) => {
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIssueBillingKey = async () => {
    if (status !== 'authenticated' || !session?.user) {
      setError('로그인이 필요한 서비스입니다.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. 빌링키 발급 요청 (고객 식별자 customerId 사용)
      const customerId = (session.user as any).id || session.user.email;
      
      const response = await PortOne.requestIssueBillingKey({
        storeId: PORTONE_STORE_ID,
        channelKey: PORTONE_CHANNEL_KEY,
        billingKeyMethod: 'CARD', 
        issueName: `ArtLink 정기 렌탈: ${artworkTitle}`,
        customer: {
          customerId: String(customerId),
          fullName: session.user.name || '',
          email: session.user.email || '',
        },
      });

      if (response?.code != null) {
        // 발급 실패
        const errorMsg = response.message || '빌링키 발급에 실패했습니다.';
        setError(errorMsg);
        onFail?.(errorMsg);
        return;
      }

      // 2. 발급 성공 시 서버로 전달하여 저장
      if (response?.billingKey) {
        console.log('Billing key issued successfully:', response.billingKey);
        
        const saveRes = await fetch('/api/payment/billing-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            billingKey: response.billingKey,
            customerId: customerId,
            artworkId: artworkId,
            amount: monthlyAmount,
          }),
        });

        if (saveRes.ok) {
          onSuccess?.(response.billingKey);
        } else {
          const errorData = await saveRes.json();
          setError(errorData.error || '서버 저장 중 오류가 발생했습니다.');
        }
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || '결제 시스템 연결 중 오류가 발생했습니다.');
      onFail?.(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <CreditCard className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">정기 렌탈 신청</h2>
          <p className="text-sm text-gray-500 italic">Billkey Subscription</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between py-3 border-b border-gray-50">
          <span className="text-gray-500">신청 작품</span>
          <span className="font-bold text-gray-900">{artworkTitle}</span>
        </div>
        <div className="flex justify-between py-3 border-b border-gray-50">
          <span className="text-gray-500">월 렌탈료</span>
          <span className="font-bold text-primary text-xl">
            ₩{monthlyAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-gray-500">결제 방식</span>
          <span className="text-sm font-medium text-gray-700">매월 자동 결제 (빌링키)</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        onClick={handleIssueBillingKey}
        disabled={isProcessing}
        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:bg-black hover:shadow-lg disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>처리 중...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="h-5 w-5" />
            <span>카드 등록 및 렌탈 시작</span>
          </>
        )}
      </button>

      <p className="mt-6 text-center text-xs text-gray-400 leading-relaxed">
        카드 정보는 포트원(PortOne)을 통해 안전하게 암호화되어 관리됩니다.<br />
        언제든지 마이페이지에서 구독을 해지하실 수 있습니다.
      </p>
    </div>
  );
};

export default BillingKeyForm;
