import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Brain, Trash2, Sparkles } from 'lucide-react';

const SentimentNode = ({ data, id }: any) => {
  return (
    <div className="card glass min-w-[280px] !p-5 !border-l-4 !border-l-purple-500 shadow-2xl relative">
      <Handle type="target" position={Position.Top} className="!bg-purple-500 !w-3 !h-3" />
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 font-black text-[10px] text-purple-600 uppercase tracking-widest">
          <Brain size={14} /> AI Sentiment Analyzer
        </div>
        <div className="flex items-center gap-2">
           <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter">Gemini 3</span>
           <button className="text-slate-300 hover:text-red-500 transition-colors" onClick={() => data.onDelete(id)}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 mb-6">
        <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
          <Sparkles size={12} className="text-purple-500" />
          Evaluate last reply sentiment...
        </p>
      </div>

      {/* Output Branches */}
      <div className="space-y-4 pr-2">
        <div className="flex items-center justify-between group relative h-6">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Positive / Interested</span>
          <Handle 
            type="source" 
            position={Position.Right} 
            id="positive" 
            className="!bg-emerald-500 !w-3 !h-3" 
            style={{ right: '-24px', top: '50%' }}
          />
        </div>
        
        <div className="flex items-center justify-between group relative h-6">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Neutral / Questions</span>
          <Handle 
            type="source" 
            position={Position.Right} 
            id="neutral" 
            className="!bg-amber-500 !w-3 !h-3" 
            style={{ right: '-24px', top: '50%' }}
          />
        </div>

        <div className="flex items-center justify-between group relative h-6">
          <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Negative / Unsubscribe</span>
          <Handle 
            type="source" 
            position={Position.Right} 
            id="negative" 
            className="!bg-rose-500 !w-3 !h-3" 
            style={{ right: '-24px', top: '50%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(SentimentNode);
