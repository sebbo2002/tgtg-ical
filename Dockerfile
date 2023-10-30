FROM node:lts-alpine@sha256:8e015de364a2eb2ed7c52a558e9f716dcb615560ffd132234087c10ccc1f2c63 as build-container

WORKDIR "/app"

COPY package*.json "/app/"
RUN npm ci --verbose

COPY . "/app/"
RUN npm run build && \
    rm -rf ./.github ./src ./test ./node_modules


FROM node:lts-alpine@sha256:8e015de364a2eb2ed7c52a558e9f716dcb615560ffd132234087c10ccc1f2c63
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
WORKDIR "/app"

RUN apk add --no-cache --update dumb-init && \
    ln -s /app/dist/bin/cleanup.js /usr/local/bin/cleanup && \
    ln -s /app/dist/bin/inhale-mail.js /usr/local/bin/inhale-mail && \
    ln -s /app/dist/bin/start.js /usr/local/bin/start

COPY --from=build-container /app/package*.json "/app/"
RUN npm ci --only-production

COPY --from=build-container "/app" "/app"
USER node

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/usr/local/bin/start"]
