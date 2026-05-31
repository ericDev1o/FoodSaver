# ADR-0004 — Use .NET 10 File-Based App for import tooling

## Context

FoodSaver needs a lightweight tool to import food items in bulk from CSV files into `FoodSaver.Api`.

Creating a dedicated console project would add project structure, build files and maintenance overhead for a small internal tool.

## Decision

Implement `FoodSaver.Import` as a .NET 10 File-Based App in a single `FoodSaver.Import.cs` file.

## Consequences

### Positive

+ no `.csproj`
+ single-file executable script
+ fast local iteration
+ lightweight maintenance
+ easy to run from CI or terminal

- limited compared to a full project
- custom shell-based testing instead of standard .NET test project
