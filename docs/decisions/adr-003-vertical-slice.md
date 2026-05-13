# Architecture Decision Record 003
# Use feature-based Vertical Slice architecture

## Context

The application prioritizes fast delivery of a Minimal Viable Product.
The codebase must remain simple and maintainable.

## Decision
 
The project uses feature-based Vertical Slice architecture.

## Consequences

+ Feature-focused architecture improves product understanding and codebase maintainability
+ Less technical layering in favor of feature-oriented design
+ Reduced coupling between features enables independent evolution
+ Easier to test features through end-to-end flows

- Risk of uneven quality across features without shared standards.