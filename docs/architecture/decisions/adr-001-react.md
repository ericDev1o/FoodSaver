# Architecture Decision Record 001 
# Use React + TypeScript for the frontend

## Context

The frontend is used only to track food through backend API calls.
It should remain as small and simple as possible.

## Lightweight alternatives considered

- Blazor
- Astro

## Decision

The project uses React + TypeScript for the frontend.
React is more common in business use cases and aligns better with the target stack.

## Consequences

+ Better alignment with target stack
+ Keep React and Redux skills up-to-date through a concrete application
+ Simplified onboarding

- More frontend setup and tooling compared to Blazor or Astro
- Increased dependency maintenance in the JavaScript ecosystem
- Requires discipline to keep the frontend lightweight as the product evolves