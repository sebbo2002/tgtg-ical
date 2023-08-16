#!/usr/bin/env bash
set -e

rsync -avzr --delete \
    --exclude node_modules --exclude .git --exclude .idea --exclude .nyc_output --exclude docs \
    ./ ${DEPLOYMENT_URL:-tgtg-ical.sebbo.net}:~/apps/tgtg-ical/package/

ssh -v ${DEPLOYMENT_URL:-tgtg-ical.sebbo.net} \
    "cd ~/apps/tgtg-ical/package/ && npm ci && supervisorctl restart tgtg-ical && tail -n 50 ~/logs/supervisord.log"
