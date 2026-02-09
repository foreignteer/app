import { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        {
          'bg-primary/10 text-primary': variant === 'primary',
          'bg-accent/10 text-accent-dark': variant === 'secondary',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'danger',
          'bg-blue-100 text-blue-800': variant === 'info',
          'bg-gray-100 text-text-secondary': variant === 'default',
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-0.5 text-sm': size === 'md',
          'px-3 py-1 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Dot Badge variant for status indicators
export function DotBadge({
  variant = 'default',
  children,
  className,
}: {
  variant?: BadgeProps['variant'];
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 text-sm', className)}>
      <span
        className={clsx('w-2 h-2 rounded-full', {
          'bg-primary': variant === 'primary',
          'bg-accent-dark': variant === 'secondary',
          'bg-green-500': variant === 'success',
          'bg-yellow-500': variant === 'warning',
          'bg-red-500': variant === 'danger',
          'bg-blue-500': variant === 'info',
          'bg-gray-500': variant === 'default',
        })}
      />
      {children}
    </span>
  );
}
