'use client';

import type { ParamConfig, ParamsRecord, ParamValue } from '@/lib/prompts';
import { ParamField } from './ParamField';

interface Props {
  params: ParamConfig[];
  values: ParamsRecord;
  onChange: (name: string, value: ParamValue) => void;
  missingRequired: string[];
}

export function ToolForm({ params, values, onChange, missingRequired }: Props) {
  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      {params.map((param) => (
        <ParamField
          key={param.name}
          config={param}
          value={values[param.name]}
          onChange={(value) => onChange(param.name, value)}
          showRequiredHint={missingRequired.includes(param.name)}
        />
      ))}
    </form>
  );
}
