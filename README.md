# FoodSaver

Track food expiry dates and reduce household waste.

## Features

- Track food expiry dates
- Consume one quantity or all remaining quantities
- Highlight food expiring today
- Highlight food expiring soon
- Import foods from a CSV file into FoodSaver

## Tech stack

### Backend

- ASP.NET Core (.NET 10)
- Minimal API
- Entity Framework Core
- SQLite

### Frontend

- React
- TypeScript
- Vite
- ESLint

### Tooling
- .NET 10 File-Based App (FoodSaver.Import.cs)
- Bash

### Testing

- xUnit
- Cypress
- axe-core

## Run locally

### Backend

```bash
dotnet clean
dotnet build
dotnet test --no-restore
dotnet run --no-build
```

### Frontend

```bash
yarn install
yarn lint
yarn build
yarn dev
```

### Import tool

#### Run

```bash
./tools/FoodSaver.Import.cs foods.csv
```

#### Dry run

Preview imported foods without importing them.

```bash
./tools/FoodSaver.Import.cs foods.csv --dry-run
```

#### Custom API URL

Use a custom FoodSaver API URL.

```bash
./tools/FoodSaver.Import.cs foods.csv \
  --base-url http://localhost:5050
```

#### Tests

```bash
./tools/tests/FoodSaver.Import.Tests/run.sh
```

## Deploy

Deployment is hosted on [render](https://dashboard.render.com/) with auto-deploy enabled on push to the deployment branch.

## Test End-to-End

```bash
yarn test:e2e
```

Due to backend cold starts on Render free hosting, the first E2E run may occasionally require a retry.

## Documentation

The project documentation lives in `/docs/`:

- `product/` → product requirements and user behavior
- `architecture/` → technical stack and Architecture Decision Records 
- `testing/` → testing strategy

## Architecture

FoodSaver follows a feature-based vertical slice architecture.

## Environment

### src/FoodSaver.Web/

#### .env

```code
VITE_API_URL=http://localhost:8080
```

#### .env.production

```code
VITE_API_URL=https://foodsaver-api-00tb.onrender.com
```

### tools/

#### .env

```code
FOODSAVER_API_URL=http://localhost:8080
```

#### .env.production

```code
FOODSAVER_API_URL=https://foodsaver-api-00tb.onrender.com
```