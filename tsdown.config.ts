import { defineConfig } from 'tsdown';

export default defineConfig({
    dts: true,
    entry: ['src/bin/inhale-mail.ts', 'src/bin/cleanup.ts', 'src/bin/start.ts'],
    format: ['esm'],
    minify: true,
    sourcemap: true,
});
