import { defineConfig } from 'tsup';

export default defineConfig({
    clean: true,
    dts: true,
    entry: ['src/bin/inhale-mail.ts', 'src/bin/cleanup.ts', 'src/bin/start.ts'],
    format: ['esm'],
    minify: true,
    sourcemap: true,
});
