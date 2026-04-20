'use client';

import React, { useState } from 'react';
import Header from '@/components/common/Header';
import { 
  Search, 
  ChevronDown, 
  HelpCircle, 
  MessageCircle, 
  FileText, 
  Box, 
  Monitor, 
  ShieldCheck,
  Smartphone,
  ArrowRight
} from 'lucide-react';

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "ArtLink의 렌탈 서비스는 어떻게 이용하나요?",
      answer: "ArtLink는 WebAR 기술을 통해 작품을 실제 크기로 공간에 배치해본 후, 마음에 드는 작품을 정기 구독(렌탈) 방식으로 대여할 수 있습니다. 각 작품 상세 페이지에서 'AR 체험하기' 버튼을 눌러보세요.",
      icon: Box
    },
    {
      question: "AR 기능을 사용하기 위해 별도의 앱 설치가 필요한가요?",
      answer: "아니요, ArtLink는 WebAR 표준을 지원하여 별도의 앱 설치 없이 모바일 웹 브라우저(Safari, Chrome 등)에서 즉시 사용 가능합니다.",
      icon: Smartphone
    },
    {
      question: "렌탈 중 작품이 훼손되면 어떻게 되나요?",
      answer: "기본적으로 모든 렌탈 작품에는 ArtLink 안심 보험이 포함되어 있습니다. 일상적인 생활 스크래치나 가벼운 변색 등은 보험 처리가 가능하며, 중대한 훼손 발생 시 고객 센터로 즉시 연락 주시기 바랍니다.",
      icon: ShieldCheck
    },
    {
      question: "법인 고객(B2B)을 위한 대량 렌탈이나 큐레이션 서비스도 있나요?",
      answer: "네, 상단 메뉴의 'B2B Service' 페이지를 통해 오피스, 카페, 호텔 등 상업 공간을 위한 맞춤형 큐레이션 및 대량 렌탈 상담을 신청하실 수 있습니다.",
      icon: MessageCircle
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Search Section */}
      <section className="pt-40 pb-24 bg-gray-50 border-b border-gray-100 px-6 overflow-hidden relative">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter">무엇을 도와드릴까요?</h1>
          <div className="relative max-w-2xl mx-auto shadow-2xl rounded-[2rem] overflow-hidden">
             <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 font-black" />
             <input 
               className="w-full pl-20 pr-10 py-8 bg-white border-none text-lg font-medium focus:ring-0 focus:outline-none" 
               placeholder="도움말, 키워드 검색..." 
             />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>인기 검색어:</span>
            <button className="text-primary hover:underline">AR 설정 방법</button>
            <button className="text-primary hover:underline">반납 절차</button>
            <button className="text-primary hover:underline">결제 변경</button>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="absolute top-20 left-20 w-32 h-32 border-4 border-gray-200 rounded-full"></div>
           <div className="absolute bottom-20 right-20 w-64 h-64 border-4 border-gray-200 rounded-2xl rotate-45"></div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: '시작하기', desc: '계정 생성부터 첫 AR 체험까지', icon: Monitor },
                { title: '렌탈 및 구독', desc: '결제 관리와 작품 교체 안내', icon: FileText },
                { title: 'B2B 및 법인', desc: '공간 큐레이션 서비스 프로세스', icon: MessageCircle },
              ].map((cat, i) => (
                <div key={i} className="group p-10 bg-white border border-gray-100 rounded-[3rem] hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                      <cat.icon className="h-8 w-8" />
                   </div>
                   <h3 className="text-xl font-black text-gray-900 mb-2">{cat.title}</h3>
                   <p className="text-sm text-gray-400 font-medium leading-relaxed">{cat.desc}</p>
                   <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Articles <ArrowRight className="h-3 w-3" />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50/50 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-12">
             <HelpCircle className="h-8 w-8 text-primary" />
             <h2 className="text-3xl font-black text-gray-900 tracking-tighter">자주 묻는 질문</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-8 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                     <span className="text-primary bg-primary/5 p-2 rounded-lg"><faq.icon className="h-4 w-4" /></span>
                     <span className="font-bold text-gray-900">{faq.question}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-300 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-8 text-gray-500 text-sm leading-relaxed animate-in slide-in-from-top-2 duration-300 font-medium">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 text-center px-6">
         <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tighter">원하는 답변을 찾지 못하셨나요?</h2>
            <p className="text-gray-400 font-medium mb-12 leading-relaxed">
              최고의 아트 어드바이저 팀이 대기 중입니다. <br />
              실시간 채팅이나 1:1 문의를 통해 빠르게 답변해 드립니다.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
               <button className="px-10 py-5 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-100">실시간 채팅 상담</button>
               <button className="px-10 py-5 bg-white border border-gray-100 text-gray-400 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">1:1 문의 메일</button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-gray-50">
        <div className="text-2xl font-black tracking-tighter mb-4 opacity-10">
          ARTLINK <span className="italic text-primary">SUPPORT</span>
        </div>
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Always here to help you scale your art experience.</p>
      </footer>
    </div>
  );
};

export default SupportPage;
