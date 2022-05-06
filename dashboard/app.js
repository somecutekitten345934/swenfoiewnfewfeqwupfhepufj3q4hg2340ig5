const express = require('express');
const app = express();

const { mongo } = require('quickmongo');
const dotenv = require("dotenv")
dotenv.config()

const favicon = require('serve-favicon');
const helmet = require('helmet');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const {
    DASHBOARD_HOST: host,
    DASHBOARD_PORT: port = 80,
    EXPRESS_SESSION_SECRET: sessionSecret
} = process.env;

module.exports.load = async client => {
  
    const routers = {
        index: require('./routes/index.js'),
        auth: require('./routes/auth.js')(client)
    };

    if (app.get('env') === 'development') {
        app.locals.pretty = true;
    }

    app
        .use(express.static(path.join(__dirname, '/public')))
        .use('/jquery', express.static(path.join( __dirname, '..', 'node_modules', 'jquery', 'dist')))
        .use('/bootstrap', express.static(path.join(__dirname, '..', 'node_modules', 'bootstrap', 'dist')))
        .use('/popper', express.static(path.join(__dirname, '..', 'node_modules', 'popper.js', 'dist', 'umd')))
        .use(helmet())
        .use(helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: [`'self'`],
                scriptSrc: [
                    `'self'`,
                    'use.fontawesome.com'
                ],
                styleSrc: [
                    `'self'`,
                    `'unsafe-inline'`,
                    'fonts.googleapis.com'
                ],
                imgSrc: [
                    `'self'`,
                    'data:',
                    'imgur.com',
                    'i.imgur.com',
                    'discord.com',
                    'cdn.discordapp.com'
                ],
                fontSrc: [
                    `'self'`,
                    'fonts.gstatic.com'
                ] 
            }
        }))
        .use(favicon(__dirname + '/public/images/favicon.ico'))
        .use(morgan('combined', {
            stream: fs.createWriteStream(__dirname + '/dashboard.log', { flags: 'w' })
        }))
        .use(session({
            secret: sessionSecret,
            resave: false,
            saveUninitialized: true
        }))
        .use((req, res, next) => {
            res.locals.ms = require('ms');
            res.locals.session = req.session;
            res.locals.commands = client.commands;
            res.locals.bal = client.db.fetch('bal').find({tags: { $size: 3 }});
            res.locals.developers = ["501710994293129216","523579776749928449"]
;

            next();
        })
        .use(passport.initialize())
        .use(passport.session())
        .use('/', routers.index)
        .use('/auth', routers.auth)
        .set('views', path.join(__dirname, '/views'))
        .set('view engine', 'pug')
        .use('/test',(req, res) =>{ res.render("test")})
        .listen(port, err => {
            if (err) {
                console.error(err);

                return;
            }

            console.log('Connected to dashboard!');
        });
    client.user.setActivity(host, {type: "WATCHING"});
};