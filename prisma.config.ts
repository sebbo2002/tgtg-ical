import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
    datasource: {
        url: env('DATABASE_URL'),
    },
    schema: path.join('src', 'prisma', 'schema.prisma'),
});
