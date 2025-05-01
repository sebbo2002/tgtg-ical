#!/usr/bin/env node
'use strict';

/* istanbul ignore file */
import Parser from '../lib/parser.js';

Parser.runCleanup().catch((error) => {
    console.error(error);
    process.exit(1);
});
