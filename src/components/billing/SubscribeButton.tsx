"use client";
import React from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SubscribeButtonProps {
  priceId?: string;
  variant?: 'primary' | 'outline';
  label?: string;
}

export default function SubscribeButton({ 
  priceId = 'pri_123_linkedin_saas_monthly', 
  variant = 'primary',
  label = 'Unlock AI Automation'
}: SubscribeButtonProps) {
  
  const handleSubscribe = async () => {
    const paddle = await initializePaddle({ 
      environment: 'sandbox', // Use 'production' for live
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || 'your_token_here' 
    });

    if (paddle) {
      paddle.Checkout.open({
        items: [{ priceId: priceId, quantity: 1 }],
        customer: { email: 'user@example.com' } // In production, get from auth context
      });
    }
  };

  if (variant === 'outline') {
    return (
      <button 
        onClick={handleSubscribe}
        className="w-full py-4 rounded-2xl border border-slate-200 font-bold hover:bg-slate-50 transition-all text-slate-600 flex items-center justify-center gap-2"
      >
        <ShieldCheck size={18} />
        {label}
      </button>
    );
  }

  return (
    <button 
      onClick={handleSubscribe} 
      className="btn-primary w-full flex items-center justify-center gap-2 shadow-xl shadow-primary/20 group"
    >
      <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
      {label}
    </button>
  );
}
