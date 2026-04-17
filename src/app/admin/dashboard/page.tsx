'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import { 
  Users, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  Database,
  Search,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useSession } from 'next-auth/react';

const AdminDashboard = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-black text-[10px] uppercase tracking-widest text-gray-400 font-sans">Accessing Admin Control Center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-primary fill-primary/10" />
              <span className="text-[10px] font-black uppercase text-primary tracking-widest">Master Admin Console</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">플랫폼 운영 대시보드</h1>
          </div>
          <div className="flex gap-4">
             <button className="bg-white border border-gray-100 p-4 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm">
                <Settings className="h-5 w-5 text-gray-400" />
             </button>
             <button className="bg-gray-900 text-white px-8 py-4 rounded-[2rem] font-black text-sm hover:shadow-2xl transition-all shadow-xl shadow-gray-200">
                정산 프로세스 실행
             </button>
          </div>
        </header>

        {/* Global Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: '누적 매출액', value: `₩${stats?.totalRevenue?.toLocaleString() || 0}`, icon: BarChart3, color: 'text-primary' },
             { label: '활성 구독(렌탈)', value: stats?.activeSubscriptions || 0, icon: Clock, color: 'text-blue-500' },
             { label: '총 등록 작품', value: stats?.totalArtworks || 0, icon: Database, color: 'text-purple-500' },
             { label: '전체 가입자', value: stats?.totalUsers || 0, icon: Users, color: 'text-amber-500' },
           ].map((item, i) => (
             <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm group hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                   <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-6 w-6" />
                   </div>
                   <ArrowUpRight className="h-5 w-5 text-gray-200 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{item.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black text-gray-900">{item.value}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Detailed Transactions List */}
           <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-sm border border-gray-50">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-black text-gray-900">최근 거래 내역</h3>
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <input 
                       type="text" 
                       placeholder="거래/UID 검색..." 
                       className="bg-gray-50 border-none py-3 pl-11 pr-4 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    />
                 </div>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead>
                       <tr className="text-[10px] font-black uppercase text-gray-300 tracking-widest border-b border-gray-50">
                          <th className="text-left pb-4 pl-4">Customer</th>
                          <th className="text-left pb-4">Status</th>
                          <th className="text-left pb-4">Type</th>
                          <th className="text-right pb-4">Amount</th>
                          <th className="text-right pb-4 pr-4">Date</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {stats?.recentPayments?.length > 0 ? (
                         stats.recentPayments.map((pay: any) => (
                           <tr key={pay.id} className="group hover:bg-gray-50/50 transition-colors">
                              <td className="py-6 pl-4">
                                 <p className="text-sm font-bold text-gray-900">{pay.userId.split('-')[0]}...</p>
                                 <p className="text-[10px] text-gray-400">UID: {pay.merchantUid}</p>
                              </td>
                              <td className="py-6">
                                 <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                   pay.status === 'paid' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'
                                 }`}>
                                    {pay.status}
                                 </span>
                              </td>
                              <td className="py-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">{pay.paymentType}</td>
                              <td className="py-6 text-right font-black text-gray-900">₩{pay.amount.toLocaleString()}</td>
                              <td className="py-6 text-right text-[10px] font-bold text-gray-400 pr-4">{new Date(pay.createdAt).toLocaleDateString()}</td>
                           </tr>
                         ))
                       ) : (
                         <tr>
                            <td colSpan={5} className="py-24 text-center text-gray-300 italic font-bold">거래 데이터가 없습니다.</td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
              <button className="w-full mt-10 py-4 text-xs font-black text-gray-400 hover:text-gray-900 transition-colors border-t border-gray-50 pt-8 flex items-center justify-center gap-2">
                 전체 결제 내역 다운로드 (Excel)
                 <ChevronRight className="h-4 w-4" />
              </button>
           </div>

           {/* Platform Insights */}
           <div className="space-y-8">
              <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl shadow-primary/20">
                 <h3 className="text-xl font-black mb-2 leading-tight">ArtLink Growth Overview</h3>
                 <p className="text-primary-foreground/60 text-sm mb-10 font-medium">전월 대비 거래액이 24% 상승했습니다.</p>
                 
                 <div className="space-y-6">
                    {[
                      { label: '신규 가입 유저', value: '128', trend: '+12' },
                      { label: '작가 신청 승인 대기', value: '14', trend: 'Pending' },
                      { label: '미해결 이슈', value: '3', trend: 'Low' },
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between items-end border-b border-white/10 pb-4">
                         <div>
                            <p className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-1">{stat.label}</p>
                            <p className="text-xl font-black">{stat.value}</p>
                         </div>
                         <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-lg">{stat.trend}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white rounded-[3rem] p-10 border border-gray-50 shadow-sm">
                 <h3 className="text-lg font-black text-gray-900 mb-6 font-sans">System Health</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold mb-1">
                       <span className="text-gray-400">Database Load</span>
                       <span className="text-primary">24%</span>
                    </div>
                    <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                       <div className="w-[24%] h-full bg-primary rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-xs font-bold mt-4 mb-1">
                       <span className="text-gray-400">Monthly S3 Usage</span>
                       <span className="text-blue-500">68%</span>
                    </div>
                    <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                       <div className="w-[68%] h-full bg-blue-500 rounded-full"></div>
                    </div>
                 </div>
                 <p className="text-[10px] text-center text-gray-300 font-bold mt-10 italic uppercase tracking-[0.2em]">All Systems Operational</p>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
