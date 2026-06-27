import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-prose px-6 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Tool not found
      </h1>
      <p className="mt-3 text-base text-slate-600">
        The link you followed does not match any tool we ship today.
      </p>
      <p className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Back to all tools
        </Link>
      </p>
    </main>
  );
}
