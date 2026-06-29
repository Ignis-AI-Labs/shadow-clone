# Tasks — Frontend (Web UI at `web/`)

**Last updated:** 2026-06-29

The frontend lives at `web/` — a Next.js 16 App Router app that serves as
the onboarding / marketing surface for Shadow Clone. With the pivot to the
`/sc-*` slash-command plugin as the primary delivery channel, the web UI's
role shifts toward:

- showing what Shadow Clone is and how to install it
- letting visitors browse the prompt content read-only
- providing a fallback "fill-in-the-blanks → copy prompt" path for users
  who don't have Claude Code installed

## How to Claim a Task
Edit this file on `dev`. Put your handle in the **Assignee** column, flip status to `[~]`, push the claim commit **before** writing implementation code (see [`protocols/Multi Agent Protocol.md`](./protocols/Multi%20Agent%20Protocol.md)).

| Status | ID | Task | Assignee | Claimed | Depends on | Notes |
|---|---|---|---|---|---|---|
| [x] | F-P2-01 | V1 web UI scaffold — landing grid + 5 tool pages with form, live preview, clipboard copy, Open-in-AI dropdown, advanced raw-template editor | @eli | 2026-06-08 | — |  |
| [x] | F-P2-05 | Walkthrough UX — per-tool "Pick this when" callouts, one-click examples, "What happens after you paste this" panel with wave timeline, `/how-it-works` page | @eli | 2026-06-15 | F-P2-01 |  |
| [x] | F-P2-06 | Local launcher (`npx @shadow-clone/web`) — static export + `bin/shadow-clone.js`; `vercel.json` for hosted path | @eli | 2026-06-15 | F-P2-01 |  |
| [ ] | F-P2-02 | Reframe site around the slash-command plugin — landing leads with `bash bridge/install.sh`, tool pages serve as a discovery / reference catalog rather than a primary surface | - | - | F-P2-01 |  |
| [ ] | F-P2-03 | Deploy V1 to Vercel under `shadow-clone.ignislabs.ai` | - | - | F-P2-01 |  |
| [ ] | F-P2-04 | Save / share form values via URL query params (link reproduces a pre-filled form) | - | - | F-P2-01 |  |
| [ ] | F-P2-07 | Add the missing `/sc-*` modes to the UI catalog (sprint, roadmap, refactor, debug, optimize, research, audit, test-audit, echo) | - | - | F-P2-02 |  |
| [ ] | F-P3-01 | Community prompt gallery — user-submitted prompt variants ranked by usefulness | - | - | F-P2-07 |  |
| [ ] | F-P3-02 | Per-tool examples gallery — curated "here's a real prompt that worked" cases | - | - | F-P2-01 |  |

## Summary

| Category | Total | Done | Open |
|---|---|---|---|
| V1 scaffold + UX | 3 | 3 | 0 |
| V2 reframe + expansion | 4 | 0 | 4 |
| V3 community | 2 | 0 | 2 |
| **Total** | **9** | **3** | **6** |
