import clsx from 'clsx'
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

export function Glass({
  className,
  strong,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { strong?: boolean; children?: ReactNode }) {
  return (
    <div className={clsx('glass', strong && 'glass-strong', className)} {...rest}>
      {children}
    </div>
  )
}

export function GlassButton({
  className,
  accent,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { accent?: boolean }) {
  return (
    <button className={clsx('glass-btn', accent && 'accent', className)} {...rest}>
      {children}
    </button>
  )
}

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <button
      type="button"
      className={clsx('toggle', on && 'on')}
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
    />
  )
}
