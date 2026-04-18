"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Github, Chrome } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const handleLogin = async (provider: 'google' | 'azure' | 'apple') => {
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
                onClick={() => handleLogin('google')}
                className="flex items-center justify-center gap-3 w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
              >
                <Chrome size={20} className="text-rose-500" />
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
                className="flex items-center justify-center gap-3 w-full p-4 bg-slate-900 rounded-2xl font-bold text-white hover:bg-slate-800 transition-all active:scale-[0.98]"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                   <svg viewBox="0 0 256 315" className="w-4 h-4 fill-current"><path d="M213.803 167.03c.442 47.58 41.74 63.413 42.197 63.615-.35 1.116-6.599 22.563-21.757 44.716-13.104 19.153-26.705 38.235-48.13 38.63-21.05.388-27.82-12.483-51.888-12.483-24.061 0-31.582 12.088-51.51 12.871-20.68.783-36.428-20.71-49.64-39.793C6.006 234.362-10.252 147.288 17.5 98.92c13.759-24.005 38.451-39.202 65.234-39.592 20.3-.393 39.444 13.671 51.888 13.671 12.438 0 36.273-16.685 60.907-14.167 10.305.427 39.27 4.14 57.826 31.317-1.496.933-34.506 20.096-34.125 59.816zM174.132 38.83C185.066 25.589 192.435 7.196 190.416 0c-15.803.638-34.885 10.514-46.205 23.754-10.144 11.62-19.034 30.516-16.658 47.185 17.656 1.363 35.64-8.869 46.579-22.109z"/></svg>
                </div>
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
