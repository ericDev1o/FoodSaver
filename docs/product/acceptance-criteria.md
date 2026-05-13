# Acceptance Criteria

## Purpose

Define expected user behavior for each feature.

## Approach

The project follows a Behavior-Driven Development mindset:

1. Define user scenarios first
2. Translate scenarios into functional acceptance criteria
3. Implement minimal backend and frontend behavior to satisfy them
4. Validate through end-to-end tests

## Rules
Acceptance criteria must:

· Describe user-visible behavior, not technical implementation
· Be independent of the UI or backend architecture
· Be testable end-to-end
· Be written in simple, unambiguous language

## Example (Food Tracking)

### Scenario: Add a food item

Given a user adds a food item with an expiry date
When the item is saved
Then it appears in the list of tracked foods
And it is marked according to its expiry status

## Scope Definition

If a behavior is not described by an acceptance criterion, it is not considered part of the feature scope.