#!/usr/bin/env node
'use strict';

/* istanbul ignore file */
import prisma from '../lib/db.js';
import Parser from '../lib/parser.js';

Parser.runCleanup()
    .then(() => {
        return prisma.$disconnect();
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
