import type { HTMLAttributes } from 'react';

type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';

const sizeClasses: Record<ProgressSize, string> = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: ProgressSize;
  showLabel?: boolean;
  labelFormatter?: (value: number, max: number) => string;
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  labelFormatter,
  className,
  ...rest
}: ProgressProps) {
  const clampedMax = max <= 0 ? 100 : max;
  const clampedValue = Math.max(0, Math.min(value, clampedMax));
  const percentage = (clampedValue / clampedMax) * 100;
  const label =
    labelFormatter?.(clampedValue, clampedMax) ?? `${Math.round((clampedValue / clampedMax) * 100)}%`;
  const baseWrapper = 'flex flex-col gap-1';
  const trackClass = `w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden ${sizeClasses[size]}`;
  const progressClass = [
    'h-full rounded-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-300 ease-out',
    percentage === 100 ? 'rounded-r-full' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={[baseWrapper, className].filter(Boolean).join(' ')} {...rest}>
      <div className={trackClass}>
        <div
          className={progressClass}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={clampedMax}
        />
      </div>
      {showLabel && <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>}
    </div>
  );
}

