# Design Protocol

> **Source:** Ignis coding-standards `standards/DESIGN.md`, version 2.4.0 (`b19298e`).
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

Apply to everything a person sees or uses: interfaces, CLI output, errors, documents, reports, installers, exports, and AI-written messages. Each surface meets all three, none traded away. Worked example: `neuma/docs/design/interface/design-language.md`.

- **SHINKEI 真計 (*shinkei*, "true measure": 真 true + 計 measure).** Every mark that looks like data measures something real: a gauge gauges, a counter counts, a shown state holds. Decoration may be ambient, never a reading. A missing reading shows `—`, never zero or placeholder. Freeze any frame: numbers agree, scales are true, labels mean what they say.
- **JŌHŌ SEKKEI 情報設計 (*jōhō sekkei*, "information design": 情報 information + 設計 design).** Overview first, then filter, then detail. The top shows what needs the person now, where, how much, and how long it waited. Every count filters to what it counted and back. One severity scale draws priority; urgent items stay in view until settled. Form follows data: share of a whole, value against its limit, change as a labelled trace, setting as label and value.
- **CHOKKAN 直感 (*chokkan*, "intuition": 直 direct + 感 sense).** Anyone, in any language, understands it without being told. Where you are, what you can do, what happens next, and the way back are the plainest things on screen. One decision per moment. Every act answers at once: taken, working, done, or refused with its reason. Nothing waits in silence or acts unseen.
- **Less text, not less data** (JŌHŌ SEKKEI and CHOKKAN; the owner: "The less I have to read to process the same information, the better." "I like all the data."). Every number the person needs stays on screen. One shared legend or unit replaces repeated labels; human names replace codes. Only genuine noise folds, one press away and marked. Density is never decoration. Never ask the person for what the system already knows.
- **Show, don't tell** (the next step, still SHINKEI; the owner: "People are more visual creatures."). Shape, position, colour, and picture speak every language; text only where no mark can, fewest words, once. Lists and tables serve inventory, not status: one mark per fine item, named on hover; only what needs attention opens. Every problem is a door: a press to where it is fixed, or fixed in place; setup is a guided path, not prose. A fix an agent can do is one press to the agent responsible, prompt drafted; the person sees it and stays in command. Artistic, never decorative; one mark or gesture, one meaning, everywhere. Efficient language is efficient code: once, the shortest true way.
- Simplicity never hides the truth: concealing a real state breaks SHINKEI; burying what needs the person breaks JŌHŌ SEKKEI. The builder, not the user, carries the complexity.
- Review every changed surface: readouts real, gaps marked; overview before text; counts filter and return; fine status a mark; each problem a door; every word carries information; next step and way back obvious; each act answers. Then the stranger test: a newcomer who cannot read its language says within seconds what it is for and what to press next. Any failed check: not ready.
