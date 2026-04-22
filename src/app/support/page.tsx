'use client';

import React, { useState } from 'react';
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
import { useLanguage } from '@/lib/i18n/LanguageContext';

const SupportPage = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: t('support.faq_q1'),
      answer: t('support.faq_a1'),
      icon: Box
    },
    {
      question: t('support.faq_q2'),
      answer: t('support.faq_a2'),
      icon: Smartphone
    },
    {
      question: t('support.faq_q3'),
      answer: t('support.faq_a3'),
      icon: ShieldCheck
    },
    {
      question: t('support.faq_q4'),
      answer: t('support.faq_a4'),
      icon: MessageCircle
    }
  ];

  const categories = [
    { title: t('support.cat_start'), desc: t('support.cat_start_desc'), icon: Monitor },
    { title: t('support.cat_rental'), desc: t('support.cat_rental_desc'), icon: FileText },
    { title: t('support.cat_b2b'), desc: t('support.cat_b2b_desc'), icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Search Section */}
      <section className="pt-40 pb-24 bg-gray-50 border-b border-gray-100 px-6 overflow-hidden relative">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter">{t('support.title')}</h1>
          <div className="relative max-w-2xl mx-auto shadow-2xl rounded-[2rem] overflow-hidden">
             <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 font-black" />
             <input 
               className="w-full pl-20 pr-10 py-8 bg-white border-none text-lg font-medium focus:ring-0 focus:outline-none" 
               placeholder={t('support.search_placeholder')} 
             />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>{t('support.trending')}:</span>
            <button className="text-primary hover:underline">{t('support.trending_ar')}</button>
            <button className="text-primary hover:underline">{t('support.trending_return')}</button>
            <button className="text-primary hover:underline">{t('support.trending_payment')}</button>
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
              {categories.map((cat, i) => (
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
             <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{t('support.faq_title')}</h2>
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
            <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tighter">{t('support.cta_title')}</h2>
            <p className="text-gray-400 font-medium mb-12 leading-relaxed">
              {t('support.cta_desc')}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
               <button className="px-10 py-5 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-100">
                 {t('support.cta_chat')}
               </button>
               <button className="px-10 py-5 bg-white border border-gray-100 text-gray-400 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                 {t('support.cta_email')}
               </button>
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
