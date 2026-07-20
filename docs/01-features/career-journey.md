# Career Journey

## Vision

Career Journey is the guided experience layer that helps someone uncover, organize, and gain confidence in their professional story through an interview-first, chapter-based flow.

## User Problem

Many job seekers know they have relevant experience but struggle to translate it into a clear story. Blank forms feel cold, returning to half-finished setup feels heavy, and the jump from raw experience to useful application material is often too abrupt.

## Product Decision

Career Journey is the experience layer. Career Brain is the durable source of truth.

- Career Journey should guide the user through a memorable, confidence-building starting experience.
- Career Brain should store the durable career data that later powers resumes, application packets, interview prep, and future outputs.
- The product should feel interview-first rather than form-first.

## MVP Direction

The MVP direction is to define and build the first visible shell of the Career Journey experience before adding AI, persistence, or full career-data depth. The near-term goal is a clear experience frame that introduces chapters, progress, and the distinction between first-time and returning-user behavior.

## First-Time User Experience

The first-time experience should feel guided, warm, and high-confidence. A new user should understand that NextMove is helping them uncover their story, not asking them to complete a generic profile setup. The flow should make progress feel meaningful and should introduce chapters as a calm way to move through the journey.

## Returning-User Experience

The returning-user experience should be fast, calm, and non-distracting. Returning users should not be pushed back through onboarding theater. They should land in the right chapter, see progress framing, and quickly resume the most useful next step.

## Chapter-Based Experience Concept

Career Journey should be structured as a sequence of chapters instead of one long intake form. Chapters give the user a sense of movement, reduce overwhelm, and make it easier to pause and return without losing context.

## Early Chapter Sequence

An early planning sequence for the experience is:

1. Welcome and framing
2. Career direction and goals
3. Roles and experiences
4. Achievements and evidence
5. Stories and themes
6. Review and confidence-building summary

This sequence is directional for planning and should stay flexible until the first UI shell is implemented and reviewed.

## Motion Principle

Motion is a reward for progress, not decoration. It should reinforce chapter completion, orientation, and confidence rather than add noise.

## Voice And Tone

Career Journey messaging should feel calm, encouraging, and human.

- It should create progress without pressure.
- Users should not feel they need perfect wording, perfect dates, or a complete career story before continuing.
- Confirmation copy should acknowledge movement, not imply finality.
- It should feel calm, human, encouraging, and story-first.
- It should help users feel safe, understood, and in motion, even when their answers are imperfect or incomplete.

Approved supportive incomplete-state message to preserve:

> You can keep going when you are ready. Chapter 1 is now in motion, even if you are still finding the words.

This wording belongs to an empty or incomplete Chapter 1 attempt. It is supportive guidance near the reflection field, not successful-save confirmation copy.

Approved anchor phrase to preserve:

> Chapter 1 is now in motion, even if you are still finding the words.

## Relationship To Career Brain

Career Journey collects and shapes information through the guided experience. Career Brain owns the durable career data that survives beyond any single session or UI flow. Career Journey should help the user create clarity; Career Brain should preserve the result as reusable source-of-truth material.

## Workspace Definitions

- Career Journey overview: the light orientation surface with progress framing, overview copy, and the entry point into active chapter work.
- Focused workspace: the shared chapter-working shell for Chapters 1, 2, and 3 where one chapter is visually dominant at a time.
- Journey navigation: the compact `View journey` control and chapter picker inside the focused workspace.
- Chapter-specific content: the existing Chapter 1, 2, and 3 renderers, handlers, validations, voice controls, and save/edit flows.

These are separate concerns. The overview should not try to carry the full active chapter workload, and the focused workspace should not become a second application shell.

## Chapter 2 Direction

Chapter 2 is `Your Career Timeline`. Early MVP language should use `Role or career season` so the experience does not assume every meaningful period was traditional employment. A career season may include employment, education, caregiving, entrepreneurship, transition, volunteer work, a meaningful project, or another formative period.

Approved Chapter 2 behavior to preserve:

- Before the first save, Chapter 2 keeps the current guided first-entry form.
- After the first save, Chapter 2 supports multiple saved experiences instead of one saved experience.
- Each saved experience keeps a stable ID.
- Role or career season remains required.
- Company, start year, end year, and reflection remain optional.
- Each experience keeps its own reflection.
- Duplicate-looking experiences are allowed.
- Deletion and manual reordering remain out of scope.
- Saved Chapter 2 experiences display as compact cards with a small factual count.
- Experience cards use chronological display order:
  - prefer start year
  - use end year when start year is absent
  - most recent dated entries first
  - ties preserve original entry order
  - undated entries follow dated entries and preserve original entry order
- Display order is presentation only and does not determine Story Coach context identity.

Approved Chapter 2 editing behavior to preserve:

- Only one add or edit draft may be active at once.
- Saved data is not mutated until Save.
- Save returns to the card view.
- Cancel discards only the active draft.
- Merely opening add or edit mode is not dirty.
- Changing a field creates dirty state.
- Returning all fields to baseline clears dirty state.
- Leaving Chapter 2 while dirty requires Save, Discard, or canceling navigation.
- Editing preserves stable IDs.

Approved experience labels to preserve:

- Show `Role · Company` when both exist.
- Show role only when company is missing.
- Omit missing date text cleanly.
- Do not invent employer or date placeholders.

## Current Active Implementation

Current approved implementation slice: Focused Career Journey Workspace for Chapters 1 through 3.

Expected behavior:

- `Start Journey` and `Continue Journey` open the focused workspace.
- The workspace should choose the recommended active chapter from existing derived journey state.
- The chapter area should stay dominant while journey navigation remains secondary.
- Opening and closing journey navigation must not reset unsaved chapter work.

Deferred explicitly:

- Career Journey -> Professional Experience refinement
- Chapter 4 and Chapter 5 workspace content
- Persistence beyond the current local prototype behavior

Approved near-term extension inside the current Career Journey boundary:

- Chapter 2 expands from one saved experience to multiple saved experiences within the existing controller-local, session-only model.
- Chapter 3 Story Coach can select any saved Chapter 2 experience as context through stable experience IDs.
- This relationship model is the enabling foundation for the later Chapter 4 Story Map.

Approved Chapter 3 relationship and completion behavior to preserve:

- Story Coach context is identified by stable Chapter 2 experience ID, not by display order.
- The default context for the next new story is the most recently successfully saved Chapter 2 experience.
- An active Story Coach draft keeps its existing selected experience even when another Chapter 2 experience is edited.
- The Story Coach selector includes every saved Chapter 2 experience plus `Different experience`.
- Changing selector choice updates the opening prompt immediately before discovery begins.
- `Different experience` uses the generic prompt and saves a blank relationship.
- New-story discovery locks the selector after the initial response or coaching interaction begins.
- Changing context after lock requires the confirmed existing Start Over flow.
- Starting over clears the active Chapter 3 draft and unlocks the selector.
- Saved stories remain linked by stable experience ID.
- Saved stories open in read-only view mode with the selector locked.
- Explicit Edit is required to relink an existing saved story.
- In Edit mode, selector changes remain available throughout the editing session.
- Story content and experience relationship share one edit baseline.
- Any content or relationship change makes the saved-story edit dirty.
- Returning both content and relationship to baseline clears dirty state.
- Save commits content and relationship changes together.
- Cancel restores both content and relationship.
- Starting a genuinely new story clears Chapter 3 completion until `I'm Done for Now` is selected again.
- Editing or relinking an existing saved story preserves Chapter 3 completion.
- Linked story labels continue to derive from current Chapter 2 experience data rather than copied story fields.

## Out Of Scope For V1

- AI interviewing or AI extraction
- persistence implementation
- final Career Brain schema definition
- resume generation
- application packet generation
- interview prep workflows
- opportunity review workflows beyond references needed for planning context

## Next Implementation Slice: Career Journey Experience Shell v1

### Purpose

Create the first visible Career Journey entry experience with a chapter-based shell, progress framing, and first-time or returning-user behavior, without AI or persistence.

### Planning Notes

- The shell should prove the experience framing before deeper data collection is built.
- The UI should make the separation between guided experience and durable source of truth easier to reason about in later implementation.
- The slice should stay small enough for one implementation-ready issue once planning is complete.

### Draft Acceptance Focus

- first visible Career Journey entry shell exists
- chapter-based framing is present
- progress framing is visible
- first-time and returning-user states are intentionally different
- no AI behavior is implied
- no persistence behavior is required
