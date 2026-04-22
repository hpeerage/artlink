'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  ArrowRight,
  MessageSquare,
  Coffee,
  Paintbrush,
  Loader2,
  Box
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const B2BPage = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    managerName: '',
    email: '',
    phone: '',
    spaceSize: '',
    budget: '',
    preferredDate: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/b2b/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error('B2B Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-40 flex flex-col items-center text-center px-6">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-8 animate-bounce">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">{t('b2b.success_title')}</h1>
          <p className="text-gray-500 font-medium max-w-md leading-relaxed mb-10">
            {t('b2b.success_desc')}
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-10 py-5 bg-gray-900 text-white rounded-3xl font-black text-sm hover:bg-primary transition-all shadow-xl shadow-gray-200"
          >
            {t('b2b.back_to_main')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
            <Building2 className="h-3 w-3" />
            {t('b2b.badge')}
          </div>
          <h1 className="mb-8 text-6xl md:text-8xl font-black leading-[1.05] tracking-tighter text-gray-900 whitespace-pre-line">
            {t('b2b.title')}
          </h1>
          <p className="mb-12 max-w-2xl mx-auto text-xl text-gray-400 font-medium leading-relaxed whitespace-pre-line">
            {t('b2b.subtitle')}
          </p>
        </div>
        {/* Background Decos */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Service Stats */}
      <section className="py-20 bg-gray-50/50">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Paintbrush, title: t('b2b.feature_curation'), desc: t('b2b.feature_curation_desc') },
              { icon: Box, title: t('b2b.feature_ar'), desc: t('b2b.feature_ar_desc') },
              { icon: CheckCircle2, title: t('b2b.feature_care'), desc: t('b2b.feature_care_desc') },
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Clients / Cases */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
           <div className="flex flex-col md:flex-row gap-20 items-center">
              <div className="flex-1">
                 <h2 className="text-[11px] font-black uppercase text-primary tracking-[0.4em] mb-4">Case Study</h2>
                 <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-tight mb-8">
                    {t('b2b.case_title')}
                 </h3>
                 <p className="text-gray-500 text-lg leading-relaxed font-medium mb-10">
                    {t('b2b.case_desc')}
                 </p>
                 <div className="grid grid-cols-2 gap-8 text-center sm:text-left">
                    <div>
                       <p className="text-3xl font-black text-gray-900">12%</p>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Productivity Increase</p>
                    </div>
                    <div>
                       <p className="text-3xl font-black text-gray-900">98%</p>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Member Satisfaction</p>
                    </div>
                 </div>
              </div>
              <div className="flex-1 relative">
                 <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" 
                      alt="Office Case" 
                      className="w-full h-full object-cover"
                    />
                 </div>
                 <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-50 hidden md:block">
                    <div className="flex items-center gap-4 mb-3">
                       <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                          <Users className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Client Review</p>
                          <p className="text-[10px] font-bold text-gray-400 italic">Facility Manager</p>
                       </div>
                    </div>
                    <p className="text-sm font-bold text-gray-600 max-w-xs leading-relaxed italic">
                      "가장 혁신적인 예술 경험이었습니다. AR로 미리 보는 것이 결정적인 큰 도움이 되었죠."
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-32 bg-gray-900 text-white relative">
        <div className="container mx-auto max-w-3xl px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter mb-4">{t('b2b.inquiry_title')}</h2>
            <p className="text-gray-400 font-medium">{t('b2b.inquiry_subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Company Name *</label>
                <input 
                  type="text" required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-bold"
                  placeholder={t('b2b.form_company')}
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Manager Name *</label>
                <input 
                  type="text" required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-bold"
                  placeholder={t('b2b.form_manager')}
                  value={formData.managerName}
                  onChange={(e) => setFormData({...formData, managerName: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Email Address *</label>
                <input 
                  type="email" required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-bold"
                  placeholder={t('b2b.form_email')}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Phone Number *</label>
                <input 
                  type="tel" required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-bold"
                  placeholder={t('b2b.form_phone')}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Space Size (Approx)</label>
                <input 
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-bold"
                  placeholder={t('b2b.form_size')}
                  value={formData.spaceSize}
                  onChange={(e) => setFormData({...formData, spaceSize: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">{t('b2b.form_budget')}</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-bold appearance-none"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                >
                  <option value="" className="bg-gray-900">{t('b2b.form_budget_placeholder')}</option>
                  <option value="1M~3M" className="bg-gray-900">월 100~300만원</option>
                  <option value="3M~10M" className="bg-gray-900">월 300~1000만원</option>
                  <option value="10M+" className="bg-gray-900">월 1000만원 이상</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary">Requirement / Message</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all font-bold min-h-[150px]"
                placeholder={t('b2b.form_message')}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-6 rounded-3xl font-black text-lg hover:shadow-[0_20px_50px_rgba(0,207,187,0.3)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-6 w-6 mx-auto" /> : t('b2b.form_submit')}
            </button>
          </form>
        </div>
        
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 blur-[120px] -z-0"></div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-gray-50 bg-white">
        <div className="text-2xl font-black tracking-tighter mb-4 opacity-10">
          ARTLINK <span className="italic text-primary">BUSINESS</span>
        </div>
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Professional Space Art Curation Solution</p>
      </footer>
    </div>
  );
};

export default B2BPage;
