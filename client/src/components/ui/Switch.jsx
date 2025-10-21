import React from 'react';

// Accessible Switch component
// Props: id, checked, onChange, disabled, label
export default function Switch({ id, checked = false, onChange, disabled = false, label }) {
  return (
    <label htmlFor={id} className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange && onChange(e.target.checked)} className="sr-only" disabled={disabled} aria-checked={checked} />

      <span
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange && onChange(!checked);
          }
        }}
        className={`w-11 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-[var(--md-sys-primary)]' : 'bg-gray-300'}`}
      >
        <span className={`block w-4 h-4 bg-white rounded-full shadow transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </span>

      {label && <span className="ml-3 text-sm">{label}</span>}
    </label>
  );
}
