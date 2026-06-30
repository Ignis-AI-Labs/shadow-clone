'use client';

import { useState } from 'react';
import { Check, Clipboard } from 'lucide-react';

interface Props {
  text: string;
  label?: string;
  variant?: 'primary' | 'secondary';
}

const primaryClasses =
  'bg-slate-900 text-white hover:bg-slate-700 focus-visible:ring-slate-400';
const secondaryClasses =
  'bg-white border border-slate-300 text-slate-900 hover:border-slate-900 focus-visible:ring-slate-300';

async function fallbackCopy(text: string): Promise<boolean> {
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

export function CopyButton({ text, label = 'Copy prompt', variant = 'primary' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        ok = true;
      } else {
        ok = await fallbackCopy(text);
      }
    } catch {
      ok = await fallbackCopy(text);
    }

    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const classes = variant === 'primary' ? primaryClasses : secondaryClasses;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 ${classes}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-400" aria-hidden />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Clipboard className="h-4 w-4" aria-hidden />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
