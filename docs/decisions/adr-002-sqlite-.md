# Architecture Decision Record 002
# Use SQLite instead of SQL Server

## Context

The backend is simple and single-user.
The application prioritizes fast delivery of a Minimal Viable Product.

## Decision

Though SQL Server is used in the corporate stack, SQLite is better suited for an MVP. 
The project uses SQLite for the initial version.

## Consequences

+ Complexity is reduced
+ Faster delivery of the initial version
+ Simplified testing

- SQLite introduces limitations compared to server-based relational databases: concurrency, scalability, and operational behavior 
- Potential migration effort for schema and queries depending on database differences
- Database access must remain modular to keep the future migration simple