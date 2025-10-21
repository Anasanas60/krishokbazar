import React from 'react';

// Flexible Input component supporting icon, textarea, select and error state.
// Props:
// - as: 'input' | 'textarea' | 'select'
// - options: array of { value, label } used when as='select'
// - icon: React element placed as a leading icon (absolute)
// - wrapperClassName: additional class for outer wrapper
export default function Input({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  className = '',
  as = 'input',
  options = [],
  icon = null,
  wrapperClassName = '',
  name,
  ...rest
}) {
  const controlClass = `px-4 py-2 rounded-md bg-white/8 border border-transparent focus:border-[var(--md-sys-primary)] focus:ring-2 focus:ring-[var(--md-sys-primary)] focus:ring-opacity-20 outline-none transition placeholder-white/70 ${icon ? 'pl-10' : ''}`;

  const renderControl = () => {
    if (as === 'textarea') {
      return (
        <textarea id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`${controlClass} ${className}`} {...rest} />
      );
    }

    if (as === 'select') {
      return (
        <select id={id} name={name} value={value} onChange={onChange} className={`${controlClass} ${className}`} {...rest}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }

    // default input
    return (
      <input id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className={`${controlClass} ${className}`} {...rest} />
    );
  };

  return (
    <div className={`flex flex-col ${wrapperClassName}`}>
      {label && <label htmlFor={id} className="text-sm mb-1">{label}</label>}

      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        {renderControl()}
      </div>

      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
