# Architecture Overview

This summary preserves the current architecture guidance in a discoverable section for future implementation planning.

## Current Structure

- Feature folders own their own logic so the codebase can grow without centralizing everything in one place.
- `src/app.js` should stay lightweight and initialize modules rather than absorb feature logic.
- Business logic should stay separate from rendering where practical.

## Product-Aligned Architecture Principles

- The reusable career source of truth should be accessible across features without duplicate data entry.
- Opportunity-centered workflows should keep job-specific analysis, outputs, and status together.
- Generated outputs should be derived from saved evidence rather than invented facts.
- Pull requests should stay scoped to one logical change so planning quality is easy to inspect.

## Related Sources

- Earlier architecture notes: [../architecture.md](../architecture.md)
- Earlier data model notes: [../ai-outputs-data-model.md](../ai-outputs-data-model.md), [../jobs-applied-data-model.md](../jobs-applied-data-model.md)
