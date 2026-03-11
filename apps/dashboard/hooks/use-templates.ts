import useSWR from 'swr';
import { api } from '@/lib/api';

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
  const fetcher = async (url: string): Promise<Template[]> => {
    const result = await api.get<Template[]>(url);
    return result.data ?? [];
  };
  const { data, error, isLoading } = useSWR<Template[]>(key, fetcher);
  return { templates: data ?? [], error, isLoading };
}
