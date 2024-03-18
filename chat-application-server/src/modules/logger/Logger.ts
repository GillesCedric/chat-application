import * as winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import CONFIG from '../../config/config.json'
import SERVICES from '../../config/services.json'

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug'

export default abstract class Logger {
  protected logger: winston.Logger
  protected serviceName: string
  protected datePattern: string
  protected logsPath: string
  protected maxSize: string
  protected maxFiles: string
  protected timestampFormat: string


  constructor() {
    this.datePattern = 'DD-MM-YY'
    this.maxSize = '20m'
    this.maxFiles = '30d'
    this.timestampFormat = 'YYYY-MM-DD hh:mm:ss.SSS A'
  }

  config = () => {

    this.logger = winston.createLogger({
      defaultMeta: {
        service: this.serviceName
      },
      transports: process.env.NODE_ENV == "production" ? [
        new winston.transports.Console({
          format: winston.format.cli()
        }),
      ] : [
        new DailyRotateFile({
          filename: `${this.logsPath}-%DATE%.log`,
          datePattern: this.datePattern,
          zippedArchive: true,
          maxSize: this.maxSize,
          maxFiles: this.maxFiles,
          format: winston.format.combine(winston.format.timestamp({
            format: this.timestampFormat,
          }),
            winston.format.json(),
          )
        }),
      ],
      exceptionHandlers: process.env.NODE_ENV == "production" ? [
        new DailyRotateFile({
          filename: `${this.logsPath}-exceptions-%DATE%.log`,
          datePattern: this.datePattern,
          zippedArchive: true,
          maxSize: this.maxSize,
          maxFiles: this.maxFiles,
          format: winston.format.combine(winston.format.timestamp({
            format: this.timestampFormat,
          }),
            winston.format.json(),
          )

        }),
      ] : null,
      rejectionHandlers: process.env.NODE_ENV == "production" ? [
        new DailyRotateFile({
          filename: `${this.logsPath}-rejections-%DATE%.log`,
          datePattern: this.datePattern,
          zippedArchive: true,
          maxSize: this.maxSize,
          maxFiles: this.maxFiles,
          format: winston.format.combine(winston.format.timestamp({
            format: this.timestampFormat,
          }),
            winston.format.json(),
          )
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

  http = (message: string, level: LogLevel = 'http') => {
    this.logger.log({ level, message })
  }

}

class APIGWLogger extends Logger {
  constructor() {
    super()
    this.logsPath = `dist/services/${SERVICES[process.env.NODE_ENV][0].name}/logs/${CONFIG.appname}`
    this.serviceName = SERVICES[process.env.NODE_ENV][0].name
  }
}

export const apiGWLogger = new APIGWLogger()

class USERLogger extends Logger {
  constructor() {
    super()
    this.logsPath = `dist/services/${SERVICES[process.env.NODE_ENV][2].name}/logs/${CONFIG.appname}`
    this.serviceName = SERVICES[process.env.NODE_ENV][2].name
  }
}

export const userLogger = new USERLogger()

class CHATLogger extends Logger {
  constructor() {
    super()
    this.logsPath = `dist/services/${SERVICES[process.env.NODE_ENV][1].name}/logs/${CONFIG.appname}`
    this.serviceName = SERVICES[process.env.NODE_ENV][1].name
  }
}

export const chatLogger = new CHATLogger()


class NOTIFICATIONLogger extends Logger {
  constructor() {
    super()
    this.logsPath = `dist/services/${SERVICES[process.env.NODE_ENV][3].name}/logs/${CONFIG.appname}`
    this.serviceName = SERVICES[process.env.NODE_ENV][3].name
  }
}

export const NotificationLogger = new NOTIFICATIONLogger()