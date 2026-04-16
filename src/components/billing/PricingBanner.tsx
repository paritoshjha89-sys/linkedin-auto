"use client";
import React from 'react';
import SubscribeButton from './SubscribeButton';
import { Zap } from 'lucide-react';

export default function PricingBanner() {
  return (
    <div className="mt-8 p-8 rounded-[2.5rem] bg-[#0F172A] text-white relative overflow-hidden group border border-slate-800">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">
            Premium Feature
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-3">Unlock AI Automation</h2>
          <p className="text-slate-400 font-medium leading-relaxed">
            Scale your outreach with 2,000+ monthly leads, advanced sentiment analysis, and unlimited multi-channel sequences.
          </p>
        </div>
        
        <div className="w-full md:w-auto min-w-[240px]">
          <SubscribeButton 
            priceId="pri_pro_456" 
            label="Unlock AI — £49/mo" 
          />
          <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4">
            Cancel anytime • 7-day free trial
          </p>
        </div>
      </div>
    </div>
  );
}
