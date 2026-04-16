"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2 } from 'lucide-react';

interface Message {
  sender: string;
  text: string;
}

interface ReplyOption {
  type: string;
  text: string;
}

export default function SmartInbox({ message }: { message: Message }) {
  const [replies, setReplies] = useState<ReplyOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReply, setSelectedReply] = useState("");

  const getAiSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reply-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastMessage: message.text, prospectName: message.sender })
      });
      const data = await res.json();
      setReplies(data.options || []);
    } catch (error) {
      console.error("Failed to fetch replies", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden group">
      {/* Inbox Header */}
      <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-vibrant rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
            {message.sender[0]}
          </div>
          <div>
            <h3 className="font-black text-slate-800 tracking-tight">{message.sender}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Replied 4m ago • Campaign: "UK Tech Founders"</p>
          </div>
        </div>
        <button 
          onClick={getAiSuggestions} 
          disabled={loading}
          className="text-primary hover:bg-primary/5 p-3 rounded-2xl transition-all active:scale-90"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
        </button>
      </div>

      {/* Message Area */}
      <div className="p-8 h-64 overflow-y-auto bg-slate-50/30">
        <div className="bg-white p-5 rounded-[1.5rem] rounded-tl-none border border-slate-100 shadow-sm max-w-[85%] relative group/msg">
          <div className="absolute -left-2 top-0 w-4 h-4 bg-white border-l border-t border-slate-100 rotate-[-45deg] translate-x-1" />
          <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"${message.text}"</p>
        </div>
      </div>

      {/* AI Suggestion Bar */}
      <div className="p-8 border-t border-slate-50 bg-white">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Smart Suggestions</p>
          {replies.length > 0 && (
            <button onClick={() => setReplies([])} className="text-[10px] font-bold text-slate-300 hover:text-slate-500 uppercase tracking-widest">Clear</button>
          )}
        </div>
        
        <div className="grid gap-3">
          {replies.length > 0 ? (
            <AnimatePresence>
              {replies.map((reply, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedReply(reply.text)}
                  className="text-left p-4 text-xs border border-slate-100 rounded-2xl hover:border-primary/30 hover:bg-primary/[0.02] transition-all group/opt shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-primary uppercase tracking-tighter opacity-70">{reply.type}</span>
                    <Sparkles size={10} className="text-primary opacity-0 group-hover/opt:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-slate-600 group-hover/opt:text-slate-900 font-medium leading-snug">{reply.text}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          ) : (
            <button 
              onClick={getAiSuggestions} 
              className="w-full py-6 border-2 border-dashed border-slate-100 rounded-[1.5rem] text-slate-400 text-xs font-bold uppercase tracking-widest hover:border-primary/20 hover:text-primary hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Click to generate smart replies...
            </button>
          )}
        </div>

        {/* Reply Input */}
        <div className="mt-8 flex gap-3">
          <input 
            type="text" 
            value={selectedReply}
            onChange={(e) => setSelectedReply(e.target.value)}
            className="flex-1 bg-slate-50 border-slate-100 border rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="Type a custom reply or select a suggestion..."
          />
          <button className="bg-gradient-vibrant text-white p-4 rounded-2xl hover:opacity-90 shadow-xl shadow-primary/20 active:scale-95 transition-all">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
