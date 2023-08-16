#!/usr/bin/env bash
set -e

if [ ! -d "./dist" ]; then
    npm run build
fi;
if [ ! -d "./dist" ]; then
    echo "No ./dist directory found. Aborting.";
    exit 1;
fi;

rsync -avzr --delete \
    --exclude node_modules --exclude .git --exclude .idea --exclude .nyc_output --exclude docs \
    ./ ${DEPLOYMENT_URL:-tgtg-ical.sebbo.net}:~/apps/tgtg-ical/package/

ssh ${DEPLOYMENT_URL:-tgtg-ical.sebbo.net} \
    "cd ~/apps/tgtg-ical/package/ && npm ci && supervisorctl restart tgtg-ical && tail -n 50 ~/logs/supervisord.log"
