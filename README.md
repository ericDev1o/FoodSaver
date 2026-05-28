# FoodSaver

Track your food expiry dates. Reduce household waste.

## Features

- Track food expiry dates
- Highlight products expiring soon
- Consume food quantities individually or all at once

## User Experience

- Lightweight interface
- Accessible UI

## Run

### Backend

```bash
dotnet clean
dotnet build
dotnet test --no-restore
dotnet run --no-build
```

### Frontend

Please 
- run once 

```bash
yarn test:e2e
```

on previous deployed version to ensure non-regression 

- switch to local dev env before yarn test:e2e
    - please prefer 
        - F12 DevTools to 
            - console.trace / console.time to 
                - console.log
- reset to production-clean code

```bash
yarn install
yarn lint
yarn build
yarn test:e2e
yarn preview
yarn upgrade-interactive
```
...git commit on [render](https://dashboard.render.com/) auto-deploy set branch

run once after deploy / cold start (to avoid HTTP 503)

```bash
yarn test:e2e
```

#### Environment variable files

##### .env

VITE_API_URL=http://localhost:8080

##### .env.production

VITE_API_URL=https://foodsaver-api-00tb.onrender.com

## Architecture

The project follows a feature-focused vertical slice architecture.

Detailed documentation is available in `/docs/`:

- `product/`
- `architecture/`
- `decisions/`
- `testing/`
