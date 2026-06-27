'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';

type Target = 'claude' | 'chatgpt' | 'gemini';

const MAX_URL_LEN = 6000;

const buildUrl = (target: Target, prompt: string): string => {
  const encoded = encodeURIComponent(prompt);
  switch (target) {
    case 'claude':
      return `https://claude.ai/new?q=${encoded}`;
    case 'chatgpt':
      return `https://chatgpt.com/?q=${encoded}`;
    case 'gemini':
      return 'https://gemini.google.com/app';
  }
};

const bareUrl = (target: Target): string => {
  switch (target) {
    case 'claude':
      return 'https://claude.ai/new';
    case 'chatgpt':
      return 'https://chatgpt.com/';
    case 'gemini':
      return 'https://gemini.google.com/app';
  }
};

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

async function openIn(target: Target, prompt: string): Promise<{ usedFallback: boolean }> {
  if (target === 'gemini') {
    await copyToClipboard(prompt);
    window.open(bareUrl(target), '_blank', 'noopener,noreferrer');
    return { usedFallback: true };
  }

  const url = buildUrl(target, prompt);
  if (url.length <= MAX_URL_LEN) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return { usedFallback: false };
  }

  await copyToClipboard(prompt);
  window.open(bareUrl(target), '_blank', 'noopener,noreferrer');
  return { usedFallback: true };
}

const TARGETS: { value: Target; label: string; needsPaste: boolean }[] = [
  { value: 'claude', label: 'Claude', needsPaste: false },
  { value: 'chatgpt', label: 'ChatGPT', needsPaste: false },
  { value: 'gemini', label: 'Gemini (copy + paste)', needsPaste: true },
];

export function OpenInAIButton({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleSelect = async (target: Target) => {
    setOpen(false);
    const { usedFallback } = await openIn(target, text);
    if (usedFallback) {
      setToast('Prompt copied to clipboard. Paste it into the new tab to start the chat.');
    } else {
      setToast(null);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors duration-150 hover:border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
      >
        <ExternalLink className="h-4 w-4" aria-hidden />
        <span>Open in AI</span>
        <ChevronDown className="h-4 w-4" aria-hidden />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-slate-200 bg-white py-1 shadow-md"
        >
          {TARGETS.map((t) => (
            <button
              key={t.value}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(t.value)}
              className="block w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:bg-slate-50"
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-md bg-slate-900 px-4 py-2 text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
