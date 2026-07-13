FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time.
# In Dokploy: enable these for the build stage (build args), not runtime-only.
# Important: do NOT `ENV` empty ARGs — that blanks values already present in `.env`.
ARG NEXT_PUBLIC_INSFORGE_URL
ARG NEXT_PUBLIC_INSFORGE_ANON_KEY
ARG NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
ARG NEXT_PUBLIC_POSTHOG_HOST

RUN if [ -n "$NEXT_PUBLIC_INSFORGE_URL" ]; then echo "NEXT_PUBLIC_INSFORGE_URL=$NEXT_PUBLIC_INSFORGE_URL" >> .env.production; fi \
 && if [ -n "$NEXT_PUBLIC_INSFORGE_ANON_KEY" ]; then echo "NEXT_PUBLIC_INSFORGE_ANON_KEY=$NEXT_PUBLIC_INSFORGE_ANON_KEY" >> .env.production; fi \
 && if [ -n "$NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN" ]; then echo "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=$NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN" >> .env.production; fi \
 && if [ -n "$NEXT_PUBLIC_POSTHOG_HOST" ]; then echo "NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST" >> .env.production; fi

RUN node -e 'const fs=require("fs"); const load=f=>{if(!fs.existsSync(f))return{};return Object.fromEntries(fs.readFileSync(f,"utf8").split("\n").map(l=>l.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)).filter(Boolean).map(m=>[m[1],m[2].replace(/^["'\'']|["'\'']$/g,"")]))}; const env={...load(".env"),...load(".env.production"),...process.env}; if(!env.NEXT_PUBLIC_INSFORGE_URL||!env.NEXT_PUBLIC_INSFORGE_ANON_KEY){console.error("\nERROR: NEXT_PUBLIC_INSFORGE_URL and NEXT_PUBLIC_INSFORGE_ANON_KEY must be present at Docker build time.\nIn Dokploy, add them as environment variables available during build (build args), or put them in a .env file in the build context.\n"); process.exit(1);} console.log("InsForge public env present for Next.js build.");'

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Force IPv4 DNS resolution to prevent fetch ETIMEDOUT errors in Docker environments without IPv6
ENV NODE_OPTIONS="--dns-result-order=ipv4first"
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
