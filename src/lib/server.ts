import { generateName, generateNameWithNumber } from '@criblinc/docker-names';
import { readFile } from 'fs/promises';
import { ICalAlarmType, ICalCalendar, ICalEventStatus } from 'ical-generator';
import moment from 'moment-timezone';
import { randomUUID } from 'node:crypto';

import Config from './config.js';
import { type User } from './db.js';
import prisma from './db.js';
import { DEFAULT_EMOJI } from './emoji.js';

export default class ServerLib {
    static async createUser() {
        let user: undefined | User;

        // eslint-disable-next-line no-constant-condition
        for (let c = 0; true; c++) {
            const prefix = this.generatePrefix(c);
            try {
                user = await prisma.user.create({
                    data: {
                        prefix,
                    },
                });
                if (user) {
                    break;
                }
            } catch (error) {
                if (
                    error &&
                    typeof error === 'object' &&
                    'code' in error &&
                    error.code === 'P2002'
                ) {
                    continue;
                }

                throw error;
            }
        }
        if (!user) {
            throw new Error('User not created');
        }

        return user;
    }

    static async generateCalendar(userId: string) {
        const user = await prisma.user.findUniqueOrThrow({
            select: {
                event: {
                    select: {
                        amount: true,
                        canceledAt: true,
                        createdAt: true,
                        from: true,
                        id: true,
                        location: {
                            select: {
                                address: true,
                                emoji: true,
                                latitude: true,
                                longitude: true,
                                name: true,
                            },
                        },
                        orderId: true,
                        price: true,
                        to: true,
                    },
                },
                id: true,
            },
            where: {
                id: userId,
            },
        });

        const cal = new ICalCalendar({
            events: user.event.map((event) => {
                const price = new Intl.NumberFormat('de-DE', {
                    currency: 'EUR',
                    style: 'currency',
                }).format(event.price / 100);

                let status: ICalEventStatus = ICalEventStatus.CONFIRMED;
                if (event.canceledAt) {
                    status = ICalEventStatus.CANCELLED;
                }

                return {
                    alarms: [{ trigger: 600, type: ICalAlarmType.display }],
                    created: event.createdAt,
                    description: `${event.amount}x\n${price}`,
                    end: event.to,
                    id: event.id,
                    location: {
                        address: event.location.address,
                        geo:
                            event.location.latitude && event.location.longitude
                                ? {
                                      lat: event.location.latitude,
                                      lon: event.location.longitude,
                                  }
                                : undefined,
                        title: event.location.name,
                    },
                    start: event.from,
                    status,
                    summary: `${event.location.emoji || DEFAULT_EMOJI} ${event.location.name}`,
                    timestamp: event.createdAt,
                    url: `https://share.toogoodtogo.com/receipts/details/${event.orderId}`,
                };
            }),
            name: 'TGTG',
            ttl: 60 * 60,
        });

        this.updateUserLastSeen(userId);
        return cal.toString();
    }

    static generatePrefix(c = 0) {
        if (c > 100) {
            return randomUUID();
        }

        if (c < 10) {
            return generateName();
        }

        return generateNameWithNumber();
    }

    static async generateUserPage(userId: string) {
        const [user, html] = await Promise.all([
            this.getUser(userId),
            readFile(Config.src('templates/user.html'), 'utf-8'),
        ]);

        return html
            .replace(
                /\${CALENDAR_URL}/g,
                `${Config.baseUrl}/${user.id}/calendar.ical`,
            )
            .replace(/\${EMAIL_ADDRESS}/g, `${user.prefix}${Config.baseMail}`);
    }

    static async getUser(userId: string) {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
        });

        this.updateUserLastSeen(user.id);
        return user;
    }

    static async isHealthy() {
        const c = await prisma.mail.count({
            where: {
                createdAt: {
                    lt: moment().subtract(30, 'minutes').toDate(),
                },
            },
        });
        if (c > 0) {
            throw new Error(`There are ${c} unhandled mails in the queue!`);
        }
    }

    static updateUserLastSeen(userId: string) {
        prisma.user
            .update({
                data: { lastSeenAt: new Date() },
                where: { id: userId },
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
