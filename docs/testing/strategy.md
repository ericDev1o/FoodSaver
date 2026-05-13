# Testing Strategy

## Philosophy (Why)

Tests are driven by product behavior, not code structure.

## Strategy (How)

· Acceptance criteria define test scenarii first (ATDD approach)
· End-to-end (E2E) tests validate critical user flows
· Integration tests cover API feature slices
· Unit tests are used only when they add clear value

## Focus (Where to put most effort)

· Critical user journeys (food tracking lifecycle)
· API feature endpoints (Vertical Slices)

## Principles (Guidelines)

· Prefer real system behavior over isolated tests
· Avoid over-testing implementation details
· Keep tests close to business value

### Accessibility

· A11y is part of the Definition of Done
· A11y regressions are treated as functional regressions
· A11y is validated through E2E user flows