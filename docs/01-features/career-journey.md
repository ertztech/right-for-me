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

## Chapter 2 Direction

Chapter 2 is `Your Career Timeline`. Early MVP language should use `Role or career season` so the experience does not assume every meaningful period was traditional employment. A career season may include employment, education, caregiving, entrepreneurship, transition, volunteer work, a meaningful project, or another formative period.

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
