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

export function useUsage() {
  const { data, error, isLoading } = useSWR<{
    executions_used: number;
    executions_limit: number;
    tokens_used: number;
    cost_usd: number;
    period_start: string;
    period_end: string;
  }>('/usage/summary', fetcher);
  return { usage: data, error, isLoading };
}

export function useUsageHistory() {
  const { data, error, isLoading } = useSWR<{ daily: Array<{ date: string; executions: number; cost: number }> }>(
    '/usage/history',
    fetcher
  );
  return { history: data?.daily ?? [], error, isLoading };
}
