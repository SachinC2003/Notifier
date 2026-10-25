#stage 1- install
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


#stage 2- build application
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV DATABASE_URL="postgresql://ci:ci@localhost:5432/notifier"

RUN npm run generate
RUN npm run build

#stage 3- production runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST="0.0.0.0"

RUN addgroup -S -g 1001 nodejs \
    && adduser -S -u 1001 -G nodejs user

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder --chown=user:nodejs /app/dist ./dist
COPY --from=builder --chown=user:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=user:nodejs /app/prisma ./prisma
COPY --from=builder --chown=user:nodejs /app/prisma.config.ts ./prisma.config.ts

USER user

EXPOSE 3000

CMD ["npm", "start"]