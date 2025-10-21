import React from 'react';

// Accessible Checkbox component
// Props: id, label, checked, disabled, onChange, className
const Checkbox = ({ id, label, checked = false, disabled = false, onChange, className = '' }) => {
  return (
    <label htmlFor={id} className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked)}
        className="sr-only"
        aria-checked={checked}
      />

      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange && onChange(!checked);
          }
        }}
        className={`w-5 h-5 flex items-center justify-center rounded-sm border transition-colors ${checked ? 'bg-[var(--md-sys-primary)] border-[var(--md-sys-primary)] text-white' : 'bg-white/0 border-gray-300'} ${disabled ? 'opacity-60' : 'hover:brightness-95'}`}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>

      {label && <span className="ml-2 text-sm">{label}</span>}
    </label>
  );
};

export default Checkbox;
