export type ParamType =
  | 'string'
  | 'enum'
  | 'string-array'
  | 'code';

export type ParamValue = string | string[] | undefined;

export type ToolCategory = 'planning' | 'review' | 'fix' | 'tests' | 'specialist';

export interface EnumOption {
  value: string;
  label: string;
  hint?: string;
}

export interface ParamConfig {
  name: string;
  label: string;
  description: string;
  type: ParamType;
  required: boolean;
  enumOptions?: EnumOption[];
  placeholder?: string;
  helperText?: string;
  defaultValue?: ParamValue;
  arrayItemLabel?: string;
}

export type ParamsRecord = Record<string, ParamValue>;

/** A pre-fillable input set the user can load with one click. */
export interface ToolExample {
  /** Short label shown on the button (e.g., "Null pointer in login flow"). */
  label: string;
  /** One sentence about when this example fits. */
  description?: string;
  /** Values to write into the form for each ParamConfig.name. */
  values: ParamsRecord;
}

/** Describes a single wave for tools that execute as a wave-based workflow. */
export interface WaveDescriptor {
  /** Display label, e.g., "Wave 0 — Planning". */
  label: string;
  /** What this wave actually does in plain English. */
  purpose: string;
  /** Specific files or artifacts this wave writes (paths relative to project root). */
  deliverables?: string[];
}

/** Tells the user what to expect after they paste the assembled prompt. */
export interface WhatHappensNext {
  /** 1-2 sentences. The plain-English summary of the AI's intended behavior. */
  summary: string;
  /** Whether the AI runs as a single-shot expert or coordinates multiple waves. */
  executionModel: 'single-shot' | 'wave-based';
  /** For wave-based tools: the sequence of waves the AI will execute. */
  waves?: WaveDescriptor[];
  /** Where deliverables land on disk (e.g., ".waves/wave-0/deliverables/PROJECT_FOUNDATION.md"). */
  deliverablesDirectory?: string;
  /** A short "what NOT to expect" caveat, e.g., "No code is written in planning mode." */
  caveat?: string;
}

export interface ToolConfig {
  id: string;
  label: string;
  description: string;
  category: ToolCategory;
  params: ParamConfig[];
  assemblePrompt: (params: ParamsRecord) => string;

  /** Plain-English bullet list: when this tool is the right pick. */
  whenToPick?: string[];
  /** Optional inverse: when this is NOT the right pick (steer users away from misuse). */
  whenNotToPick?: string[];
  /** Concrete pre-fillable input sets the user can load with one click. */
  examples?: ToolExample[];
  /** Expectation-setting for what the AI will do after the prompt is pasted. */
  whatHappensNext?: WhatHappensNext;
}
