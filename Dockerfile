FROM node:lts-alpine@sha256:34b7aa411056c85dbf71d240d26516949b3f72b318d796c26b57caaa1df5639a as build-container
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
WORKDIR "/app"

RUN apk add --no-cache --update dumb-init && \
    ln -s /app/dist/bin/cleanup.js /usr/local/bin/cleanup && \
    ln -s /app/dist/bin/inhale-mail.js /usr/local/bin/inhale-mail && \
    ln -s /app/dist/bin/start.js /usr/local/bin/start

COPY package*.json "/app/"
RUN npm ci --only-production

COPY . "/app"
USER node

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/usr/local/bin/start"]
