import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';

async function fetcher<T>(endpoint: string): Promise<T> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const res = await fetch(`/api/v1${endpoint}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

export function useExecutions(limit = 10) {
  const { data, error, isLoading, mutate } = useSWR<any>(`/executions?limit=${limit}`, fetcher);
  return { 
    executions: data?.executions ?? [], 
    total: data?.total ?? 0,
    error, 
    isLoading, 
    mutate 
  };
}

export function useExecution(id: string) {
  const { data, error, isLoading } = useSWR<any>(id ? `/executions/${id}` : null, fetcher);
  return { 
    execution: data?.execution, 
    steps: data?.steps ?? [],
    tool_calls: data?.tool_calls ?? [],
    error, 
    isLoading 
  };
}
