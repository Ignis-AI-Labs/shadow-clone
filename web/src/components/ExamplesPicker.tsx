'use client';

import { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import type { ToolExample } from '@/lib/prompts';

interface Props {
  examples?: ToolExample[];
  onLoad: (example: ToolExample) => void;
}

export function ExamplesPicker({ examples, onLoad }: Props) {
  const [loadedLabel, setLoadedLabel] = useState<string | null>(null);

  if (!examples?.length) return null;

  const handleLoad = (example: ToolExample) => {
    onLoad(example);
    setLoadedLabel(example.label);
    window.setTimeout(() => setLoadedLabel((cur) => (cur === example.label ? null : cur)), 2000);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-slate-500" aria-hidden />
        <h3 className="text-sm font-medium text-slate-900">
          Start from an example
        </h3>
      </div>
      <p className="mb-3 text-xs text-slate-600">
        Load a ready-made set of inputs, then tweak it. The fastest way to see what a good prompt looks like.
      </p>
      <div className="flex flex-col gap-2">
        {examples.map((example) => (
          <button
            key={example.label}
            type="button"
            onClick={() => handleLoad(example)}
            className="group flex items-start justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-left transition-colors duration-150 hover:border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            <span>
              <span className="block text-sm font-medium text-slate-900">
                {example.label}
              </span>
              {example.description && (
                <span className="block text-xs text-slate-500">
                  {example.description}
                </span>
              )}
            </span>
            <span className="mt-0.5 flex-shrink-0 text-xs font-medium text-slate-500 group-hover:text-slate-900">
              {loadedLabel === example.label ? (
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <Check className="h-3.5 w-3.5" aria-hidden /> Loaded
                </span>
              ) : (
                'Load'
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
