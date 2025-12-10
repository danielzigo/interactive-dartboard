import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';

type Variant = 'slate' | 'blue' | 'cyan' | 'violet' | 'amber' | 'red';
type Size = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: Variant;
  size?: Size;
  active?: boolean;
  asToggle?: boolean;
  block?: boolean;
  iconLeft?: React.ReactNode;
  iconActive?: React.ReactNode; // Icon to show when active
  className?: string;
  disabled?: boolean;
};

const sizeCls: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
};

// Active state colors - saturated and bright (from your palette)
const activeBg: Record<Variant, string> = {
  slate: 'bg-[#475569]', // Neutral
  blue: 'bg-[#2563EB]', // Primary blue
  cyan: 'bg-[#0E7490]', // Practice (cyan)
  violet: 'bg-[#7C3AED]', // 501 Game (violet)
  amber: 'bg-amber-600',
  red: 'bg-red-600',
};

// Inactive state colors - muted/desaturated versions (from your palette)
const inactiveBg: Record<Variant, string> = {
  slate: 'bg-[#334155] hover:bg-[#475569]', // Neutral (darkest to middle)
  blue: 'bg-[#1D4ED8] hover:bg-[#2563EB]', // Blue (darker to active)
  cyan: 'bg-[#164E63] hover:bg-[#155E75]', // Cyan (darkest to middle)
  violet: 'bg-[#6D28D9] hover:bg-[#7C3AED]', // Violet (darker to active)
  amber: 'bg-amber-700/80 hover:bg-amber-600/90',
  red: 'bg-red-700/80 hover:bg-red-600/90',
};

// Subtle shadow glow (only background)
const shadowGlow: Record<Variant, string> = {
  slate: '0 4px 14px 0 rgba(100, 116, 139, 0.25)',
  blue: '0 4px 14px 0 rgba(37, 99, 235, 0.35)',
  cyan: '0 4px 14px 0 rgba(14, 116, 144, 0.35)', // Cyan glow
  violet: '0 4px 14px 0 rgba(124, 58, 237, 0.35)', // Violet glow
  amber: '0 4px 14px 0 rgba(245, 158, 11, 0.35)',
  red: '0 4px 14px 0 rgba(239, 68, 68, 0.35)',
};

// Lighter border colors for inactive state (simulating raised button) - more visible
const borderColor: Record<Variant, string> = {
  slate: 'rgba(148, 163, 184, 0.5)', // slate-400 with transparency
  blue: 'rgba(96, 165, 250, 0.5)', // blue-400 with transparency
  cyan: 'rgba(34, 211, 238, 0.4)', // cyan-400 with transparency
  violet: 'rgba(167, 139, 250, 0.5)', // violet-400 with transparency
  amber: 'rgba(251, 191, 36, 0.5)', // amber-400 with transparency
  red: 'rgba(248, 113, 113, 0.5)', // red-400 with transparency
};

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'slate',
  size = 'md',
  active = false,
  asToggle = false,
  block = false,
  iconLeft,
  iconActive,
  className,
  disabled,
}: Readonly<ButtonProps>) {
  const prefersReduced = useReducedMotion();
  const [focused, setFocused] = useState(false);

  // Simple, clean animations
  const variants = {
    rest: {
      y: 0,
      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      transition: { duration: prefersReduced ? 0 : 0.18 },
    },
    hover: {
      y: -2,
      boxShadow: active ? shadowGlow[variant] : '0 4px 8px 0 rgba(0, 0, 0, 0.15)',
      transition: { duration: prefersReduced ? 0 : 0.2 },
    },
    tap: {
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.1 },
    },
  };

  // Active state gets subtle pulsing shadow, no border (pressed down)
  // Inactive state gets darker border (raised button)
  const activeStyle = active
    ? {
        boxShadow: shadowGlow[variant],
        animation: 'pulse-shadow 2s ease-in-out infinite',
      }
    : {
        borderBottom: `3px solid ${borderColor[variant]}`,
      };

  // Use variant color in both states - just different intensities
  const baseClasses = active
    ? clsx(activeBg[variant], 'text-white')
    : clsx(inactiveBg[variant], 'text-white');

  // Choose which icon to show
  const displayIcon = active && iconActive ? iconActive : iconLeft;

  return (
    <motion.button
      type={type}
      tabIndex={disabled ? -1 : 0}
      initial="rest"
      // On hover (mouse interaction)
      whileHover={!disabled ? 'hover' : undefined}
      whileTap={!disabled ? 'tap' : undefined}
      // On focus (keyboard interaction)
      animate={focused ? 'hover' : 'rest'}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      variants={variants}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={asToggle ? active : undefined}
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center gap-2 font-semibold',
        'transition-colors duration-200 hover:cursor-pointer',
        // Focus (accessibility)
        'focus-visible:outline-2 focus-visible:outline-gray-400 focus-visible:outline-offset-2',
        // Size
        sizeCls[size],
        block && 'w-full',
        // Colors
        baseClasses,
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={{
        willChange: 'transform',
        ...activeStyle,
      }}
    >
      {displayIcon && (
        <span aria-hidden className="flex items-center">
          {displayIcon}
        </span>
      )}
      <span>{children}</span>
    </motion.button>
  );
}
