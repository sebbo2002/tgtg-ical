#!/usr/bin/env node
'use strict';

import express, { Express, Response } from 'express';
import cookieParser from 'cookie-parser';
import {Server} from 'http';

import prisma from '../lib/db.js';
import ServerLib from '../lib/server.js';
import Config from '../lib/config';
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import Parser from '../lib/parser.js';


class AppServer {
    static run() {
        new AppServer();
    }

    private app: Express;
    private server: Server;

    constructor() {
        this.app = express();
        this.app.use(cookieParser());

        this.setupRoutes();
        this.server = this.app.listen(process.env.PORT || 8080);

        process.on('SIGINT', () => this.stop());
        process.on('SIGTERM', () => this.stop());

        Parser.runCleanup()
            .then(() => console.log('Initial cleanup succeeded.'))
            .catch(error => {
                console.log('Initial cleanup failed:');
                console.error(error);
                process.exit(1);
            });
    }

    setupRoutes() {
        this.app.get('/ping', (req, res) => {
            res.send('pong');
        });

        this.app.get('/', (req, res) => {
            if('userId' in req.cookies && req.cookies.userId) {
                res.redirect('/' + req.cookies.userId);
                return;
            }

            ServerLib.createUser()
                .then(user => {
                    res.cookie('userId', user.id);
                    res.redirect('/' + user.id);
                })
                .catch(error => this.handleError(error, res));
        });

        this.app.get('/_health', (req, res) => {
            ServerLib.isHealthy()
                .then(() => res.sendStatus(204))
                .catch(error => this.handleError(error, res));
        });

        this.app.use(express.static(Config.src('./assets')));

        this.app.get('/:userId', (req, res) => {
            res.format({
                'text/html': () => {
                    ServerLib.generateUserPage(req.params.userId)
                        .then(html => {
                            res.cookie('userId', req.params.userId);
                            res.send(html);
                        })
                        .catch(error => this.handleError(error, res));
                },
                'application/json': () => {
                    ServerLib.getUser(req.params.userId)
                        .then(json => res.send(json))
                        .catch(error => this.handleError(error, res));
                }
            });
        });

        this.app.get('/:userId/calendar.ical', (req, res) => {
            ServerLib.generateCalendar(req.params.userId)
                .then(ical => {
                    res.set('Content-Type', 'text/calendar');
                    res.send(ical);
                })
                .catch(error => this.handleError(error, res));
        });
    }

    handleError(error: PrismaClientKnownRequestError | unknown, res: Response) {
        if(typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            res.sendStatus(404);
            return;
        }

        console.log(error);
        res.sendStatus(500);
    }

    async stop() {
        await new Promise(cb => this.server.close(cb));
        await prisma.$disconnect();

        process.exit();
    }
}

AppServer.run();
