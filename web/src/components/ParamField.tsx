'use client';

import type { ParamConfig, ParamValue } from '@/lib/prompts';

interface Props {
  config: ParamConfig;
  value: ParamValue;
  onChange: (value: ParamValue) => void;
  showRequiredHint: boolean;
}

const inputClasses =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200';

export function ParamField({ config, value, onChange, showRequiredHint }: Props) {
  const fieldId = `field-${config.name}`;
  const helperId = `${fieldId}-helper`;
  const stringValue = typeof value === 'string' ? value : '';
  const arrayValueAsString = Array.isArray(value) ? value.join('\n') : stringValue;

  const renderControl = () => {
    if (config.type === 'enum') {
      return (
        <select
          id={fieldId}
          aria-describedby={helperId}
          className={inputClasses}
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
        >
          {!config.required && stringValue === '' && (
            <option value="">-- choose --</option>
          )}
          {config.enumOptions?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (config.type === 'string-array') {
      return (
        <textarea
          id={fieldId}
          aria-describedby={helperId}
          className={`${inputClasses} font-mono`}
          rows={5}
          placeholder={config.placeholder}
          value={arrayValueAsString}
          onChange={(e) => onChange(e.target.value.split('\n'))}
        />
      );
    }

    if (config.type === 'code') {
      return (
        <textarea
          id={fieldId}
          aria-describedby={helperId}
          className={`${inputClasses} font-mono`}
          rows={8}
          placeholder={config.placeholder}
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }

    const shouldUseTextarea =
      config.description.length > 80 ||
      config.label.toLowerCase().startsWith('describe') ||
      config.label.toLowerCase().includes('what should') ||
      config.label.toLowerCase().includes('extra context') ||
      config.label.toLowerCase().includes('want to build');

    if (shouldUseTextarea) {
      return (
        <textarea
          id={fieldId}
          aria-describedby={helperId}
          className={inputClasses}
          rows={4}
          placeholder={config.placeholder}
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }

    return (
      <input
        id={fieldId}
        type="text"
        aria-describedby={helperId}
        className={inputClasses}
        placeholder={config.placeholder}
        value={stringValue}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-slate-900">{config.label}</span>
        {showRequiredHint && (
          <span className="text-xs font-medium text-rose-600">required</span>
        )}
      </label>
      <p className="text-xs text-slate-600">{config.description}</p>
      {renderControl()}
      {config.helperText && (
        <p id={helperId} className="text-xs text-slate-500">
          {config.helperText}
        </p>
      )}
      {config.type === 'string-array' && !config.helperText && (
        <p id={helperId} className="text-xs text-slate-500">
          One {config.arrayItemLabel ?? 'item'} per line.
        </p>
      )}
    </div>
  );
}
