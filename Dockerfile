FROM node:lts-alpine@sha256:156b55f92e98ccd5ef49578a8cea0df4679826564bad1c9d4ef04462b9f0ded6 as build-container
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
