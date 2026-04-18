"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Loader2, MinusCircle, Maximize2 } from 'lucide-react';
import { useCompletion } from 'ai/react';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([
    { role: 'ai', content: "Hi! I'm your Outreach Assistant. How can I help you optimize your LinkedIn campaigns today?" }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { complete, completion, isLoading } = useCompletion({
    api: '/api/chat', // We'll create this next
    onFinish: (prompt, result) => {
      setHistory(prev => [...prev, { role: 'ai', content: result }]);
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, completion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    
    await complete(userMsg);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[300]">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-vibrant text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">AI Assistant</h3>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Always Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-600 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && completion && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-[1.5rem] rounded-tl-none bg-white border border-slate-100 text-slate-600 text-sm font-medium shadow-sm">
                    {completion}
                  </div>
                </div>
              )}
              {isLoading && !completion && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                  <Loader2 size={12} className="animate-spin" />
                  Assistant is thinking...
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-6 bg-white border-t border-slate-50">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-slate-50 border-slate-100 border rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-14"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-2 p-3 bg-gradient-vibrant text-white rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-vibrant text-white rounded-[1.5rem] shadow-2xl shadow-primary/30 flex items-center justify-center relative group"
          >
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </div>
            <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
