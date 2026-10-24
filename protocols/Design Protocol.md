# Design Protocol

> **Source:** Ignis coding-standards `standards/DESIGN.md`, version 2.3.1 (`8af3e78`).
> The standard below is copied verbatim (one heading level down); do not edit it here. Change it in
> coding-standards, then copy it again and bump the version above.

Every `/sc` mode applies this to what a person reads or uses: the interfaces and
command-line output it builds, errors and refusals, docs, `.waves/` deliverables,
the final report, and every message to the user. In Shadow Clone that means:

- The final report opens with the overview (what changed, what needs the person,
  the verdict); the detail stays in the `.waves/` files, one link away.
- Never ask the user what the repository already answers: read first, then offer
  concrete choices.

## Design — true, information-first, intuitive

Apply to everything a person sees or uses: interfaces, command-line output, errors and refusals, documents, reports, installers, exports, and messages AI writes to people. Every surface meets all three; none is traded for another. Worked example: Deus Neuma's design language (`neuma/docs/design/interface/design-language.md`).

- **SHINKEI 真計 (*shinkei*, "true measure": 真 true + 計 measure).** Every mark that looks like data measures something real. A gauge gauges, a counter counts, a progress bar tracks real progress, a shown state holds. Decoration may be ambient; it never poses as a reading. A missing reading shows `—`, never a zero or placeholder. Freeze any frame: numbers agree, scales are true, labels mean what they say.
- **JŌHŌ SEKKEI 情報設計 (*jōhō sekkei*, "information design": 情報 information + 設計 design).** A data surface answers by shape before words: overview first, then filter, then detail. Its top shows what needs the person now, where, how much, and how long it waited; text rows are the drill-down. Every count filters to what it counted and offers the way back. Priority is drawn on one severity scale; urgent items stay in view until settled. Form follows the data: a share within its whole, a value against its limit, change as a labelled trace, a setting as label and value.
- **CHOKKAN 直感 (*chokkan*, "intuition": 直 direct + 感 sense).** Anyone, in any language, understands it without being told. Shape, position, and state carry the meaning; words confirm it and never carry it alone. Where you are, what you can do, what happens next, and the way back are the plainest things on screen. Show one decision per moment. One gesture means one thing everywhere. Every act answers at once: taken, working, done, or refused with its reason. Nothing waits in silence or acts unseen.
- **Less text, not less data** (JŌHŌ SEKKEI and CHOKKAN; the owner: "The less I have to read to process the same information, the better." "I like all the data."). Every number the person needs stays on screen; marks (gauges, bars, shade, position, icons) carry what words used to. One shared legend or unit replaces repeated labels; human names replace codes. Only genuine noise folds, one press away and marked. Density is never decoration. Never ask the person for what the system already knows.
- Simplicity never hides the truth: concealing a real state breaks SHINKEI; burying what needs the person breaks JŌHŌ SEKKEI. The complexity is the builder's to carry, never the user's to decode.
- Review every changed surface: each readout is real and its gaps are marked; the overview answers before the text; each count filters and returns; every word carries information; the next step and the way back are obvious; each action shows its result. Then the stranger test: a newcomer who does not read its language says within seconds what it is for and what they would press next. A surface that fails any check is not ready.
