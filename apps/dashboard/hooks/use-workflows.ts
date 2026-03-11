import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import type { Workflow } from '@/types/workflow';

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

export function useWorkflows() {
  const { data, error, isLoading, mutate } = useSWR<{ workflows: Workflow[]; total: number }>(
    '/workflows',
    fetcher
  );
  return { workflows: data?.workflows ?? [], total: data?.total ?? 0, error, isLoading, mutate };
}

export function useWorkflow(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Workflow>(
    id ? `/workflows/${id}` : null,
    fetcher
  );
  return { workflow: data, error, isLoading, mutate };
}
