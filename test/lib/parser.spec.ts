'use strict';

import * as assert from 'assert';
import { readFile } from 'fs/promises';
import moment from 'moment-timezone/builds/moment-timezone-with-data.js';
import Parser from '../../src/lib/parser.js';
import Config from '../../src/lib/config.js';

describe('Parser', function () {
    const fixtures = Config.src('../test/lib/fixtures');

    describe('parseMail', function () {
        it('should parse order mails (2023)', async function () {
            const mail = await readFile(fixtures + '/order/de_2023.eml', 'utf-8');
            const result = await Parser.parseMail(mail);

            assert.strictEqual(result.type, 'order');
            assert.strictEqual(result.orderId, 'rio3sec8wgb');
            assert.deepStrictEqual(result.location, {
                name: 'Nordsee - Spandauer Straße',
                address: 'Spandauer Str. 4, 10178 Berlin, Deutschland'
            });

            assert.ok(result.time.from.isSame(moment.tz('2023-07-24T18:30:00.000', 'Europe/Berlin')));
            assert.ok(result.time.to.isSame(moment.tz('2023-07-24T19:00:00.000', 'Europe/Berlin')));

            assert.strictEqual(result.amount, 2);
            assert.strictEqual(result.price, 700);
        });
        it('should parse order mails (2023 + HTML encoding)', async function () {
            const mail = await readFile(fixtures + '/order/de_2023_encoding.eml', 'utf-8');
            const result = await Parser.parseMail(mail);

            assert.strictEqual(result.type, 'order');
            assert.strictEqual(result.orderId, 'kknd37xqvo3');
            assert.deepStrictEqual(result.location, {
                name: 'Crunchy & Soft Bakery',
                address: 'Alte Jakobstraße 77, 10179 Berlin, Deutschland'
            });

            assert.ok(result.time.from.isSame(moment.tz('2023-10-27T10:00:00.000', 'Europe/Berlin')));
            assert.ok(result.time.to.isSame(moment.tz('2023-10-27T11:00:00.000', 'Europe/Berlin')));

            assert.strictEqual(result.amount, 1);
            assert.strictEqual(result.price, 300);
        });
        it('should parse order mails (2021)', async function () {
            const mail = await readFile(fixtures + '/order/de_2021.eml', 'utf-8');
            const result = await Parser.parseMail(mail);

            assert.strictEqual(result.type, 'order');
            assert.strictEqual(result.orderId, 'dfaxqeu6f8d');
            assert.deepStrictEqual(result.location, {
                name: 'Kamps Backstube - Checkpoint Charlie',
                address: 'Friedrichstraße 41, 10969 Berlin, Deutschland'
            });

            assert.ok(result.time.from.isSame(moment.tz('2024-04-30T16:30:00.000', 'Europe/Berlin')));
            assert.ok(result.time.to.isSame(moment.tz('2024-04-30T17:00:00.000', 'Europe/Berlin')));

            assert.strictEqual(result.amount, 1);
            assert.strictEqual(result.price, 430);
        });
        it('should parse order mails (2020)', async function () {
            const mail = await readFile(fixtures + '/order/de_2020.eml', 'utf-8');
            const result = await Parser.parseMail(mail);

            assert.strictEqual(result.type, 'order');
            assert.strictEqual(result.orderId, 'too38e9h7io');
            assert.deepStrictEqual(result.location, {
                name: 'Rice On! - Berlin',
                address: 'Europaplatz 1, 10557 Berlin, Deutschland'
            });

            assert.ok(result.time.from.isSame(moment.tz('2024-07-29T18:30:00.000', 'Europe/Berlin')));
            assert.ok(result.time.to.isSame(moment.tz('2024-07-29T19:00:00.000', 'Europe/Berlin')));

            assert.strictEqual(result.amount, 1);
            assert.strictEqual(result.price, 400);
        });
        it('should parse time changes', async function () {
            const mail = await readFile(fixtures + '/time-changed/de_2023.eml', 'utf-8');
            const result = await Parser.parseMail(mail);

            assert.strictEqual(result.type, 'change');
            assert.strictEqual(result.orderId, 'ecqpn6ux8sd');

            assert.ok(
                result.time.from.isSame(moment.tz('2023-06-28T18:20:00.000', 'Europe/Berlin')),
                `${result.time.from.toJSON()} === 2023-06-28T18:20:00.000`
            );
            assert.ok(
                result.time.to.isSame(moment.tz('2023-06-28T19:30:00.000', 'Europe/Berlin')),
                `${result.time.to.toJSON()} === 2023-06-28T19:30:00.000`
            );
        });
        it('should detect invoice mails (2020)', async function () {
            const mail = await readFile(fixtures + '/invoice/de_2020.eml', 'utf-8');
            const result = await Parser.parseMail(mail);
            assert.strictEqual(result.type, 'invoice');
            assert.strictEqual(result.to, '**********@tgtg-ical.sebbo.net');
            assert.strictEqual(result.orderId, 'too38e9h7io');
            assert.ok(result.invoicedAt.isSame(moment('2020-07-29T18:17:44.000Z')));
        });
        it('should detect invoice mails (2021)', async function () {
            const mail = await readFile(fixtures + '/invoice/de_2021.eml', 'utf-8');
            const result = await Parser.parseMail(mail);
            assert.strictEqual(result.type, 'invoice');
            assert.strictEqual(result.to, '**********@tgtg-ical.sebbo.net');
            assert.strictEqual(result.orderId, 'dfaxqeu6f8d');
            assert.ok(result.invoicedAt.isSame(moment('2021-04-30T15:22:55.000Z')));
        });
        it('should detect invoice mails (2023)', async function () {
            const mail = await readFile(fixtures + '/invoice/de_2023.eml', 'utf-8');
            const result = await Parser.parseMail(mail);
            assert.strictEqual(result.type, 'invoice');
            assert.strictEqual(result.to, '**********@tgtg-ical.sebbo.net');
            assert.strictEqual(result.orderId, 'rio3sec8wgb');
            assert.ok(result.invoicedAt.isSame(moment('2023-07-24T17:29:16.000Z')));
        });
        it('should detect cancellation mails (1)', async function () {
            const mail = await readFile(fixtures + '/cancellation/de_1.eml', 'utf-8');
            const result = await Parser.parseMail(mail);
            assert.strictEqual(result.type, 'cancel');
            assert.strictEqual(result.to, '**********@tgtg-ical.sebbo.net');
            assert.strictEqual(result.orderId, 'gd3sypjntuz');
            assert.ok(result.cancelledAt.isSame(moment('2023-07-05T17:23:43.000Z')));
        });
        it('should detect cancellation mails (2)', async function () {
            const mail = await readFile(fixtures + '/cancellation/de_2.eml', 'utf-8');
            const result = await Parser.parseMail(mail);
            assert.strictEqual(result.type, 'cancel');
            assert.strictEqual(result.to, '**********@tgtg-ical.sebbo.net');
            assert.strictEqual(result.orderId, 'q3uxig9diky');
            assert.ok(result.cancelledAt.isSame(moment('2023-03-09T12:08:29.000Z')));
        });
    });
});
