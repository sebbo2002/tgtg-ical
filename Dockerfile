FROM node:lts-alpine@sha256:d32cdf619f63fe0471182d08996dd516c6275bb5fd31ae06e55a570bd9e1ad43 as build-container
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
WORKDIR "/app"

RUN apk add --no-cache --update dumb-init && \
    ln -s /app/dist/bin/cleanup.mjs /usr/local/bin/cleanup && \
    ln -s /app/dist/bin/inhale-mail.mjs /usr/local/bin/inhale-mail && \
    ln -s /app/dist/bin/start.mjs /usr/local/bin/start

COPY package*.json "/app/"
RUN npm ci --only-production

COPY . "/app"
USER node

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/usr/local/bin/start"]
