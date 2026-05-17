FROM node:22-bookworm-slim

WORKDIR /app

# Corepack OK in container (no Render sandbox)
RUN corepack enable && corepack prepare yarn@4.14.1 --activate

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --immutable

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["npx", "serve", "-s", "dist", "-l", "3000"]