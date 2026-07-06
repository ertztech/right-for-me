# NextMove UX Notes

## Brand Adjectives

NextMove should feel clear, calm, practical, focused, encouraging, modern, and trustworthy.

## Current UX Strengths

- The app has a coherent local-first workflow across Dashboard, Opportunity Review, Application Studio, Tracker, Profile / Story Bank, and Settings.
- Demo data makes the product easier to inspect without manual setup.
- Application Studio now gathers status, job details, fit review, job intelligence, resume draft, cover letter draft, and notes around one selected opportunity.
- The visual system is restrained and work-focused, which fits a career operating system better than a loud marketing-style interface.
- Action feedback gives important clicks visible working, success, and failure states.

## Current UX Friction

- The page still contains several older builder surfaces below the primary workflow, so new users may not immediately know which workspace is the current path.
- Application Studio has many useful sections, but dense text blocks can still require scanning effort.
- Packet readiness was previously implicit; users had to infer what was complete from scattered fields.
- Some generated content areas can feel similar because resume, cover letter, and notes use comparable editor patterns.
- Empty states need to keep explaining what to do next, especially for early-stage opportunities.

## Application Studio Modernization Opportunities

- Lead with a clear selected-opportunity header showing role, company, status, and readiness.
- Keep the readiness checklist near the top so users immediately understand what is complete and what remains.
- Group the packet into recognizable cards: readiness, status, snapshot, fit review, job intelligence, resume, cover letter, and notes.
- Keep copy and save actions close to the content they affect.
- Make seeded records demonstrate different states: mostly complete, partial, and early-stage.

## Visual Hierarchy Opportunities

- Use the selected role title as the strongest in-workspace signal.
- Use compact status/readiness cards for quick scanning.
- Keep long generated drafts in scrollable previews so they are visible without dominating the whole page.
- Use consistent card boundaries and spacing to make each packet section feel intentional.

## Navigation And Action Clarity Opportunities

- Keep Dashboard, Tracker, and Opportunity Review links visible from Application Studio.
- Preserve direct Studio links from Dashboard and Tracker cards.
- Distinguish review actions, copy actions, and save actions by placing them near the relevant section.
- Continue tightening labels around application submission and follow-up so the next step is obvious.

## Empty State Opportunities

- Missing resume and cover letter drafts should explain how to create or save content.
- Missing fit review should point the user back to the Apply / Maybe / Skip decision.
- Missing follow-up should communicate that it is optional until an application is submitted or scheduled.
- Early-stage demo records should show incomplete checklist items without looking broken.

## Implementation Risks

- Adding too much structure could make the static app feel heavier than the current MVP needs.
- Checklist state should stay small and attached to the existing job record to avoid inventing a second packet model.
- Derived checklist items must stay synchronized with existing fields after edits, generation, demo load, and demo clear.
- Hidden route sections remain mounted in the DOM, so event handlers should be scoped by data attributes and existing forms.

## Recommended Next Design Improvements

- Add a dedicated packet export / print preview once the packet structure stabilizes.
- Consider a compact left-side section index inside Application Studio if the workspace grows further.
- Clarify which actions are primary at each application stage: review, draft, apply, follow up, interview.
- Review the older standalone resume, cover letter, and packet panels below the primary workflow and decide whether to fold them into the main workspace.
- Add a lightweight backup/export flow for localStorage data before public beta.

## Text-Only Brand / Logo Exploration

1. Arrow / forward motion concept: a simple forward arrow integrated into the `N` or placed after the wordmark to signal momentum and the next step.
2. Compass / next step concept: a minimal compass point or directional mark that suggests orientation, decision-making, and calm guidance.
3. Path / career journey concept: a clean line path with one bend or waypoint, representing movement from opportunity review to application action.
4. Document packet / application system concept: a subtle stacked-document mark paired with a small forward cue, connecting materials, tracking, and readiness.
5. Simple wordmark direction: a confident `NextMove` wordmark with understated weight contrast, no icon required, emphasizing clarity and trust.

