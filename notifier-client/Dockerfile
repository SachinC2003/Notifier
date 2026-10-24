#Stage 1- install dependencies
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


#Stage 2- build the application
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


#Stage - Production runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOST="0.0.0.0"

# Run application as non-root user
RUN addgroup -S -g 1001 nodejs \
    && adduser -S -u 1001 nextjs


#####   

# This below 3 lines are framework specific,
# how each framework store there build content, here the next js keep there buikd files
# in standalone, static, public folder, so we are copying that folder to the production image, 
# if you are using any other framework like react or 
# angular then you need to copy the build folder of that framework.

#### 

# Copy only the required production artifacts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy this only if your project has a public directory
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]