# Acceptance Criteria

## Purpose

Define expected user behavior for each feature.

## Approach

The project follows a Behavior-Driven Development mindset:

1. Define User Cases first
2. Translate UC into functional acceptance criteria
3. Implement minimal backend and frontend behavior to satisfy them
4. Validate through end-to-end tests

## Rules
Acceptance criteria must:

· Describe user-visible behavior, not technical implementation
· Be independent of the UI or backend architecture
· Be testable end-to-end
· Be written in simple, unambiguous language

## User Cases

### Add a food item

Given a user adds a food item with an expiry date
When the item is saved
Then it appears in the list of tracked foods
And it is marked according to its expiry status

### Consume one quantity

Given a tracked food item with quantity greater than one
When the user consumes one quantity
Then quantity is decreased by one

### Consume all remaining quantity

Given a tracked food item
When the user consumes all
Then the item no longer appears in the list

### Expiring today

Given a tracked food item expiring today
When it appears in the list
Then it is visually highlighted

### Expiring soon

Given a tracked food item expiring in the three coming days
When it appears in the list
Then it is visually highlighted

## Scope Definition

If a behavior is not described by an acceptance criterion, it is not considered part of the feature scope.