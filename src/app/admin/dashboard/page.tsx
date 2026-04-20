'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import { 
  BarChart3, 
  Users, 
  Box, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Share2,
  Loader2
} from 'lucide-react';
import { useSession } from 'next-auth/react';

const AdminDashboard = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'b2b' | 'artworks'>('overview');
  const [b2bInquiries, setB2bInquiries] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // B2B 문의 및 기본적인 분석 데이터 시뮬레이션
      const b2bRes = await fetch('/api/my/b2b-inquiries'); // 실제로는 admin 전역 조회 API 필요
      if (b2bRes.ok) setB2bInquiries(await b2bRes.json());
      
      // 분석 데이터 시뮬레이션 (실제 DB 집계 가능)
      setAnalyticsData({
        totalRevenue: 12450000,
        activeSubscriptions: 42,
        totalARViews: 1284,
        conversionRate: 3.4,
        monthlyData: [
          { month: 'Jan', revenue: 850000, views: 120 },
          { month: 'Feb', revenue: 920000, views: 150 },
          { month: 'Mar', revenue: 1050000, views: 210 },
          { month: 'Apr', revenue: 1450000, views: 320 },
        ],
        topArtworks: [
          { title: 'The Last Hope', views: 420, snapshots: 12 },
          { title: 'Neon Silence', views: 310, snapshots: 8 },
          { title: 'Azure Echoes', views: 245, snapshots: 5 },
        ]
      });
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSyncToSheets = async () => {
    setIsSyncing(true);
    // Google Sheets 연동 시뮬레이션
    setTimeout(() => {
      alert('데이터가 Google Sheets "ArtLink_Master_Report" 시트로 성공적으로 동기화되었습니다!');
      setIsSyncing(false);
    }, 2000);
  };

  const updateB2BStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/b2b/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchData(); // 새로고침
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex h-[80vh] items-center justify-center opacity-30 text-primary">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">운영 인사이트 및 제어</h1>
            <p className="text-gray-400 font-medium">ArtLink 비즈니스의 실시간 데이터 흐름을 한눈에 관리하세요.</p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={handleSyncToSheets}
               disabled={isSyncing}
               className="flex items-center gap-2 bg-white border border-gray-100 text-green-600 px-6 py-3 rounded-2xl font-black text-xs hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
             >
                {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                Sync to Google Sheets
             </button>
             <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-primary transition-all shadow-xl shadow-gray-200">
                <Share2 className="h-4 w-4" />
                Report Share
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Total Revenue', value: `₩${analyticsData.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12%', color: 'text-primary', bg: 'bg-primary/5' },
            { label: 'Active Subscriptions', value: analyticsData.activeSubscriptions, icon: Box, trend: '+5', color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'AR Experience Views', value: analyticsData.totalARViews, icon: BarChart3, trend: '+28%', color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Avg. Conversion', value: `${analyticsData.conversionRate}%`, icon: TrendingUp, trend: '+1.2%', color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
               <div className="flex justify-between mb-4">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                     <stat.icon className="h-6 w-6" />
                  </div>
                  <span className={`text-[10px] font-black uppercase ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend}
                  </span>
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-10 border-b border-gray-100 mb-10 overflow-x-auto pb-4">
           {['overview', 'b2b', 'artworks'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'text-primary border-b-2 border-primary pb-4 -mb-[18px]' : 'text-gray-300'}`}
             >
               {tab} Management
             </button>
           ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-12 animate-in fade-in duration-500">
             {/* Simple Chart Simulation (CSS) */}
             <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xl font-black text-gray-900">Monthly Revenue Growth</h3>
                   <div className="flex gap-2">
                      <span className="w-3 h-3 bg-primary rounded-full"></span>
                      <span className="text-[10px] font-black text-gray-400 uppercase">Revenue</span>
                   </div>
                </div>
                <div className="h-64 flex items-end gap-6 px-4">
                   {analyticsData.monthlyData.map((d: any, i: number) => (
                     <div key={i} className="flex-1 flex flex-col items-center group">
                        <div 
                          className="w-full bg-primary/10 rounded-t-xl group-hover:bg-primary transition-all duration-500 relative"
                          style={{ height: `${(d.revenue / 1500000) * 100}%` }}
                        >
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              ₩{(d.revenue / 10000).toLocaleString()}만
                           </div>
                        </div>
                        <p className="mt-4 text-[10px] font-black text-gray-400 uppercase">{d.month}</p>
                     </div>
                   ))}
                </div>
             </div>

             {/* Top Artworks List */}
             <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-8">Popular Artworks (AR)</h3>
                <div className="space-y-6">
                   {analyticsData.topArtworks.map((art: any, i: number) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 font-black">
                           {i + 1}
                        </div>
                        <div className="flex-1">
                           <p className="text-sm font-black text-gray-900">{art.title}</p>
                           <div className="flex gap-4">
                             <p className="text-[10px] text-gray-400 font-bold uppercase">{art.views} Views</p>
                             <p className="text-[10px] text-primary font-bold uppercase">{art.snapshots} AR Shots</p>
                           </div>
                        </div>
                        <div className="w-16 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{ width: `${(art.views / 500) * 100}%` }}></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'b2b' && (
          <div className="bg-white rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                <h3 className="text-lg font-black text-gray-900">B2B Inquiry Lead Pipeline</h3>
                <div className="flex gap-4">
                   <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                      <input className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs focus:outline-none focus:border-primary" placeholder="Search leads..." />
                   </div>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <tr>
                         <th className="px-8 py-6">Company / Lead</th>
                         <th className="px-8 py-6">Consultation Type</th>
                         <th className="px-8 py-6">Date</th>
                         <th className="px-8 py-6">Status</th>
                         <th className="px-8 py-6">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50 font-medium text-sm text-gray-600">
                      {b2bInquiries.length > 0 ? b2bInquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-gray-50/30 transition-colors">
                           <td className="px-8 py-6">
                              <p className="font-black text-gray-900">{inq.companyName}</p>
                              <p className="text-xs text-gray-400">{inq.managerName} ({inq.email})</p>
                           </td>
                           <td className="px-8 py-6">
                              <span className="text-xs bg-gray-100 px-3 py-1 rounded-lg">Commercial Space</span>
                           </td>
                           <td className="px-8 py-6 text-xs">{new Date(inq.createdAt).toLocaleDateString()}</td>
                           <td className="px-8 py-6">
                              <select 
                                onChange={(e) => updateB2BStatus(inq.id, e.target.value)}
                                value={inq.status}
                                className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border-none focus:ring-0 cursor-pointer ${
                                  inq.status === 'pending' ? 'bg-orange-50 text-orange-500' :
                                  inq.status === 'contacted' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="contacted">Contacted</option>
                                <option value="completed">Completed</option>
                              </select>
                           </td>
                           <td className="px-8 py-6">
                              <button className="p-2 hover:bg-white rounded-xl transition-all">
                                 <MoreVertical className="h-4 w-4 text-gray-300" />
                              </button>
                           </td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan={5} className="px-8 py-20 text-center text-gray-300 italic">No B2B leads registered yet.</td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
