#!/usr/bin/env node
'use strict';

/* istanbul ignore file */
import Parser from '../lib/parser.js';

let buffer = '';
process.stdin.on('data', (chunk) => {
    buffer += chunk;
});
process.stdin.on('end', () => {
    Parser.inhaleMail(buffer)
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
});
