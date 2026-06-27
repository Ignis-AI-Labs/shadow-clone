'use client';

import { CopyButton } from './CopyButton';

interface Props {
  assembled: string;
  overridePrompt: string | null;
  onChange: (value: string | null) => void;
}

export function AdvancedTemplateEditor({ assembled, overridePrompt, onChange }: Props) {
  const value = overridePrompt ?? assembled;
  const isOverridden = overridePrompt !== null;

  return (
    <details className="rounded-lg border border-slate-200 bg-white">
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50">
        Show raw prompt (advanced)
      </summary>
      <div className="space-y-3 border-t border-slate-200 px-4 py-3">
        <p className="text-xs text-slate-600">
          Editing here replaces what the Copy and Open-in-AI buttons send. Reset to go back to form-driven output.
        </p>
        <textarea
          className="h-72 w-full rounded-md border border-slate-300 bg-white p-3 font-mono text-xs text-slate-800 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={!isOverridden}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 transition-colors duration-150 hover:border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
          >
            Reset to template
          </button>
          <CopyButton text={value} label="Copy raw" variant="secondary" />
          {isOverridden && (
            <span className="text-xs text-amber-700">
              Override active — Copy / Open in AI uses this edited version.
            </span>
          )}
        </div>
      </div>
    </details>
  );
}
