import { init } from '@sentry/node';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

init({
    dsn: process.env.SENTRY_DSN || 'https://5e4630d58e5f4c778ce22140c53b3684@glitch.sebbo.net/9',
});

export default {
    baseUrl: process.env.BASE_URL || 'https://tgtg-ical.sebbo.net',
    baseMail: process.env.BASE_MAIL || '@tgtg-ical.sebbo.net',
    version: process.env.npm_package_version || undefined,
    src(path?: string) {
        let dir = dirname(fileURLToPath(import.meta.url));
        if (dir.endsWith('/dist')) {
            dir = resolve(dir, '..', 'src');
        } else {
            dir = resolve(dir, '..');
        }

        return resolve(dir, path || '');
    }
};
