# RightForMe Architecture

RightForMe is organized around feature folders. Each feature owns its own logic so the app can grow without turning one file into the whole product.

## Current Structure

### `src/careerVault/`

Owns the Profile experience: collecting, saving, loading, and exporting the reusable professional data that powers the rest of the product. The internal module is still named `careerVault` to avoid unnecessary churn, but user-facing language should say Profile.

### `src/resume/`

Owns resume generation. The builder creates the resume model, the markdown renderer turns that model into markdown, and the controller handles the page actions.

### `src/app.js`

Initializes feature modules. It should stay lightweight and should not become the place where resume, vault, or job-analysis logic lives.

## Principles

- `app.js` initializes modules only.
- Business logic stays separate from rendering.
- Each file should have one clear responsibility.
- Feature folders own their own code.
- Pull requests should avoid unrelated changes.

This structure keeps the project easier to reason about, easier to test by hand, and easier to explain in public as it grows.
