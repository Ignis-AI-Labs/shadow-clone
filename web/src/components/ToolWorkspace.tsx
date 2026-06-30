'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';
import {
  getToolById,
  type ParamsRecord,
  type ParamValue,
  type ToolConfig,
  type ToolExample,
} from '@/lib/prompts';
import { ToolForm } from './ToolForm';
import { PromptPreview } from './PromptPreview';
import { CopyButton } from './CopyButton';
import { OpenInAIButton } from './OpenInAIButton';
import { AdvancedTemplateEditor } from './AdvancedTemplateEditor';
import { WhenToPickCallout } from './WhenToPickCallout';
import { ExamplesPicker } from './ExamplesPicker';
import { WhatHappensNextPanel } from './WhatHappensNextPanel';

const isEmpty = (v: ParamValue): boolean => {
  if (v === undefined || v === null) return true;
  if (typeof v === 'string') return v.trim().length === 0;
  if (Array.isArray(v)) return v.filter((s) => s.trim().length > 0).length === 0;
  return false;
};

const initialValues = (tool: ToolConfig): ParamsRecord =>
  Object.fromEntries(
    tool.params.map((p) => [
      p.name,
      p.defaultValue ?? (p.type === 'string-array' ? [] : ''),
    ])
  );

export function ToolWorkspace({ toolId }: { toolId: string }) {
  const tool = getToolById(toolId);
  if (!tool) notFound();

  return <ToolWorkspaceInner tool={tool} />;
}

function ToolWorkspaceInner({ tool }: { tool: ToolConfig }) {
  const [values, setValues] = useState<ParamsRecord>(() => initialValues(tool));
  const [overridePrompt, setOverridePrompt] = useState<string | null>(null);

  const handleChange = useCallback((name: string, value: ParamValue) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const loadExample = useCallback(
    (example: ToolExample) => {
      setOverridePrompt(null);
      setValues({ ...initialValues(tool), ...example.values });
    },
    [tool]
  );

  const assembledPrompt = useMemo(
    () => tool.assemblePrompt(values),
    [tool, values]
  );

  const effectivePrompt = overridePrompt ?? assembledPrompt;

  const missingRequired = useMemo(
    () =>
      tool.params
        .filter((p) => p.required)
        .filter((p) => isEmpty(values[p.name]))
        .map((p) => p.name),
    [tool, values]
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 rounded-sm"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All tools
        </Link>
        <Link
          href="/how-it-works"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 rounded-sm"
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          How it works
        </Link>
      </div>

      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {tool.label}
        </h1>
        <p className="mt-2 max-w-prose text-base text-slate-600">
          {tool.description}
        </p>
      </header>

      {(tool.whenToPick || tool.whenNotToPick) && (
        <div className="mb-8">
          <WhenToPickCallout
            whenToPick={tool.whenToPick}
            whenNotToPick={tool.whenNotToPick}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <ExamplesPicker examples={tool.examples} onLoad={loadExample} />
          <h2 className="text-sm font-medium text-slate-900">Fill in the details</h2>
          <ToolForm
            params={tool.params}
            values={values}
            onChange={handleChange}
            missingRequired={missingRequired}
          />
          {missingRequired.length > 0 && (
            <p className="text-xs text-slate-500">
              {missingRequired.length} required field
              {missingRequired.length === 1 ? '' : 's'} still empty. The prompt will still copy, but the AI will likely ask for the missing info.
            </p>
          )}
        </div>

        <div className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          <div className="flex flex-wrap items-center gap-3">
            <CopyButton text={effectivePrompt} />
            <OpenInAIButton text={effectivePrompt} />
          </div>
          <PromptPreview content={effectivePrompt} />
        </div>
      </div>

      {tool.whatHappensNext && (
        <div className="mt-8">
          <WhatHappensNextPanel info={tool.whatHappensNext} />
        </div>
      )}

      <div className="mt-8">
        <AdvancedTemplateEditor
          assembled={assembledPrompt}
          overridePrompt={overridePrompt}
          onChange={setOverridePrompt}
        />
      </div>
    </main>
  );
}
