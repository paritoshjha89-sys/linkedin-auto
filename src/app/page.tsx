"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Zap, Target, BarChart3, Users, Check } from 'lucide-react';
import SubscribeButton from '@/components/billing/SubscribeButton';
import AuthModal from '@/components/auth/AuthModal';
import FloatingChat from '@/components/Chatbot/FloatingChat';
import Logo from '@/components/Logo';

const features = [
  {
    icon: <Zap size={28} />,
    title: "Multi-Channel Automation",
    description: "Combine LinkedIn and Email outreach in a single, cohesive workflow for maximum impact.",
    color: "#1D4ED8"
  },
  {
    icon: <Target size={28} />,
    title: "Precision Targeting",
    description: "Enrich your lead data with 30+ attributes and segment your audience for hyper-personalized messaging.",
    color: "#7C3AED"
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Advanced Analytics",
    description: "Track performance across teams and campaigns with real-time conversion and ROI metrics.",
    color: "#2DD4BF"
  },
  {
    icon: <Users size={28} />,
    title: "Team Collaboration",
    description: "Scale your efforts with role-based permissions, shared sequences, and a unified inbox.",
    color: "#6366F1"
  }
];

const PRICE_IDS = ['pri_basic_123', 'pri_pro_456', 'pri_agency_789'];

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <FloatingChat />

      {/* Navigation */}
      <nav className="glass sticky top-0 z-[100] h-20 flex items-center justify-between px-8 md:px-16">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10" />
          <span className="text-xl font-extrabold tracking-tight">OutreachFlow</span>
        </div>
        <div className="hidden md:flex items-center gap-10 font-bold text-sm tracking-tight">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <button 
            onClick={() => setIsAuthOpen(true)}
            className="px-5 py-2.5 border border-slate-200 rounded-xl hover:border-primary transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={() => setIsAuthOpen(true)}
            className="btn-primary !px-5 !py-2.5 text-xs uppercase tracking-widest"
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-8 md:px-16 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI-Powered Sales Automation is Here
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] mb-8">
            Automate Your <span className="gradient-text">Outreach</span> <br className="hidden md:block" /> with Precision.
          </h1>
          
          <p className="text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Scale your prospecting across LinkedIn and Email. Build multi-channel sequences, manage leads, and close more deals—all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="btn-primary flex items-center gap-2 group !px-8 !py-4 shadow-xl shadow-primary/30"
            >
              Get Started for Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 font-bold hover:bg-slate-50 transition-colors">
              <Play size={18} fill="currentColor" /> Watch Demo
            </button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 max-w-6xl mx-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]">
          <div className="rounded-2xl overflow-hidden aspect-video bg-slate-50 flex items-center justify-center font-bold text-slate-300">
            [ Campaign Flow Visualization Preview ]
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-8 md:px-16 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Everything to <span className="gradient-text">Close More Deals</span></h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">A powerful suite of tools designed for modern sales teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="card group hover:scale-[1.05] transition-transform">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow" style={{ color: feature.color, backgroundColor: `${feature.color}10` }}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-8 md:px-16 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight mb-16">Simple, <span className="gradient-text">Transparent</span> Pricing</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8 items-stretch">
          {['Basic', 'Pro', 'Agency'].map((plan, i) => (
            <div key={plan} className={`card w-full max-w-sm flex flex-col items-center !p-10 ${i === 1 ? 'border-primary ring-4 ring-primary/5 scale-105 z-10' : ''}`}>
              {i === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-extrabold mb-4">{plan}</h3>
              <div className="text-5xl font-extrabold mb-8">
                ${[39, 79, 199][i]}<span className="text-sm text-slate-400 font-bold uppercase">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 text-left w-full">
                {['Leads per month', 'Active campaigns', 'Advanced filters', 'CRM integrations', 'Multi-user support'].map((feat, j) => (
                  <li key={feat} className={`flex items-center gap-3 text-sm ${(j < 3 || (i > 0 && j < 4) || i > 1) ? 'text-slate-600 font-medium' : 'text-slate-300 font-medium opacity-50'}`}>
                    <Check size={16} className={j < 3 || (i > 0 && j < 4) || i > 1 ? 'text-emerald-500' : 'text-slate-200'} />
                    {feat}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setIsAuthOpen(true)}
                className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${
                  i === 1 
                  ? 'bg-gradient-vibrant text-white shadow-xl shadow-primary/20' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Choose {plan}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">&copy; 2026 OutreachFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
