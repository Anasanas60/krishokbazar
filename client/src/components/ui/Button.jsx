import React from 'react';
import { Link } from 'react-router-dom';

// Simple theme-aware button component using M3 tokens from theme.css
// Props: variant = 'primary' | 'secondary' | 'pill' | 'floating'
// If `to` is provided, renders a Router Link, otherwise a button
export default function Button({ children, variant = 'primary', className = '', to, onClick, type = 'button', ariaLabel, ...rest }) {
  const base = 'inline-flex items-center justify-center font-medium focus:outline-none';
  const variants = {
    primary: 'bg-[var(--md-sys-primary)] text-[var(--md-sys-on-primary)] shadow-sm px-4 py-2 rounded-md hover:opacity-95',
    secondary: 'bg-white text-[var(--md-sys-primary)] border border-[var(--md-sys-primary)] px-4 py-2 rounded-md hover:opacity-95',
    outline: 'bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100',
    danger: 'bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700',
    pill: 'm3-pill px-4 py-2 text-sm font-semibold',
    floating: 'm3-btn-floating px-3 py-2',
  };

  const classes = `${base} ${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel} {...rest}>
      {children}
    </button>
  );
}
