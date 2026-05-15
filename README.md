# FoodSaver
Track your food expiry dates. Reduce household waste.

## Features

- Track food expiry dates
- Highlight products expiring soon
- Mark products as consumed

## User Experience

- Lightweight interface
- Accessible UI

## Run

### Backend

```bash
dotnet build
dotnet test
dotnet run --no-build
```

### Frontend

```bash
yarn install
yarn lint
yarn build
yarn test:e2e
yarn preview
```

## Architecture

The project follows a feature-focused vertical slice architecture.

Detailed documentation is available in `/docs/`:

- `product/`
- `architecture/`
- `decisions/`
- `testing/`
