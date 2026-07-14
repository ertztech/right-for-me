# Story Discovery Foundation Implementation Retro

Date: 2026-07-13

## Cycle Goal

Validate that NextMove can help a user uncover meaningful professional stories through a voice-enabled, AI-assisted experience, then connect those stories to the career context captured earlier in the Career Journey.

## Cycle Outcome

Successful, with meaningful product and process learning.

Delivered:

- Chapter 3, Moments That Mattered
- Voice-to-text for the opening story and follow-up response
- Server-side AI reflection
- One focused AI follow-up question
- One cautious possible signal
- Multiple saved moments
- Stable moment IDs
- View and edit behavior
- Explicit I’m Done for Now completion
- Career Journey state integration
- Chapter 2 role and company connection
- Stable Chapter 2 timeline-entry IDs
- Linked and unlinked story contexts
- Role and company labels on saved moments
- Compact Chapter Map
- Improved Story Coach visual hierarchy
- Improved voice, processing, and failure states

## Verification

Automated verification:

- storyCoach.test.js: PASS
- aiClient.test.js: PASS
- careerJourneyStateTransitions.test.js: PASS

Founder-led guided testing confirmed:

- Voice-only opening responses
- Voice append behavior
- Voice-only follow-up responses
- AI reflection and follow-up
- Multiple saved moments
- View and edit behavior
- Explicit chapter completion
- Reopening Chapter 3
- Chapter 2-to-Chapter 3 context
- Role and company display
- Journey-state synchronization
- Visual stability during voice input

## What Worked Well

### The Core Product Idea Held Up

The Story Coach experience demonstrated that NextMove can feel meaningfully different from a traditional interview-answer product.

Speaking through a real experience, receiving a grounded reflection, and answering one focused follow-up helped the user examine a story they already had.

The cycle reinforced the product principle:

> NextMove should help users discover the stories they already have before helping them translate those stories into interview answers or application materials.

### Voice Improved the Experience

Voice input reduced typing friction and made the interaction feel more like coaching.

The decision to begin with editable voice-to-text rather than a continuous spoken AI conversation was correct.

### One AI Follow-Up Was Enough

Limiting the AI response to one reflection, one follow-up question, and one cautious possible signal kept the experience focused.

The AI supported discovery without taking ownership of the user’s story.

### Stable IDs Supported Safe Editing and Relationships

Stable IDs were the correct model for:

- Chapter 2 timeline entries
- Saved moments
- Editing existing records
- Linking moments to career context

### Guided Testing Found Important Issues

Automated tests passed before guided testing found several meaningful problems:

- Contradictory chapter-state messaging
- Voice-only text not enabling actions
- Visual bouncing during recognition
- Completion appearing ineffective
- The initial one-story assumption
- Missing multi-moment navigation
- Voice status overlapping controls
- Chapter 2 and Chapter 3 feeling disconnected
- Repeated headings and oversized status surfaces
- Saved moments lacking career context
- AI results feeling visually fragmented

Guided testing materially improved both correctness and usability.

## What Did Not Work Well

### The First Implementation Package Was Large

The initial vertical slice combined:

- New Chapter 3 behavior
- Voice input
- AI integration
- State expansion
- Saved results
- Visual design

The product slice was coherent, but the package contained enough uncertainty that several experience assumptions escaped planning.

### Completion Initially Reflected System Activity

Chapter 3 originally completed after one saved moment.

The corrected model is:

- Saving represents progress.
- The user decides when they are done for now.
- Adding another moment reopens the chapter until completion is confirmed again.

General principle:

> Completion should represent user intent, not merely the first successful transaction.

### The Interface Tried to Explain Too Much

The experience accumulated:

- Repeated chapter titles
- Large status cards
- Long descriptions
- Large secondary controls
- Oversized voice controls
- Nested AI-result cards
- A permanently visible Chapter Map

The product repeatedly explained itself instead of focusing the user on one task.

### Navigation and Chapter Work Remain Mixed

The strongest unresolved issue is structural.

The current Career Journey page still combines:

- Journey overview
- Profile actions
- Chapter status
- Chapter Map
- Active chapter work
- Experience-layer explanation

This creates unnecessary visual competition.

### Human Browser Testing Remains Essential

Browser automation could not consistently verify actual microphone capture.

Human testing was still required for:

- Microphone permission
- Speech recognition
- Visual movement
- Layout overlap
- AI usefulness
- Perceived product quality

### Silent Test Output Was Confusing

Direct Node tests sometimes passed without visible output.

The testing flow now requires explicit PASS or FAIL reporting using process exit codes.

## Product Decisions

### Story Discovery Comes Before Interview Translation

NextMove should first help users uncover and understand evidence from their real experience.

Interview-question matching and answer construction remain downstream.

### Voice Input Comes Before Continuous Voice Coaching

Current direction:

- User-initiated voice input
- Editable transcript
- Explicit AI submission
- One follow-up question

Deferred:

- Text-to-speech
- Continuous spoken conversation
- Interruptible real-time AI
- Multiple AI coaching turns

### Chapter 3 Supports Multiple Moments

Chapter 3 supports multiple saved moments and completes only when the user selects I’m Done for Now.

### Career Context Travels With the Story

Chapter 2 is not isolated profile data.

Its role and career-season context becomes source material for Chapter 3 story discovery.

### AI Interpretations Remain Cautious

Possible signals should use language such as:

> This may point to...

The system should not make definitive personality or competency claims.

### Premium Design Means Restraint

The intended Nike or Apple-style direction means:

- One clear task
- Minimal competing navigation
- Quiet progress
- Strong spacing
- Clear hierarchy
- User-entered content receiving emphasis
- Less explanation
- Fewer decorative surfaces

It does not mean adding more cards, gradients, animation, or decoration.

## Process Changes

### Guided Testing Is a Required Gate

The implementation loop is now:

1. Implementation Planning
2. Founder Approval
3. Codex Implementation
4. Team Implementation Review
5. Guided Testing Session
6. Testing Verdict
7. Commit and Pull Request
8. Merge, Rework, or Defer
9. Cycle Status Update

An implementation is not approved for merge until guided testing produces a clear verdict.

### Tests Must Report PASS or FAIL Explicitly

Future direct Node test instructions must print an explicit result using the process exit code.

### Guided Testing Should Use Checkpoints

Future sessions should:

- Test one coherent area at a time
- Stop when a blocker is found
- Record PASS, FAIL, or CONCERN
- Send the smallest necessary correction to Codex
- Resume testing at the failed checkpoint

### Defects and Product Enhancements Should Be Separated

Bug corrections and new product capabilities should not be combined automatically.

### Codex Receives One Focused Package at a Time

Large prompts that cross multiple state models or user outcomes should be refined and split before implementation.

## Next-Cycle Candidate

### Career Journey Focused Chapter Workspace

Separate the Career Journey overview from the active chapter experience.

The focused shell should support the existing Chapters 1, 2, and 3:

- Chapter 1: Where You Are Today
- Chapter 2: Roles and Experiences
- Chapter 3: Moments That Mattered

The goal is not merely to move Chapter 3 into an overlay. It is to establish one consistent chapter-working experience across the Career Journey built so far.

Likely behavior:

- The Career Journey overview remains a light navigation and progress surface.
- Continue Journey opens a full-screen or near-full-screen focused workspace.
- Chapters 1, 2, and 3 render inside the shared workspace shell.
- Only one chapter task is visually dominant at a time.
- Progress remains visible but quiet.
- The Chapter Map moves behind a compact View Journey control or similarly restrained navigation.
- Back and close behavior protect unsaved work.
- Voice recognition stops or remains safe when leaving the workspace.
- Existing chapter state is reused rather than duplicated.
- Chapters 4 and 5 may use the shell later, but are not implemented in this slice.

Why now:

- It addresses the strongest unresolved experience problem.
- It stops further patching of the embedded dashboard layout.
- It creates consistency across Chapters 1 through 3.
- It gives later chapters a clear presentation model.
- It moves NextMove toward the focused, premium experience direction.

Main risk:

The focused shell could expand into a full-site redesign.

Required boundary:

> Build the shared focused workspace for Chapters 1, 2, and 3. Do not redesign the rest of NextMove or implement Chapters 4 and 5.

## Parking Lot

Keep parked:

- Multiple Chapter 2 timeline entries
- Role selection across multiple timeline entries
- Persistent story storage
- Story search, filtering, sorting, and tags
- Story deletion
- Professional DNA aggregation
- AI-generated story suggestions
- Interview-question translation
- STAR or CAR conversion
- Text-to-speech
- Continuous AI voice coaching
- Full-site visual redesign

## Cycle Close

Final status:

- Story Coach implementation: Completed
- Timeline-to-story relationship implementation: Completed
- Automated verification: Passed
- Guided testing: Passed
- Product goal: Validated
- Remaining blocker: None
- Leading next-cycle candidate: Career Journey Focused Chapter Workspace for Chapters 1 through 3

Recommendation:

Close the Story Discovery Foundation cycle as successful.