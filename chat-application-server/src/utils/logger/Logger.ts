import * as winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import CONFIG from '../../config/config.json'

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug'

class Logger {
  private logger: winston.Logger

  constructor() {

  }

  config = () => {
    const datePattern = 'DD-MM-YY'
    this.logger = winston.createLogger({
      transports: process.env.NODE_ENV == "development" ? [
        new winston.transports.Console({
          format: winston.format.cli()
        }),
      ] : [
        new DailyRotateFile({
          filename: `logs/${CONFIG.appname}-%DATE%.log`,
          datePattern: datePattern,
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
          format: winston.format.combine(winston.format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
          }),
            winston.format.json(),
          )
        }),
      ],
      exceptionHandlers: process.env.NODE_ENV == "production" ? [
        new DailyRotateFile({
          filename: `logs/${CONFIG.appname}-exceptions-%DATE%.log`,
          datePattern: datePattern,
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
          format: winston.format.simple(), //TODO test json format
        }),
      ] : null,
      rejectionHandlers: process.env.NODE_ENV == "production" ? [
        new DailyRotateFile({
          filename: `logs/${CONFIG.appname}-rejections-%DATE%.log`,
          datePattern: datePattern,
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
          format: winston.format.simple(), //TODO test json format
        }),
      ] : null,
    });
  }

  log = (message: string, level: LogLevel = 'info') => {
    this.logger.log({ level, message })
  }

  error = (message: string, level: LogLevel = 'error') => {
    this.logger.log({ level, message })
  }

  debug = (message: string, level: LogLevel = 'debug') => {
    this.logger.log({ level, message })
  }

  warn = (message: string, level: LogLevel = 'warn') => {
    this.logger.log({ level, message })
  }
}

export default new Logger()
