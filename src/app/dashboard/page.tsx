"use client";
import React, { useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Analytics } from '@/components/dashboard/Analytics';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Analytics />
    </div>
  );
}
