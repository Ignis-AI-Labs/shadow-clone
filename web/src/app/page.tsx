import Link from 'next/link';
import { tools } from '@/lib/prompts';
import { ToolCard } from '@/components/ToolCard';

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <section className="mb-12 max-w-prose">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Shadow Clone
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Free, open prompt macros that turn any AI into a focused expert.
        </p>
        <p className="mt-4 text-base text-slate-600">
          Pick a tool, fill in plain-English details, and copy the assembled prompt — or send it straight to Claude, ChatGPT, or Gemini. No install, no login, no API key.
        </p>
        <p className="mt-4 text-sm text-slate-600">
          New here?{' '}
          <Link href="/how-it-works" className="font-medium text-slate-900 underline hover:text-slate-700">
            Read how it works
          </Link>{' '}
          — the wave system, what each tool does, and what to expect after you paste a prompt.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Tools</h2>
          <span className="text-sm text-slate-500">
            {tools.length} available
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-slate-200 pt-6 text-sm text-slate-500">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>
            Built by{' '}
            <a
              className="text-slate-700 underline hover:text-slate-900"
              href="https://ignislabs.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ignis AI Labs
            </a>
            .
          </p>
          <p>
            <Link href="/" className="hover:text-slate-900">
              MIT licensed · open source
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
