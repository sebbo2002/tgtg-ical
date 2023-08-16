import { defineConfig } from 'tsup';

export default defineConfig({
    clean: true,
    entry: [
        'src/bin/inhale-mail.ts',
        'src/bin/clanup.ts',
        'src/bin/start.ts'
    ],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    minify: true
});
