import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from '../prisma/prisma/client.js';

const databaseUrlStr = process.env.DATABASE_URL;
if (!databaseUrlStr) {
    throw new Error('DATABASE_URL is not set');
}

const databaseUrl = new URL(databaseUrlStr);
const prismaAdapter = new PrismaMariaDb({
    connectionLimit: 5,
    database: databaseUrl.pathname.slice(1),
    host: databaseUrl.hostname,
    password: databaseUrl.password,
    port: parseInt(databaseUrl.port, 10) || 3306,
    user: databaseUrl.username,
});
const prisma = new PrismaClient({
    adapter: prismaAdapter,
});

export default prisma;
export * from '../prisma/prisma/client.js';
