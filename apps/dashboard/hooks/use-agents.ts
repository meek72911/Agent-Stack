import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import type { Agent } from '@/types/agent';

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

export function useAgents(category?: string) {
  const endpoint = category ? `/agents?category=${category}` : '/agents';
  const { data, error, isLoading, mutate } = useSWR<{ agents: Agent[]; total: number }>(
    endpoint,
    fetcher
  );
  return { agents: data?.agents ?? [], total: data?.total ?? 0, error, isLoading, mutate };
}

export function useAgent(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Agent>(
    id ? `/agents/${id}` : null,
    fetcher
  );
  return { agent: data, error, isLoading, mutate };
}
