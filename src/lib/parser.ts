import { captureException } from '@sentry/node';
import he from 'he';
import { type ParsedMail, simpleParser } from 'mailparser';
import moment from 'moment-timezone';

import type { Location, Mail, User } from './db.js';

import config from './config.js';
import Config from './config.js';
import prisma from './db.js';
import getEmoji from './emoji.js';

type AnyMail = (CancellationMail | ChangeMail | InvoiceMail | OrderMail) & {
    to: string;
};

interface CancellationMail {
    cancelledAt: moment.Moment;
    orderId: string;
    type: 'cancel';
}

interface ChangeMail {
    orderId: string;
    time: {
        from: moment.Moment;
        to: moment.Moment;
    };
    type: 'change';
}

interface InvoiceMail {
    invoicedAt: moment.Moment;
    orderId: string;
    type: 'invoice';
}

interface OrderMail {
    amount: number;
    location: {
        address: string;
        name: string;
    };
    orderId: string;
    price: number;
    time: {
        from: moment.Moment;
        order: moment.Moment;
        to: moment.Moment;
    };
    type: 'order';
}

export default class Parser {
    public static async geocode(
        address: string,
    ): Promise<
        | { latitude: null; longitude: null }
        | { latitude: number; longitude: number }
    > {
        const response = await fetch(
            'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
                encodeURIComponent(address),
            {
                headers: {
                    Referer: config.baseUrl,
                    'User-Agent': `tgtg-ical/${config.version} (${config.baseUrl})`,
                },
            },
        );
        if (!response.ok) {
            throw new Error('Geocoding failed: ' + response.statusText);
        }

        // super simple way to ensure a maximum of 1 request per second in cronjobs
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            return {
                latitude: null,
                longitude: null,
            };
        }

        return {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
        };
    }

    public static async handleMail(mail: Mail) {
        try {
            const parsed = await this.parseMail(mail.raw);
            if (parsed) {
                await this.applyParsedMail(parsed);
            }

            await prisma.mail.delete({
                where: {
                    id: mail.id,
                },
            });
        } catch (error) {
            const errorId = captureException(error);
            await prisma.mail.update({
                data: {
                    error: error instanceof Error ? error.stack : String(error),
                    erroredAt: new Date(),
                    errorId,
                    version: config.version,
                },
                where: {
                    id: mail.id,
                },
            });
        }
    }

    public static async inhaleMail(email: string): Promise<void> {
        const mail = await prisma.mail.create({
            data: {
                raw: email,
            },
        });

        await this.handleMail(mail);
    }

    public static async parseMail(
        mail: string,
        baseMailPostfix = config.baseMail,
    ): Promise<AnyMail | undefined> {
        // parse email
        const email = await simpleParser(mail, {
            skipHtmlToText: true,
            skipImageLinks: true,
            skipTextLinks: true,
            skipTextToHtml: true,
        });

        if (!email.from?.value[0].address?.endsWith('toogoodtogo.com')) {
            throw new Error('Not a TGTG email!');
        }

        let to: string | undefined = (
            Array.isArray(email.to) ? email.to : [email.to]
        )
            .map((to) => to?.value)
            .flat()
            .filter((address) => !!address)
            .map((address) => address.address)
            .find((address) => address?.endsWith(baseMailPostfix));

        if (!to) {
            const received = email.headers.get('received');
            const regexp = new RegExp(`([\\w-]+${Config.baseMail})`, 'i');
            if (Array.isArray(received)) {
                received.forEach((r) => {
                    const s = typeof r === 'string' ? r : r.value;
                    const match = s.match(regexp);
                    if (match) {
                        to = match[1];
                    }
                });
            }
        }
        if (!to) {
            throw new Error('No recipient found!');
        }

        // Order confirmation
        if (email.headers.get('x-pm-tag') === 'consumer_order_confirm') {
            const order = this.parseOrderMail(email);
            return {
                to,
                ...order,
            };
        }

        // Time Changed
        if (email.headers.get('x-pm-tag') === 'collection_time_changed') {
            const change = this.parseChangeMail(email);
            return {
                to,
                ...change,
            };
        }

        // Cancellation
        if (email.headers.get('x-pm-tag') === 'consumer_order_reverted') {
            const cancellation = this.parseCancellationMail(email);
            if (cancellation) {
                return {
                    to,
                    ...cancellation,
                };
            }
        }

        // is invoice?
        if (email.headers.get('x-pm-tag') === 'invoice') {
            const invoice = this.parseInvoiceMail(email);
            if (invoice) {
                return {
                    to,
                    ...invoice,
                };
            }
        }

        // Non-transactional email
        if (
            !email.headers.get('x-pm-tag') &&
            !email.headers.get('x-pm-message-id')
        ) {
            return undefined;
        }

        // Unsupported email
        if (email.headers.get('x-pm-tag')) {
            throw new Error(
                `Unsupported email type: ${email.headers.get('x-pm-tag')}`,
            );
        }

        throw new Error('Not implemented!');
    }

    public static async runCleanup(): Promise<void> {
        const mails = await prisma.mail.findMany({
            orderBy: {
                erroredAt: 'asc',
            },
            take: 10,
            where: {
                OR: [
                    { error: null },
                    { version: null },
                    { version: { not: config.version } },
                ],
            },
        });
        for (const mail of mails) {
            await this.handleMail(mail);
        }

        // Cleanup Users
        const users = await prisma.user.findMany({
            orderBy: {
                lastSeenAt: 'asc',
            },
            where: {
                OR: [
                    {
                        lastSeenAt: {
                            lt: moment().subtract(8, 'weeks').toDate(),
                        },
                    },
                    {
                        createdAt: {
                            lt: moment().subtract(3, 'hours').toDate(),
                        },
                        lastSeenAt: {
                            equals: prisma.user.fields.createdAt,
                        },
                    },
                ],
            }
        });
        for (const user of users) {
            await prisma.user.delete({
                where: {
                    id: user.id,
                },
            });
        }

        // Cleanup Events
        await prisma.event.deleteMany({
            where: {
                to: {
                    lt: moment().subtract(4, 'weeks').toDate(),
                },
            },
        });

        // Cleanup Mails
        await prisma.mail.deleteMany({
            where: {
                createdAt: {
                    lt: moment().subtract(2, 'weeks').toDate(),
                },
            },
        });
    }

    private static async applyParsedMail(email: AnyMail): Promise<void> {
        const user = await this.findUser(email.to);

        if (email.type === 'order') {
            const location = await this.getLocation(email.location);

            await prisma.event.upsert({
                create: {
                    amount: email.amount,
                    from: email.time.from.toDate(),
                    location: {
                        connect: {
                            id: location.id,
                        },
                    },
                    orderedAt: email.time.order.toDate(),
                    orderId: email.orderId,
                    price: email.price,
                    to: email.time.to.toDate(),
                    user: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
                update: {
                    amount: email.amount,
                    from: email.time.from.toDate(),
                    location: {
                        connect: {
                            id: location.id,
                        },
                    },
                    price: email.price,
                    to: email.time.to.toDate(),
                },
                where: {
                    orderId: email.orderId,
                    userId: user.id,
                },
            });
        } else if (email.type === 'change') {
            await prisma.event.update({
                data: {
                    from: email.time.from.toDate(),
                    to: email.time.to.toDate(),
                },
                where: {
                    orderId: email.orderId,
                    userId: user.id,
                },
            });
        } else if (email.type === 'cancel') {
            await prisma.event.update({
                data: {
                    canceledAt: email.cancelledAt.toDate(),
                },
                where: {
                    orderId: email.orderId,
                    userId: user.id,
                },
            });
        } else if (email.type === 'invoice') {
            await prisma.event.update({
                data: {
                    invoicedAt: email.invoicedAt.toDate(),
                },
                where: {
                    orderId: email.orderId,
                    userId: user.id,
                },
            });
        } else {
            throw new Error('Unknown email type!');
        }
    }

    private static async findUser(to: string): Promise<User> {
        if (!to) {
            throw new Error('Did not found a valid recipient!');
        }

        const prefix = to.split('@')[0];
        const user = await prisma.user.findUnique({
            where: { prefix },
        });
        if (!user) {
            throw new Error(`User with email prefix ${prefix} not found!`);
        }

        return user;
    }

    private static async getLocation(
        input: OrderMail['location'],
    ): Promise<Location> {
        let location = await prisma.location.findFirst({
            where: {
                address: input.address,
                name: input.name,
            },
        });
        if (!location) {
            const emoji = getEmoji(input.name);
            const { latitude, longitude } = await this.geocode(input.address);
            location = await prisma.location.create({
                data: {
                    address: input.address,
                    emoji,
                    latitude,
                    longitude,
                    name: input.name,
                },
            });
        }

        return location;
    }

    private static parseCancellationMail(
        email: ParsedMail,
    ): CancellationMail | undefined {
        const subject = email.subject || '';
        const match = subject.match(/\((\w+)\)/);
        if (match) {
            return {
                cancelledAt: moment(email.date),
                orderId: match[1],
                type: 'cancel',
            };
        }
    }

    private static parseChangeMail(email: ParsedMail): ChangeMail {
        const matches = [
            (email.html || '').match(
                /https:\/\/share.toogoodtogo.com\/receipts\/details\/(\w+)/,
            ),
            (email.html || '').match(
                /(\d{1,2}\.\d{2}\.\d{2}) zwischen (\d{1,2}:\d{2}) und (\d{1,2}:\d{2})(?: Uhr)? (\w+)+ \(/,
            ),
        ];
        if (!matches[0]) {
            throw new Error('Order ID not found!');
        }
        if (!matches[1]) {
            throw new Error('Date / Time not found!');
        }

        let timezone = matches[1][4];
        if (timezone === 'MEZ') {
            timezone = 'MET';
        }

        const from = moment.tz(
            matches[1][1] + ' ' + matches[1][2],
            'DD.MM.YY HH:mm',
            timezone,
        );
        const to = moment.tz(
            matches[1][1] + ' ' + matches[1][3],
            'DD.MM.YY HH:mm',
            timezone,
        );

        return {
            orderId: matches[0][1].trim(),
            time: {
                from,
                to,
            },
            type: 'change',
        };
    }

    private static parseInvoiceMail(email: ParsedMail): InvoiceMail {
        const html = email.html || '';
        const match = html.match(/Die Rechnung für deine Bestellung (\w+)/);
        if (match) {
            return {
                invoicedAt: moment(email.date),
                orderId: match[1],
                type: 'invoice',
            };
        }

        throw new Error('Order Id not found!');
    }

    private static parseOrderMail(email: ParsedMail): OrderMail {
        const html = email.html || '';
        const matches = [
            html.match(/\/order\/([^/]+)\//),
            html.match(/Wir bestätigen hiermit deine Bestellung bei ([^(.<]+)/),
            html.match(
                /<span>Du kannst deine Bestellung am (\d{1,2}\.\d{2}\.\d{2}) zwischen (\d{1,2}:\d{2}) und (\d{1,2}:\d{2}) Uhr (\w+)[^:]+: (.+).<\/span><\/div>/,
            ),
            html.match(
                /<span>Du kannst deine Bestellung zwischen (\d{1,2}\.\d{1,2}), (\d{1,2}:\d{2}) und (\d{1,2}:\d{2})[^:]+: (.+).<\/span><\/div>/,
            ),
            html.match(
                /<b>Datum:<\/b>\s+<span>(\d{1,2}\.\d{2}\.\d{2})<\/span>/,
            ),
            html.match(
                /Abholzeit:<\/b>\s+<span>(\d{1,2}:\d{2}) - (\d{1,2}:\d{2}) (\w+)/,
            ),
            html.match(/Anzahl: (\d+)/),
            html.match(/Anzahl:<\/b>\s+<span>(\d+)/),
            html.match(/Gesamtpreis: ([\d,.]+)[^\d,.]/),
            html.match(/Gesamtpreis:<\/b>\s+<span>([\d,.]+)[^\d,.]/),
            html.match(/Standort:<\/b>\s+<span>([^<]+)/),
        ];
        if (!matches[0]) {
            throw new Error('Order ID not found!');
        }
        if (!matches[1]) {
            throw new Error('Location name not found!');
        }
        if (!matches[2] && !matches[3] && !(matches[4] && matches[5])) {
            throw new Error('Date, time and address not found (1)!');
        }

        let timezone = 'MET';
        if (matches[2]) {
            timezone = matches[2][4];
        }
        if (matches[5]) {
            timezone = matches[5][3];
        }
        if (timezone === 'MEZ') {
            timezone = 'MET';
        }

        const now = moment(email.date);
        let from: moment.Moment | undefined;
        let to: moment.Moment | undefined;
        let address: string | undefined;

        if (matches[2]) {
            from = moment.tz(
                matches[2][1] + ' ' + matches[2][2],
                'DD.MM.YY HH:mm',
                timezone,
            );
            to = moment.tz(
                matches[2][1] + ' ' + matches[2][3],
                'DD.MM.YY HH:mm',
                timezone,
            );
            address = matches[2][5].trim();
        }
        if (matches[3]) {
            const year = now.year();
            from = moment.tz(
                matches[3][1] + '.' + year + ' ' + matches[3][2],
                'DD.MM.YYYY HH:mm',
                timezone,
            );
            to = moment.tz(
                matches[3][1] + '.' + year + ' ' + matches[3][3],
                'DD.MM.YYYY HH:mm',
                timezone,
            );
            address = matches[3][4].trim();

            if (from.isBefore(now)) {
                from.add(1, 'year');
            }
            if (to.isBefore(from)) {
                to.add(1, 'year');
            }
        }
        if (matches[4] && matches[5] && matches[10]) {
            from = moment.tz(
                matches[4][1] + ' ' + matches[5][1],
                'DD.MM.YY HH:mm',
                timezone,
            );
            to = moment.tz(
                matches[4][1] + ' ' + matches[5][2],
                'DD.MM.YY HH:mm',
                timezone,
            );
            address = matches[10][1].trim();
        }

        if (!from || !to || !address) {
            throw new Error('Date, time or address not found (2)!');
        }

        let amount = 0;
        if (matches[6]) {
            amount = parseInt(matches[6][1], 10);
        } else if (matches[7]) {
            amount = parseInt(matches[7][1], 10);
        } else {
            throw new Error('Amount not found!');
        }
        if (isNaN(amount)) {
            throw new Error('Amount (1) is not a number!');
        }

        let price = 0;
        if (matches[8]) {
            price = parseInt(matches[8][1].replace(/[.|,]/g, ''));
        } else if (matches[9]) {
            price = parseInt(matches[9][1].replace(/[.|,]/g, ''));
        } else {
            throw new Error('Price not found!');
        }
        if (isNaN(price)) {
            throw new Error('Price is not a number!');
        }

        let name = he.decode(matches[1][1].trim());
        if (name.endsWith('!')) {
            name = name.slice(0, -1);
        }

        return {
            amount,
            location: {
                address: he.decode(address),
                name,
            },
            orderId: matches[0][1].trim(),
            price,
            time: {
                from,
                order: now,
                to,
            },
            type: 'order',
        };
    }
}
