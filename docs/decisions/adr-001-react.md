# Architecture Decision Record 001 
# Use React instead of Blazor or Astro

## Context

The frontend is used only to track food through backend API calls.
It should remain as small and simple as possible.

## Decision

Though Blazor or Astro are sound minimal choices, React is more common in business use cases. 
The project uses a minimal React + TypeScript frontend.

## Consequences

+ Better alignment with target stack
+ Refresh React and Redux skills through a concrete application
+ Simplified onboarding

- Require strict limitation of React useEffect side effects