import { init } from '@sentry/node';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'node:fs';

init({
    dsn: process.env.SENTRY_DSN || 'https://5e4630d58e5f4c778ce22140c53b3684@glitch.sebbo.net/9',
});

let dir = dirname(fileURLToPath(import.meta.url));
if (dir.endsWith('/dist')) {
    dir = resolve(dir, '..', 'src');
} else {
    dir = resolve(dir, '..');
}

function src(path?: string) {
    return resolve(dir, path || '');
}

let version: string | undefined;
try {
    const pkg = JSON.parse(readFileSync(src('../package.json'), 'utf8'));
    version = pkg.version;
}
catch(error) {
    console.log('Failed getting tgtg-ical version:');
    console.error(error);
}

export default {
    baseUrl: process.env.BASE_URL || 'https://tgtg-ical.sebbo.net',
    baseMail: process.env.BASE_MAIL || '@tgtg-ical.sebbo.net',
    version,
    src
};
