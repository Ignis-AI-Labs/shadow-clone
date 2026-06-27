import { Check, X } from 'lucide-react';

interface Props {
  whenToPick?: string[];
  whenNotToPick?: string[];
}

export function WhenToPickCallout({ whenToPick, whenNotToPick }: Props) {
  if (!whenToPick?.length && !whenNotToPick?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {whenToPick && whenToPick.length > 0 && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
          <h3 className="mb-2 text-sm font-semibold text-emerald-900">
            Pick this when
          </h3>
          <ul className="space-y-1.5">
            {whenToPick.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-emerald-900/90">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {whenNotToPick && whenNotToPick.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-700">
            Reach for something else when
          </h3>
          <ul className="space-y-1.5">
            {whenNotToPick.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-slate-600">
                <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
