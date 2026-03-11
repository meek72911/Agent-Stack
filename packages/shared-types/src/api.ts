export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    page: number
    per_page: number
    total_pages: number
  }
}

export interface ApiError {
  error: string
  message: string
  status_code: number
  details?: Record<string, unknown>
}

export interface PaginationParams {
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface ApiKey {
  id: string
  name: string
  key_prefix: string
  last_used_at: string | null
  expires_at: string | null
  scopes: string[]
  created_at: string
}
