# Production image for the HaatSign landing site (Next.js 15).
#
# The site uses getStaticProps with ISR (revalidate), so it needs a Node
# runtime - the same `next start` the current PM2 setup (ecosystem.config.js)
# runs, here as the non-root "node" user on port 3000.
#
# NEXT_PUBLIC_* values are inlined into the bundles at BUILD time, so they are
# build arguments. Pages fall back to empty data when the API is unreachable
# during the build, so the image builds even without them; set them to build
# an image for a real environment. Everything here ends up in the browser
# bundle, so never pass a value that must stay secret.
#
# Build:
#   docker build --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api/landing \
#     ... -t haatsign-landing-frontend .

# ---- Dependencies (production only, for the runtime image) ------------------
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# ---- Build ------------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ADMIN_API_URL
ARG NEXT_PUBLIC_TEST_URL
ARG NEXT_PUBLIC_API_KEY
ARG NEXT_PUBLIC_SECRET_KEY
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_ADMIN_API_URL=$NEXT_PUBLIC_ADMIN_API_URL \
    NEXT_PUBLIC_TEST_URL=$NEXT_PUBLIC_TEST_URL \
    NEXT_PUBLIC_API_KEY=$NEXT_PUBLIC_API_KEY \
    NEXT_PUBLIC_SECRET_KEY=$NEXT_PUBLIC_SECRET_KEY \
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- Runtime ----------------------------------------------------------------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json /app/next.config.js /app/next-i18next.config.js ./
COPY --from=build --chown=node:node /app/public ./public
# .next is written to at runtime by ISR revalidation, so it must be owned by node.
COPY --from=build --chown=node:node /app/.next ./.next

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/haatsign.ico || exit 1
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
