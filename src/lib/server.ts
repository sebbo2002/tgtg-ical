import prisma from './db.js';
import { randomUUID } from 'node:crypto';
import { generateName, generateNameWithNumber } from '@criblinc/docker-names';
import { User } from '@prisma/client';
import { ICalAlarmType, ICalCalendar, ICalEventStatus } from 'ical-generator';
import { DEFAULT_EMOJI } from './emoji.js';
import moment from 'moment-timezone';
import { readFile } from 'fs/promises';
import Config from './config.js';

export default class ServerLib {
    static async createUser() {
        let user: User | undefined;
        for (let c = 0; true; c++) {
            const prefix = this.generatePrefix(c);
            try {
                user = await prisma.user.create({
                    data: {
                        prefix
                    }
                });
                if(user) {
                    break;
                }
            }
            catch(error) {
                if(error.code === 'P2002') {
                    continue;
                }

                throw error;
            }
        }
        if(!user) {
            throw new Error('User not created');
        }

        return user;
    }

    static generatePrefix(c = 0) {
        if(c > 100) {
            return randomUUID();
        }

        if(c < 10) {
            return generateName();
        }

        return generateNameWithNumber();
    }

    static async getUser(userId: string) {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            }
        });

        this.updateUserLastSeen(user.id);
        return user;
    }

    static updateUserLastSeen(userId: string) {
        prisma.user.update({
            where: { id: userId },
            data: { lastSeenAt: new Date() }
        }).catch(error => {
            console.log(error);
        });
    }

    static async generateUserPage(userId: string) {
        const [user, html] = await Promise.all([
            this.getUser(userId),
            readFile(Config.src('templates/user.html'), 'utf-8')
        ]);

        return html
            .replace(/\${CALENDAR_URL}/g, `${Config.baseUrl}/${user.id}/calendar.ical`)
            .replace(/\${EMAIL_ADDRESS}/g, `${user.prefix}${Config.baseMail}`);
    }

    static async generateCalendar(userId: string) {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            select: {
                id: true,
                event: {
                    select: {
                        id: true,
                        orderId: true,
                        from: true,
                        to: true,
                        amount: true,
                        price: true,
                        location: {
                            select: {
                                name: true,
                                address: true,
                                emoji: true,
                                latitude: true,
                                longitude: true
                            }
                        },
                        createdAt: true,
                        canceledAt: true
                    }
                }
            }
        });

        const cal = new ICalCalendar({
            name: 'TGTG',
            ttl: 60 * 60,
            events: user.event.map(event => {
                const price = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
                    .format(event.price / 100);

                let status: ICalEventStatus = ICalEventStatus.CONFIRMED;
                if(event.canceledAt) {
                    status = ICalEventStatus.CANCELLED;
                }

                return {
                    id: event.id,
                    start: event.from,
                    end: event.to,
                    timestamp: event.createdAt,
                    summary: `${event.location.emoji || DEFAULT_EMOJI} ${event.location.name}`,
                    description: `${event.amount}x\n${price}`,
                    url: `https://share.toogoodtogo.com/receipts/details/${event.orderId}`,
                    status,
                    created: event.createdAt,
                    location: {
                        title: event.location.name,
                        address: event.location.address,
                        geo: event.location.latitude && event.location.longitude ? {
                            lat: event.location.latitude,
                            lon: event.location.longitude
                        } : undefined
                    },
                    alarms: [
                        {type: ICalAlarmType.display, trigger: 600},
                    ]
                };
            })
        });

        this.updateUserLastSeen(userId);
        return cal.toString();
    }

    static async isHealthy() {
        const c = await prisma.mail.count({
            where: {
                createdAt: {
                    lt: moment().subtract(30, 'minutes').toDate()
                }
            }
        });
        if(c > 0) {
            throw new Error(`There are ${c} unhandled mails in the queue!`);
        }
    }
}
