import 'dotenv/config'
import winston from "winston";

const customLevelOpt = {
    levels:{
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue'
    }
}
if(process.env.ENTORNO === 'development'){
    customLevelOpt.levels.debug = 4
    customLevelOpt.colors.debug = 'cyan'
}

const logger = winston.createLogger({
    levels: customLevelOpt.levels,
    transports: [
        new winston.transports.File({
            filename: './errors.log',
            level: 'fatal',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOpt.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOpt.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './loggers.log',
            level: 'warning',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOpt.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './loggers.log',
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOpt.colors}),
                winston.format.simple()
            )
        }),
        process.env.ENTORNO === 'development' && (
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevelOpt.colors}),
                    winston.format.simple()
                )
            })
        )
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = logger;
    if(process.env.ENTORNO === 'development'){
        req.logger.debug(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`)
    }
    next()
}