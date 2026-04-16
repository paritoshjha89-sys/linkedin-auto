import React from 'react';
import { UserPlus, MessageSquare, Clock, Mail, MousePointer2, GitBranch, Heart, MessageCircle, UserCheck, Search, Calendar, ThumbsUp, Star, ShieldCheck, Brain } from 'lucide-react';

export const ACTIONS_DATA = [
  { id: 'view', label: 'View Profile', cat: 'Action', icon: <MousePointer2 size={14} />, color: '#6366F1' },
  { id: 'connect', label: 'Invite to Connect', cat: 'Action', icon: <UserPlus size={14} />, color: '#1D4ED8' },
  { id: 'message', label: 'Send Message', cat: 'Action', icon: <MessageSquare size={14} />, color: '#7C3AED' },
  { id: 'inmail', label: 'Send InMail', cat: 'Action', icon: <Star size={14} />, color: '#F59E0B' },
  { id: 'follow', label: 'Follow', cat: 'Action', icon: <UserCheck size={14} />, color: '#10B981' },
  { id: 'endorse', label: 'Endorse Skills', cat: 'Action', icon: <ShieldCheck size={14} />, color: '#2DD4BF' },
  { id: 'like', label: 'Like Post', cat: 'Action', icon: <ThumbsUp size={14} />, color: '#3B82F6' },
  { id: 'comment', label: 'Comment on Post', cat: 'Action', icon: <MessageCircle size={14} />, color: '#EC4899' },
  { id: 'email', label: 'Send Email', cat: 'Action', icon: <Mail size={14} />, color: '#06B6D4' },
  { id: 'find_email', label: 'Find Email', cat: 'Action', icon: <Search size={14} />, color: '#8B5CF6' },
  
  { id: 'wait', label: 'Delay (Days)', cat: 'Control', icon: <Clock size={14} />, color: '#94A3B8' },
  { id: 'schedule', label: 'Schedule', cat: 'Control', icon: <Calendar size={14} />, color: '#64748B' },
  
  { id: 'if_accepted', label: 'If Accepted', cat: 'Logic', icon: <GitBranch size={14} />, color: '#F59E0B' },
  { id: 'if_replied', label: 'If Replied', cat: 'Logic', icon: <GitBranch size={14} />, color: '#F97316' },
  { id: 'if_connected', label: 'If Connected', cat: 'Logic', icon: <GitBranch size={14} />, color: '#EF4444' },
  { id: 'if_email_exists', label: 'If Email Exists', cat: 'Logic', icon: <GitBranch size={14} />, color: '#D946EF' },
  { id: 'sentiment', label: 'AI Sentiment Analyzer', cat: 'Logic', icon: <Brain size={14} />, color: '#9333EA' },
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r bg-white p-6 overflow-y-auto h-full shadow-sm flex flex-col">
      <h3 className="font-extrabold mb-6 text-slate-400 uppercase text-[10px] tracking-widest">Toolbox</h3>
      
      {['Action', 'Control', 'Logic'].map(cat => (
        <div key={cat} className="mb-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">{cat}s</p>
          <div className="grid gap-2">
            {ACTIONS_DATA.filter(a => a.cat === cat).map(action => (
              <div
                key={action.id}
                draggable
                onDragStart={(e) => onDragStart(e, action.id)}
                className="group flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl cursor-grab hover:border-primary/20 hover:bg-primary/[0.01] hover:shadow-sm transition-all text-xs font-bold text-slate-600"
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 group-hover:bg-white shadow-sm transition-colors" 
                  style={{ color: action.color }}
                >
                  {action.icon}
                </div>
                <span className="group-hover:text-primary transition-colors">{action.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-auto pt-6">
        <div className="p-4 rounded-2xl bg-gradient-vibrant text-white shadow-lg">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">Workflow Tip</p>
          <p className="text-[11px] font-medium leading-relaxed">
            Combine LinkedIn actions with Email logic for a multi-channel conversion engine.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
