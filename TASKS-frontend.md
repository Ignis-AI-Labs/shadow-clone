# Tasks — Frontend (Web UI at `web/`)

**Last updated:** 2026-06-15

The frontend lives at `web/` — a Next.js 16 App Router app that exposes every Shadow Clone prompt macro as a fill-in-the-blanks form, generates the prompt client-side, and copies it to the clipboard (or opens Claude/ChatGPT/Gemini with the prompt prefilled).

## How to Claim a Task
Edit this file on `dev`. Put your handle in the **Assignee** column, flip Status to `[~]`, set the Claimed date, and push the claim commit **before** writing any implementation code (see [`protocols/Multi Agent Protocol.md`](./protocols/Multi%20Agent%20Protocol.md) and the `<claim_before_you_work>` block in `mcp-server/src/prompts/content/agent_core_rules.ts`).

| Status | ID | Task | Assignee | Claimed | Depends on | PR |
|--------|----|------|----------|---------|------------|-----|
| [x] | F-P2-01 | V1 web UI scaffold — landing grid + 5 tool pages (quick_fix, code_review_team, generate_tests, deploy_specialist_agent, shadow_clone_plan) with form, live preview, clipboard copy, Open-in-AI dropdown, and advanced raw-template editor | @eli | 2026-06-08 | -- | -- |
| [x] | F-P2-05 | Walkthrough UX — per-tool "Pick this when" callouts, one-click examples, "What happens after you paste this" panel with wave timeline, and a `/how-it-works` page explaining the wave system + Record Keeper + `.waves/` layout | @eli | 2026-06-15 | F-P2-01 | -- |
| [x] | F-P2-06 | Local launcher (`npx @shadow-clone/web`) — static export + `bin/shadow-clone.js` that serves `out/` and auto-opens the browser; `vercel.json` for hosted path | @eli | 2026-06-15 | F-P2-01 | -- |
| [ ] | F-P2-02 | Wire the remaining 8 MCP tools into the web UI (shadow_clone_orchestrate, deploy_agent_team, execute_single_wave, create_documentation, architecture_consultant, initialize_workspace, check_for_updates, show_commands) | - | - | F-P2-01 | -- |
| [ ] | F-P2-03 | Deploy V1 to Vercel under `shadow-clone.ignislabs.ai` | - | - | F-P2-01 | -- |
| [ ] | F-P2-04 | Save / share user form values via URL query params (so a link reproduces a pre-filled form) | - | - | F-P2-01 | -- |
| [ ] | F-P3-01 | Community prompt gallery — user-submitted prompt variants ranked by usefulness | - | - | F-P2-02 | -- |
| [ ] | F-P3-02 | Per-tool examples gallery — curated "here's a real prompt that worked" cases with the inputs that produced them | - | - | F-P2-01 | -- |

## Summary

| Category | Total | Done | In Progress | Unclaimed |
|----------|-------|------|-------------|-----------|
| V1 scaffold + UX | 3 | 3 | 0 | 0 |
| V2 expansion | 3 | 0 | 0 | 3 |
| V3 community | 2 | 0 | 0 | 2 |
| **Total** | **8** | **3** | **0** | **5** |
