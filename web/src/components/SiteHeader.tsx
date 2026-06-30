import Link from 'next/link';
import { Github } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-slate-900 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-sm"
        >
          Shadow Clone
        </Link>
        <nav className="flex items-center gap-5">
          <Link
            href="/how-it-works"
            className="text-sm text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-sm"
          >
            How it works
          </Link>
          <a
            href="https://github.com/Ignis-AI-Labs/shadow-clone"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-sm"
          >
            <Github className="h-4 w-4" aria-hidden />
            <span>GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
