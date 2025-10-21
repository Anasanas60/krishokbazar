import React from 'react';

// Accessible Radio component
// Props: id, name, label, checked, disabled, onChange
export default function Radio({ id, name, label, checked = false, disabled = false, onChange }) {
  return (
    <label htmlFor={id} className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <input
        id={id}
        type="radio"
        value={id}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.value || id)}
        className="sr-only"
        aria-checked={checked}
      />

      <span
        role="radio"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled) return;
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onChange && onChange(id);
            }

            // Arrow keys: navigate within radio group with same name
            if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
              e.preventDefault();
              try {
                if (!name) return;
                const inputs = Array.from(document.querySelectorAll(`input[type=\"radio\"][name=\"${name}\"]`));
                if (!inputs.length) return;
                const currentIndex = inputs.findIndex((inp) => inp.id === id);
                if (currentIndex === -1) return;

                let nextIndex = currentIndex;
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  nextIndex = (currentIndex + 1) % inputs.length;
                } else {
                  nextIndex = (currentIndex - 1 + inputs.length) % inputs.length;
                }

                const nextInput = inputs[nextIndex];
                if (!nextInput) return;

                // Notify change handler with the id or value of the next input
                onChange && onChange(nextInput.value || nextInput.id);

                // Move focus to the visual radio element for the next input
                const label = nextInput.closest('label') || document.querySelector(`label[for="${nextInput.id}"]`);
                const visual = label && label.querySelector('[role="radio"]');
                if (visual) visual.focus();
              } catch (err) {
                // swallow DOM-related errors in test environments
              }
            }
        }}
        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${checked ? 'bg-[var(--md-sys-primary)] border-[var(--md-sys-primary)] text-white' : 'bg-white/0 border-gray-300'} ${disabled ? 'opacity-60' : 'hover:brightness-95'}`}
      >
        {checked && (
          <span className="w-2 h-2 rounded-full bg-white" />
        )}
      </span>

      {label && <span className="ml-2 text-sm">{label}</span>}
    </label>
  );
}
