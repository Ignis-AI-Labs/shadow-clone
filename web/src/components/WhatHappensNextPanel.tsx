import { Zap, Layers, FileText, FolderTree, Info } from 'lucide-react';
import type { WhatHappensNext } from '@/lib/prompts';

function ExecutionBadge({ model }: { model: WhatHappensNext['executionModel'] }) {
  const isWave = model === 'wave-based';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        isWave ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      {isWave ? (
        <>
          <Layers className="h-3.5 w-3.5" aria-hidden /> Multi-wave workflow
        </>
      ) : (
        <>
          <Zap className="h-3.5 w-3.5" aria-hidden /> Single-shot expert
        </>
      )}
    </span>
  );
}

function WavesTimeline({ waves }: { waves: NonNullable<WhatHappensNext['waves']> }) {
  return (
    <ol className="relative space-y-4 border-l-2 border-slate-200 pl-6">
      {waves.map((wave, idx) => (
        <li key={wave.label} className="relative">
          <span
            className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-semibold text-white"
            aria-hidden
          >
            {idx}
          </span>
          <h4 className="text-sm font-semibold text-slate-900">{wave.label}</h4>
          <p className="mt-0.5 text-sm text-slate-600">{wave.purpose}</p>
          {wave.deliverables && wave.deliverables.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {wave.deliverables.map((file) => (
                <span
                  key={file}
                  className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600"
                >
                  <FileText className="h-3 w-3 text-slate-400" aria-hidden />
                  {file}
                </span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

export function WhatHappensNextPanel({ info }: { info?: WhatHappensNext }) {
  if (!info) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">
          What happens after you paste this
        </h2>
        <ExecutionBadge model={info.executionModel} />
      </div>

      <p className="text-sm text-slate-700">{info.summary}</p>

      {info.waves && info.waves.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
            The waves it runs, in order
          </h3>
          <WavesTimeline waves={info.waves} />
        </div>
      )}

      {info.deliverablesDirectory && (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <FolderTree className="h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden />
          <span>
            Outputs land in{' '}
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700">
              {info.deliverablesDirectory}
            </span>
          </span>
        </div>
      )}

      {info.caveat && (
        <div className="mt-4 flex gap-2 rounded-md border border-amber-200 bg-amber-50/70 p-3">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" aria-hidden />
          <p className="text-sm text-amber-900/90">{info.caveat}</p>
        </div>
      )}
    </section>
  );
}
