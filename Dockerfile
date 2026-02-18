FROM node:lts-alpine@sha256:4f696fbf39f383c1e486030ba6b289a5d9af541642fc78ab197e584a113b9c03 as build-container
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
