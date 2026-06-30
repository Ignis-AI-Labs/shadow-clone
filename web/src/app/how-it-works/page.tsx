import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  MessageSquare,
  Zap,
  Layers,
  ClipboardList,
  FolderTree,
  Eye,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How it works · Shadow Clone',
  description:
    'Understand the wave system, the Record Keeper, and why Shadow Clone is built the way it is — so nothing the AI does surprises you.',
};

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2.5 text-xl font-semibold text-slate-900">
      <Icon className="h-5 w-5 text-slate-500" aria-hidden />
      {children}
    </h2>
  );
}

export default function HowItWorks() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 rounded-sm"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All tools
        </Link>
      </div>

      <header className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          How Shadow Clone works
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Read this once and nothing the AI does will surprise you. When you watch
          it spin up &ldquo;waves&rdquo; and write files to a <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-base">.waves/</code>{' '}
          folder, you&rsquo;ll know exactly why — and that it&rsquo;s working as intended.
        </p>
      </header>

      <div className="space-y-12">
        {/* Mental model */}
        <section className="space-y-3">
          <SectionHeading icon={MessageSquare}>It&rsquo;s prompts, not magic</SectionHeading>
          <p className="text-slate-700">
            Shadow Clone doesn&rsquo;t run any code or control your computer. Every tool here
            generates a carefully written <strong>prompt</strong> — a set of instructions. You
            paste that prompt into your AI (Claude, ChatGPT, Gemini, anything), and the{' '}
            <em>AI</em> does the work by following the methodology the prompt describes.
          </p>
          <p className="text-slate-700">
            Think of it as handing your AI a professional playbook. The playbook tells it how an
            expert team would approach your task — how to plan, how to split the work, how to check
            its own quality. The AI reads the playbook and acts it out.
          </p>
          <div className="rounded-lg border border-slate-200 bg-white p-4 font-mono text-sm text-slate-700">
            You fill in a form → Shadow Clone builds a prompt → you paste it into your AI → the AI
            follows the playbook and produces the work.
          </div>
        </section>

        {/* Two execution models */}
        <section className="space-y-4">
          <SectionHeading icon={Zap}>Two ways the AI works</SectionHeading>
          <p className="text-slate-700">
            Every tool runs in one of two modes. The tool page tells you which, and the{' '}
            &ldquo;What happens after you paste this&rdquo; panel spells out the details.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                <Zap className="h-3.5 w-3.5" aria-hidden /> Single-shot expert
              </div>
              <p className="text-sm text-amber-900/90">
                One AI expert handles one focused job in a single pass. The answer appears right in
                the chat. Used by <strong>Quick Fix</strong>, <strong>Brief a Specialist</strong>,{' '}
                <strong>Review Files</strong>, and <strong>Write Tests</strong>.
              </p>
            </div>
            <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 p-4">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-800">
                <Layers className="h-3.5 w-3.5" aria-hidden /> Multi-wave workflow
              </div>
              <p className="text-sm text-indigo-900/90">
                The AI coordinates several rounds of work, writing documents to disk as it goes.
                Bigger and more thorough. Used by <strong>Plan a Project</strong> (and the larger
                orchestration tools coming next).
              </p>
            </div>
          </div>
        </section>

        {/* Wave system */}
        <section className="space-y-3">
          <SectionHeading icon={Layers}>The wave system</SectionHeading>
          <p className="text-slate-700">
            A <strong>wave</strong> is one round of coordinated work. Multi-wave tools run waves{' '}
            <em>in sequence</em> — each wave finishes and hands its results to the next. This is
            the part that looks dramatic when you watch it, so here&rsquo;s the shape of it:
          </p>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <ol className="relative space-y-5 border-l-2 border-slate-200 pl-6">
              <li className="relative">
                <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-semibold text-white" aria-hidden>0</span>
                <h3 className="text-sm font-semibold text-slate-900">Wave 0 — Planning</h3>
                <p className="mt-0.5 text-sm text-slate-600">
                  Always first. The AI sets objectives, breaks down the work, and decides who does
                  what. Nothing gets built until the plan exists.
                </p>
              </li>
              <li className="relative">
                <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-semibold text-white" aria-hidden>N</span>
                <h3 className="text-sm font-semibold text-slate-900">Waves 1, 2, 3… — Doing the work</h3>
                <p className="mt-0.5 text-sm text-slate-600">
                  Each wave tackles a phase. The AI can simulate up to 10 specialist agents working
                  together in a single wave (a frontend dev, a security reviewer, a tester, and so
                  on). Waves run one after another so later work builds on earlier results.
                </p>
              </li>
              <li className="relative">
                <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-slate-400 text-[10px] font-semibold text-white" aria-hidden>✓</span>
                <h3 className="text-sm font-semibold text-slate-900">Final wave — Validation</h3>
                <p className="mt-0.5 text-sm text-slate-600">
                  The last wave checks the work: tests, security, documentation, and a summary of
                  what was produced.
                </p>
              </li>
            </ol>
          </div>
          <p className="text-sm text-slate-600">
            If a wave needs more than 10 agents, it splits into sub-waves named{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">1a</code>,{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">1b</code>,{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">1c</code> that run
            back to back. Same idea, just more hands.
          </p>
        </section>

        {/* Record Keeper */}
        <section className="space-y-3">
          <SectionHeading icon={ClipboardList}>The Record Keeper</SectionHeading>
          <p className="text-slate-700">
            Every wave has exactly one <strong>Record Keeper</strong> — a single coordinator the AI
            role-plays. The Record Keeper assigns the tasks, collects the results, resolves
            disagreements, and writes down the decisions.
          </p>
          <p className="text-slate-700">
            Why exactly one? Because a single coordinator means no conflicting instructions and a
            clear chain of decisions. When you see the AI talking about &ldquo;the Record Keeper
            assigning tasks&rdquo; or &ldquo;reporting to the Record Keeper,&rdquo; that&rsquo;s the
            coordination layer doing its job — not the AI getting lost.
          </p>
        </section>

        {/* .waves directory */}
        <section className="space-y-3">
          <SectionHeading icon={FolderTree}>Where your work lands</SectionHeading>
          <p className="text-slate-700">
            Multi-wave tools write their output to a <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-base">.waves/</code>{' '}
            folder in your project, one subfolder per wave. You&rsquo;ll see files appear there as
            the AI works — that&rsquo;s your deliverables being saved, not clutter:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 font-mono text-xs text-slate-700">
{`.waves/
├── wave-0/
│   └── deliverables/
│       └── PROJECT_FOUNDATION.md   ← goals, scope, constraints
├── wave-1/
│   └── deliverables/
│       └── TECHNICAL_RESEARCH.md   ← stack & approach, with reasoning
└── wave-2/
    └── deliverables/
        └── MASTER_PLAN.md          ← the step-by-step build roadmap`}
          </pre>
          <p className="text-sm text-slate-600">
            The exact files depend on the tool — each tool page lists what it produces. Everything
            stays inside <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">.waves/</code>{' '}
            so it never mixes with your real source code.
          </p>
        </section>

        {/* Why this architecture */}
        <section className="space-y-3">
          <SectionHeading icon={Layers}>Why it&rsquo;s built this way</SectionHeading>
          <ul className="space-y-3">
            {[
              ['Waves run in order so context compounds.', 'Each phase builds on the last instead of everyone guessing at once. The plan informs the build; the build informs the tests.'],
              ['One Record Keeper per wave prevents chaos.', 'A single coordinator means decisions are consistent and traceable — no two agents pulling in opposite directions.'],
              ['Outputs are isolated in .waves/.', 'Your real code is never touched by accident. You review the deliverables, then decide what to apply.'],
              ['It mirrors how good human teams work.', 'Plan, divide, build, review, document. The structure is familiar on purpose — which is exactly why the results are easy to trust.'],
            ].map(([title, body]) => (
              <li key={title} className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* What you'll see */}
        <section className="space-y-3">
          <SectionHeading icon={Eye}>What you&rsquo;ll see when you run it</SectionHeading>
          <p className="text-slate-700">
            For a multi-wave tool like <strong>Plan a Project</strong>, after you paste the prompt
            the AI will, in order:
          </p>
          <ol className="list-inside list-decimal space-y-1.5 text-slate-700 marker:text-slate-400">
            <li>Announce it&rsquo;s entering Wave 0 and set up the plan.</li>
            <li>Create the <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">.waves/</code> folder and write the first deliverable.</li>
            <li>Move through each wave, narrating what the Record Keeper and agents are doing.</li>
            <li>Save a document at the end of each wave.</li>
            <li>Finish with a summary of everything it produced and where to find it.</li>
          </ol>
          <p className="text-slate-700">
            That stream of &ldquo;Wave 1… Record Keeper… deliverable saved…&rdquo; is the system
            working <em>exactly</em> as designed. Now you know the script before it starts.
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-slate-200 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Browse the tools
        </Link>
      </div>
    </main>
  );
}
