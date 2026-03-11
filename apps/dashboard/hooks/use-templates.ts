import useSWR from 'swr';
import { apiClient } from '@/lib/api';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  installs: number;
  price: number;
  isFree: boolean;
}

export function useTemplates(category?: string, search?: string) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('q', search);
  const key = `/templates?${params.toString()}`;
  const { data, error, isLoading } = useSWR<Template[]>(key, apiClient.get);
  return { templates: data ?? [], error, isLoading };
}
