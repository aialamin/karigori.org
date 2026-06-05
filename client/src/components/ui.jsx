/**
 * Shared UI components.
 *
 * FloatInput uses a flex-COLUMN layout (not absolute positioning) so the
 * label and the typed text can NEVER overlap, regardless of browser or value.
 *
 * - When empty + unfocused → label collapses (max-h: 0) and the native
 *   `placeholder` attribute shows the label text inside the input.
 * - When focused OR has value → small label appears above the input text.
 */
import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/* ── Floating label input ─────────────────────────────────────────────── */
export function FloatInput({
  id, label, type = 'text', value, onChange,
  error, icon: Icon, right, required, min, step,
}) {
  const [focused, setFocused] = useState(false);
  const up = focused || String(value ?? '').length > 0;

  return (
    <div>
      <div
        className={[
          'flex border-2 rounded-xl bg-white transition-colors duration-150',
          error   ? 'border-red-400'
          : focused ? 'border-brand-500'
          :           'border-gray-200 hover:border-gray-300',
          up ? 'items-end' : 'items-center',
        ].join(' ')}
      >
        {/* Left icon */}
        {Icon && (
          <div className={`pl-3 shrink-0 ${up ? 'pb-2.5' : ''}`}>
            <Icon className={`w-4 h-4 transition-colors ${focused ? 'text-brand-500' : 'text-gray-400'}`} />
          </div>
        )}

        {/* Label + Input stacked in a column */}
        <div className="flex-1 flex flex-col px-3 min-h-[52px] justify-center py-1">
          {/* Small floating label — animates in/out with max-height */}
          <span
            aria-hidden="true"
            className={[
              'block leading-none select-none pointer-events-none font-bold',
              'transition-all duration-200 overflow-hidden',
              up
                ? 'max-h-4 mb-1.5 opacity-100 text-[10px] text-brand-600'
                : 'max-h-0 mb-0 opacity-0 text-[10px] text-brand-600',
            ].join(' ')}
          >
            {label}{required && <span className="text-red-400"> *</span>}
          </span>

          {/* The actual input */}
          <input
            id={id}
            type={type}
            value={value ?? ''}
            onChange={onChange}
            min={min}
            step={step}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            /* placeholder acts as the label when the field is empty+unfocused */
            placeholder={up ? '' : `${label}${required ? ' *' : ''}`}
            className="text-sm text-gray-900 bg-transparent outline-none w-full placeholder-gray-400"
          />
        </div>

        {/* Right slot (e.g. eye-icon for password) */}
        {right && (
          <div className={`pr-3 shrink-0 ${up ? 'pb-2' : ''}`}>
            {right}
          </div>
        )}
      </div>

      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

/* ── Floating label textarea ──────────────────────────────────────────── */
export function FloatTextarea({
  id, label, value, onChange, error, rows = 4, maxLen = 300,
}) {
  const [focused, setFocused] = useState(false);
  const up = focused || String(value ?? '').length > 0;

  return (
    <div>
      <div className={[
        'flex flex-col border-2 rounded-xl bg-white transition-colors duration-150',
        error   ? 'border-red-400'
        : focused ? 'border-brand-500'
        :           'border-gray-200 hover:border-gray-300',
      ].join(' ')}>
        {/* Small label at top */}
        <span
          aria-hidden="true"
          className={[
            'block mx-3 leading-none select-none pointer-events-none font-bold',
            'transition-all duration-200 overflow-hidden',
            up
              ? 'max-h-4 mt-2.5 mb-1 opacity-100 text-[10px] text-brand-600'
              : 'max-h-0 mt-0 mb-0 opacity-0 text-[10px] text-brand-600',
          ].join(' ')}
        >
          {label}
        </span>

        <textarea
          id={id}
          rows={rows}
          value={value ?? ''}
          onChange={onChange}
          maxLength={maxLen}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={up ? '' : label}
          className="px-3 py-2 text-sm text-gray-900 bg-transparent outline-none resize-none placeholder-gray-400 rounded-xl"
        />

        {/* Character counter */}
        <div className="flex justify-end px-3 pb-2">
          <span className={`text-[10px] ${(value || '').length > maxLen * 0.9 ? 'text-red-400' : 'text-gray-300'}`}>
            {(value || '').length}/{maxLen}
          </span>
        </div>
      </div>

      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

/* ── Pill toggle switch ───────────────────────────────────────────────── */
export function Toggle({ checked, onChange, label, sublabel }) {
  return (
    <div
      className="flex items-center justify-between gap-3 py-1 cursor-pointer select-none group"
      onClick={() => onChange(!checked)}
    >
      <div>
        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
          {label}
        </p>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent',
          'transition-colors duration-200 focus:outline-none',
          checked ? 'bg-brand-600' : 'bg-gray-200',
        ].join(' ')}
      >
        <span
          className={[
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md',
            'ring-0 transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
    </div>
  );
}

/* ── Inline field error ───────────────────────────────────────────────── */
export function FieldError({ children }) {
  return (
    <p className="mt-1.5 text-xs text-red-500 flex items-start gap-1">
      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
      <span>{children}</span>
    </p>
  );
}

/* ── Alert banner ─────────────────────────────────────────────────────── */
export function Alert({ type = 'error', children }) {
  const cfg = {
    error:   { cls: 'bg-red-50 border-red-200 text-red-700',        icon: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> },
    success: { cls: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> },
    warning: { cls: 'bg-amber-50 border-amber-200 text-amber-800',   icon: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> },
    info:    { cls: 'bg-blue-50 border-blue-200 text-blue-700',      icon: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> },
  }[type] ?? {};

  return (
    <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-sm leading-snug ${cfg.cls}`}>
      {cfg.icon}
      <span>{children}</span>
    </div>
  );
}

/* ── Button spinner ───────────────────────────────────────────────────── */
export function Spinner({ label }) {
  return (
    <>
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60 shrink-0" />
      <span>{label}</span>
    </>
  );
}
