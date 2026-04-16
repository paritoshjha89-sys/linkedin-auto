import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Trash2, MoreVertical, Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';
import { personalize } from '@/lib/personalize';

const MOCK_LEAD = { firstName: 'Jane', lastName: 'Doe', company: 'GrowthScale AI', title: 'Director of Growth' };

const CustomNode = ({ data, id }: any) => {
  const [isPreview, setIsPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { label, icon, color, template, type, onChange } = data;

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prospectData: { name: 'Jane Doe', title: 'Director of Growth', lastPost: 'The future of AI in Sales' } 
        })
      });
      const result = await res.json();
      onChange(id, result.text);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const showTemplate = ['CONNECT', 'MESSAGE', 'EMAIL', 'INMAIL', 'COMMENT'].includes(type);
  const isDelay = ['WAIT', 'DELAY'].includes(type);

  return (
    <div className="card glass min-w-[320px] max-w-[400px] !p-4 !border-l-4" style={{ borderLeftColor: color }}>
      <Handle type="target" position={Position.Top} className="!bg-slate-300" />
      
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 font-bold text-sm" style={{ color }}>
          {icon} {label}
        </div>
        <div className="flex gap-2 text-slate-400">
          {showTemplate && (
            <button onClick={() => setIsPreview(!isPreview)} className="hover:text-primary transition-colors">
              {isPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          )}
          <button className="hover:text-red-500 transition-colors" onClick={() => data.onDelete(id)}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {showTemplate && (
        <div className="relative mt-2">
          {isPreview ? (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-[11px] leading-relaxed min-h-[80px]">
              {personalize(template || "", MOCK_LEAD)}
            </div>
          ) : (
            <>
              <textarea
                value={template}
                onChange={(e) => onChange(id, e.target.value)}
                placeholder={type === 'EMAIL' || type === 'INMAIL' ? "Enter subject & message..." : "Write your message..."}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] min-h-[80px] focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              <button
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-vibrant text-white text-[10px] font-bold shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
              >
                {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                Magic AI
              </button>
            </>
          )}
        </div>
      )}

      {isDelay && (
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
          Wait for
          <input 
            type="text" 
            defaultValue="1 day" 
            className="w-16 px-2 py-1 rounded border border-slate-200 bg-transparent text-slate-900 focus:border-primary outline-none"
          />
        </div>
      )}

      {type.startsWith('IF_') && (
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium italic">
          Logic: {label}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-slate-300" />
    </div>
  );
};

export default memo(CustomNode);
