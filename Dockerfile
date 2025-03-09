FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json ./ pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm i --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .prettierrc.yml .prettierrc.yml
COPY eslint.config.mjs eslint.config.mjs

#Disable telemetry.
ENV NEXT_TELEMETRY_DISABLED=1

ARG SPRING_SERVER_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

ENV SPRING_SERVER_URL=${SPRING_SERVER_URL}
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}

RUN npm install -g pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
#Disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

ARG SPRING_SERVER_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

ENV SPRING_SERVER_URL=${SPRING_SERVER_URL}
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/src/features/actions ./src/features/actions

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
