import Link from 'next/link';
import type { ToolConfig } from '@/lib/prompts';

const CATEGORY_LABELS: Record<string, string> = {
  planning: 'PLANNING',
  review: 'REVIEW',
  fix: 'FIX',
  tests: 'TESTS',
  specialist: 'SPECIALIST',
};

export function ToolCard({ tool }: { tool: ToolConfig }) {
  return (
    <Link
      href={`/tools/${tool.id}`}
      className="group block rounded-lg border border-slate-200 bg-white p-5 transition-colors duration-150 hover:border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        {CATEGORY_LABELS[tool.category] ?? tool.category}
      </div>
      <h3 className="mb-2 text-lg font-medium text-slate-900 group-hover:text-slate-700">
        {tool.label}
      </h3>
      <p className="text-sm text-slate-600">{tool.description}</p>
    </Link>
  );
}
