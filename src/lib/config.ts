import { init } from '@sentry/node';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

init({
    dsn:
        process.env.SENTRY_DSN ||
        'https://5e4630d58e5f4c778ce22140c53b3684@glitch.sebbo.net/9',
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
} catch (error) {
    console.log('Failed getting tgtg-ical version:');
    console.error(error);
}

export default {
    baseMail: process.env.BASE_MAIL || '@tgtg-ical.sebbo.net',
    baseUrl: process.env.BASE_URL || 'https://tgtg-ical.sebbo.net',
    src,
    version,
};
