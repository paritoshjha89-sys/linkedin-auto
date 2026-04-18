"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Globe, Layout, Apple } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const handleLogin = async (provider: 'google' | 'azure' | 'apple' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) alert(error.message);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} className="text-slate-400" />
            </button>

            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-vibrant rounded-2xl mx-auto mb-6 shadow-xl shadow-primary/20 flex items-center justify-center text-white font-black text-2xl">O</div>
              <h2 className="text-3xl font-black tracking-tight text-slate-800">Welcome Back</h2>
              <p className="text-slate-500 font-medium mt-2">Log in to manage your LinkedIn automation</p>
            </div>

            <div className="grid gap-4">
              <button 
                onClick={() => handleLogin('github')}
                className="flex items-center justify-center gap-3 w-full p-4 bg-slate-900 rounded-2xl font-bold text-white hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                <Layout size={20} />
                Continue with GitHub
              </button>

              <button 
                onClick={() => handleLogin('google')}
                className="flex items-center justify-center gap-3 w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
              >
                <Globe size={20} className="text-rose-500" />
                Continue with Google
              </button>
              
              <button 
                onClick={() => handleLogin('azure')}
                className="flex items-center justify-center gap-3 w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
              >
                <Mail size={20} className="text-blue-500" />
                Continue with Outlook
              </button>

              <button 
                onClick={() => handleLogin('apple')}
                className="flex items-center justify-center gap-3 w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
              >
                <Apple size={20} className="text-slate-900" />
                Continue with Apple
              </button>
            </div>

            <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
              By continuing, you agree to OutreachFlow's <br/>
              <span className="text-primary underline cursor-pointer">Terms of Service</span> and <span className="text-primary underline cursor-pointer">Privacy Policy</span>.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
