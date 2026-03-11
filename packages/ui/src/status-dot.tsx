import * as React from 'react'
import { cn } from './utils'

interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: 'active' | 'inactive' | 'error' | 'warning' | 'pending'
}

const statusColors = {
  active: 'bg-green-500',
  inactive: 'bg-gray-400',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  pending: 'bg-blue-500',
}

export function StatusDot({ status, className, ...props }: StatusDotProps) {
  return (
    <span
      className={cn('inline-block h-2 w-2 rounded-full', statusColors[status], className)}
      aria-label={status}
      {...props}
    />
  )
}
