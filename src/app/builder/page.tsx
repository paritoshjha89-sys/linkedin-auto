"use client";

import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '@/components/builder/CustomNode';
import SentimentNode from '@/components/builder/SentimentNode';
import Sidebar, { ACTIONS_DATA } from '@/components/builder/Sidebar';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const nodeTypes = {
  customNode: CustomNode,
  sentimentNode: SentimentNode,
};

export default function FlowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#1D4ED8', strokeWidth: 2 } }, eds)),
    [setEdges],
  );

  const saveCampaign = async () => {
    if (!nodes.length) {
      alert("Please add at least one node to your campaign.");
      return;
    }

    setIsSaving(true);
    try {
      const serializableNodes = nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          label: node.data.label,
          color: node.data.color,
          type: node.data.type,
          template: node.data.template
        }
      }));

      const { error } = await supabase
        .from('campaigns')
        .insert({
          name: `Campaign ${new Date().toLocaleDateString()}`,
          user_id: '00000000-0000-0000-0000-000000000000',
          nodes: serializableNodes,
          edges: edges,
          is_active: true
        });

      if (error) throw error;
      alert("🚀 Campaign Launched Successfully!");
    } catch (error: any) {
      console.error('Error saving campaign:', error);
      alert(`Failed to launch: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const onNodeDelete = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, [setNodes, setEdges]);

  const onNodeChange = useCallback((id: string, template: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, template },
          };
        }
        return node;
      }),
    );
  }, [setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const actionData = ACTIONS_DATA.find(a => a.id === type);
      if (!actionData) return;

      const newNode: Node = {
        id: `node_${Date.now()}`,
        type: actionData.id === 'sentiment' ? 'sentimentNode' : 'customNode',
        position,
        data: { 
          label: actionData.label,
          icon: actionData.icon,
          color: actionData.color,
          type: type.toUpperCase(), // Normalize type for CustomNode logic
          onDelete: onNodeDelete, 
          onChange: onNodeChange,
          template: ''
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, onNodeDelete, onNodeChange, setNodes],
  );

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50">
      <header className="h-16 border-b bg-white flex items-center justify-between px-8 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-vibrant shadow-md" />
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">Campaign Canvas</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Drag nodes to build sequence</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest">Discard</button>
          <button 
            onClick={saveCampaign}
            disabled={isSaving}
            className="btn-primary !text-[11px] !px-6 !py-2.5 uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
            {isSaving ? 'Launching...' : 'Launch Flow'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" ref={reactFlowWrapper}>
        <Sidebar />
        <div className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-slate-50"
          >
            <Background color="#cbd5e1" gap={20} />
            <Controls />
            <MiniMap nodeStrokeWidth={3} zoomable pannable />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
