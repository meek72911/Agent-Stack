import * as React from 'react'
import { cn } from './utils'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }

export function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn('animate-spin rounded-full border-2 border-current border-t-transparent text-primary', sizeMap[size], className)}
      role="status"
      aria-label="Loading"
      {...props}
    />
  )
}
