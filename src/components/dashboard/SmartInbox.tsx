"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useCompletion } from '@ai-sdk/react';
import { supabase } from '@/lib/supabase';
import { queueReply } from '@/lib/automation';

interface Message {
  sender: string;
  text: string;
}

interface ReplyOption {
  type: string;
  text: string;
}

export default function SmartInbox({ message, leadId }: { message: Message, leadId?: string }) {
  const [replies, setReplies] = useState<ReplyOption[]>([]);
  const [temperature, setTemperature] = useState<string | null>(null);
  const [selectedReply, setSelectedReply] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const { complete, isLoading } = useCompletion({
    api: '/api/reply-options',
    onFinish: async (prompt, completion) => {
      try {
        const data = JSON.parse(completion);
        setReplies(data.options || []);
        setTemperature(data.temp || null);
        
        if (leadId && data.temp) {
          await supabase
            .from('leads')
            .update({ temperature: data.temp.toLowerCase() })
            .eq('id', leadId);
        }
      } catch (e) {
        console.error("Failed to parse AI completion", e);
      }
    }
  });

  const getAiSuggestions = () => {
    setReplies([]);
    setTemperature(null);
    setIsSent(false);
    complete(JSON.stringify({ lastMessage: message.text, prospectName: message.sender }));
  };

  const handleSend = async () => {
    if (!selectedReply || !leadId) return;
    
    setIsSending(true);
    try {
      await queueReply(leadId, selectedReply);
      setIsSent(true);
      setSelectedReply("");
      setReplies([]);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const getTempColor = (temp: string) => {
    if (temp === 'HOT') return 'bg-rose-500 text-white';
    if (temp === 'WARM') return 'bg-amber-500 text-white';
    return 'bg-blue-500 text-white';
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
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-800 tracking-tight">{message.sender}</h3>
              {temperature && (
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${getTempColor(temperature)}`}>
                  {temperature}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Replied 4m ago • Campaign: "UK Tech Founders"</p>
          </div>
        </div>
        <button 
          onClick={getAiSuggestions} 
          disabled={isLoading}
          className="text-primary hover:bg-primary/5 p-3 rounded-2xl transition-all active:scale-90"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
        </button>
      </div>

      {/* Message Area */}
      <div className="p-8 h-64 overflow-y-auto bg-slate-50/30">
        <div className="bg-white p-5 rounded-[1.5rem] rounded-tl-none border border-slate-100 shadow-sm max-w-[85%] relative group/msg">
          <div className="absolute -left-2 top-0 w-4 h-4 bg-white border-l border-t border-slate-100 rotate-[-45deg] translate-x-1" />
          <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{message.text}"</p>
        </div>
        
        {isLoading && (
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-primary animate-pulse uppercase tracking-widest">
            <Sparkles size={12} />
            AI is analyzing sentiment and generating replies...
          </div>
        )}

        {isSent && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest"
          >
            <CheckCircle2 size={12} />
            Reply Queued for Send (Safety Delays Active)
          </motion.div>
        )}
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
                  className={`text-left p-4 text-xs border rounded-2xl transition-all group/opt shadow-sm ${
                    selectedReply === reply.text 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                    : 'border-slate-100 hover:border-primary/30 hover:bg-primary/[0.02]'
                  }`}
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
              disabled={isLoading}
              className="w-full py-6 border-2 border-dashed border-slate-100 rounded-[1.5rem] text-slate-400 text-xs font-bold uppercase tracking-widest hover:border-primary/20 hover:text-primary hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {isLoading ? "Generating..." : "Click to generate smart replies..."}
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
          <button 
            onClick={handleSend}
            disabled={isSending || !selectedReply}
            className="bg-gradient-vibrant text-white px-6 py-4 rounded-2xl hover:opacity-90 shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center min-w-[64px]"
          >
            {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
