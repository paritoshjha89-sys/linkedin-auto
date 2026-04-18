import React from 'react';
import { Sparkles } from 'lucide-react';
import SmartInbox from './SmartInbox';

export function Analytics() {
  const stats = [
    { label: 'Sent', value: '4,102', color: 'text-slate-600' },
    { label: 'Accepted', value: '32%', color: 'text-emerald-600' },
    { label: 'Replied', value: '18%', color: 'text-blue-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-slate-50 min-h-screen">
      <div className="md:col-span-3 flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800">Advanced Analytics</h2>
          <p className="text-sm text-slate-500 font-medium">Real-time performance and engagement tracking</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-xs font-bold bg-white border rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-widest">Export CSV</button>
          <button className="btn-primary !py-2 !px-5 !text-xs uppercase tracking-widest shadow-lg shadow-primary/20">Refresh Data</button>
        </div>
      </div>

      {stats.map(s => (
        <div key={s.label} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
          <p className={`text-5xl font-black mt-2 ${s.color} tracking-tighter`}>{s.value}</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            +4.2% from last week
          </div>
        </div>
      ))}

      <div className="md:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[400px]">
        <div className="flex justify-between items-center mb-10 px-4">
          <h4 className="font-black text-xs tracking-widest text-slate-400 uppercase opacity-60">Smart Inbox Simulator</h4>
          <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest animate-pulse">2 Unread Replies</span>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
           <SmartInbox 
             leadId="00000000-0000-0000-0000-000000000000"
             message={{ 
               sender: "John Doe", 
               text: "Thanks for reaching out! Your point about multi-channel efficiency really resonated. Would love to chat Tuesday at 2 PM if you're free?" 
             }} 
           />
           
           <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 border-l-8 border-l-slate-300 opacity-60 grayscale hover:grayscale-0 transition-all">
             <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 font-black">S</div>
                 <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Earlier Reply from Sarah Chen</p>
                   <p className="text-sm font-bold text-slate-800 tracking-tight">Growth Lead at ScaleUp AI</p>
                 </div>
               </div>
               <span className="text-[10px] font-bold text-slate-400">4 hours ago</span>
             </div>
             <p className="text-slate-500 leading-relaxed text-sm font-medium italic">"I'm currently traveling, but let's connect next week. Your AI-driven approach sounds interesting."</p>
           </div>
        </div>
      </div>
    </div>
  );
}
