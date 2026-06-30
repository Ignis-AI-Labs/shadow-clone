import type { ReactNode } from 'react';

interface Props {
  content: string;
  toolbar?: ReactNode;
}

export function PromptPreview({ content, toolbar }: Props) {
  const charCount = content.length;
  const lineCount = content.split('\n').length;

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-2">
        <div className="flex items-baseline gap-3">
          <h2 className="text-sm font-medium text-slate-900">Prompt preview</h2>
          <span className="text-xs text-slate-500">
            {lineCount} lines · {charCount.toLocaleString()} chars
          </span>
        </div>
        {toolbar}
      </header>
      <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-xs text-slate-800">
        {content}
      </pre>
    </section>
  );
}
