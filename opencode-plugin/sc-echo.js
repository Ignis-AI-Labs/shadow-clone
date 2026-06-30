/**
 * Shadow Clone OpenCode plugin — the "other end" of the bidirectional echo review loop.
 *
 * Gives the GLM Builder a first-class `sc_echo_review` tool. When GLM finishes a work
 * unit it calls the tool with a short context note and the changed files; the tool
 * hands the work to the Claude (Opus) Reviewer via the ask-claude.sh bridge and
 * returns Claude's review, which ends in a `VERDICT: APPROVE|REVISE|BLOCK|ERROR`
 * line — ERROR means the bridge could not complete (timeout, missing CLI, lock
 * contention, re-entrancy refusal); surface it to the human, do not loop.
 *
 * This packages the OpenCode end of the loop defined in AGENTS.md Rule 9. The Claude
 * end is the `/sc-echo` slash command plus ask-glm.sh. One law, both directions.
 *
 * The tool delegates to ~/.claude/sc/ask-claude.sh so the review logic (request
 * building, reviewer contract, exchange logging) has a single source of truth and
 * cannot drift between the CLI bridge and this plugin.
 */
import { tool } from "@opencode-ai/plugin";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const BRIDGE = join(homedir(), ".claude", "sc", "ask-claude.sh");

/**
 * OpenCode plugin factory: registers the `sc_echo_review` tool.
 * @param {{ $: Function, directory: string }} ctx - OpenCode plugin context
 *   (`$` is Bun's shell; `directory` is the session's project directory).
 * @returns {Promise<{ tool: { sc_echo_review: object } }>} the plugin's hooks.
 */
export const ScEchoPlugin = async ({ $, directory }) => {
  return {
    tool: {
      sc_echo_review: tool({
        description:
          "Hand the just-completed work unit to the Claude (Opus) Reviewer for an " +
          "independent review against AGENTS.md. Call this after finishing a coherent " +
          "work unit (feature, fix, module, refactor). Returns the review; then act on " +
          "the final 'VERDICT: APPROVE|REVISE|BLOCK|ERROR' line — address every finding " +
          "on REVISE/BLOCK and call again (up to 3 rounds); on ERROR the bridge could " +
          "not complete, so surface the output to the human and do not loop.",
        args: {
          context: tool.schema
            .string()
            .describe("Concise description of what you did and why."),
          files: tool.schema
            .array(tool.schema.string())
            .describe("Paths of every file you created or modified in this work unit."),
        },
        // impure: checks bridge existence on disk and spawns a bash subprocess.
        /**
         * @param {{ context: string, files: string[] }} args   tool arguments
         *   (validated by the schema above). `args.context` is the Builder's
         *   description string — distinct from the `ctx` parameter below.
         * @param {{ directory?: string }} ctx  per-invocation OpenCode context
         *   (named `ctx` to avoid shadowing `args.context`).
         * @returns {Promise<string>} the Reviewer's response text, ending in a
         *   `VERDICT: APPROVE|REVISE|BLOCK|ERROR` line, or an `sc:`-prefixed
         *   error string. ERROR means the bridge could not complete
         *   (timeout, missing CLI, lock contention, re-entrancy refusal) —
         *   the Builder must surface it to the human, not loop on it.
         */
        async execute(args, ctx) {
          // Prefer the per-call directory; fall back to the session directory
          // OpenCode booted the plugin with if the tool context omits it. The
          // optional-chain on ctx survives an SDK that ever calls execute(args).
          const dir = ctx?.directory || directory;

          if (!existsSync(BRIDGE)) {
            return (
              `sc: reviewer bridge not found at ${BRIDGE}. ` +
              "Install the Shadow Clone Claude-side scripts so ~/.claude/sc/ask-claude.sh exists."
            );
          }

          try {
            // Bun's $ escapes every interpolation; the array spreads into separate
            // quoted args. Runs in the session's project directory so the bridge's
            // git diff and AGENTS.md resolve against the right repo.
            return await $`bash ${BRIDGE} ${args.context} ${args.files}`
              .cwd(dir)
              .text();
          } catch (err) {
            const stdout = err?.stdout?.toString?.() ?? "";
            const stderr = err?.stderr?.toString?.() ?? "";
            return `sc: review invocation failed.\n${stdout}\n${stderr}\n${err?.message ?? err}`;
          }
        },
      }),
    },
  };
};
