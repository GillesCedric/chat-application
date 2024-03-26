import * as winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import SERVICES from '../../config/services.json'
import path from 'path'
import { Services } from '../../utils/Keywords'

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug'

export default abstract class Logger {
  protected logger: winston.Logger
  protected serviceName: string
  protected readonly datePattern: string
  protected readonly logsPath: string
  protected readonly maxSize: string
  protected readonly maxFiles: string
  protected readonly timestampFormat: string
  protected readonly env: string


  constructor() {
    this.datePattern = 'DD-MM-YY'
    this.maxSize = '20m'
    this.maxFiles = '30d'
    this.timestampFormat = 'YYYY-MM-DD hh:mm:ss.SSS A'
    this.env = process.env.NODE_ENV || "development"
    this.env = "development" //TODO remove this line for the final push in production
    this.logsPath = path.join(process.cwd(), 'logs')
  }

  config = () => {

    this.logger = winston.createLogger({
      defaultMeta: {
        service: this.serviceName
      },
      transports: this.env == "development" ? [
        new winston.transports.Console({
          format: winston.format.cli()
        }),
      ] : [
          new DailyRotateFile({
          dirname: this.logsPath,
          filename: `${this.serviceName}-%DATE%.log`,
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
      exceptionHandlers: this.env == "production" ? [
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
      rejectionHandlers: this.env == "production" ? [
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
    this.serviceName = SERVICES[this.env][Services.apigw].name
  }
}

export const apiGWLogger = new APIGWLogger()

class USERLogger extends Logger {
  constructor() {
    super()
    this.serviceName = SERVICES[this.env][Services.user].name
  }
}

export const userLogger = new USERLogger()

class CHATLogger extends Logger {
  constructor() {
    super()
    this.serviceName = SERVICES[this.env][Services.chat].name
  }
}

export const chatLogger = new CHATLogger()


class NOTIFICATIONLogger extends Logger {
  constructor() {
    super()
    this.serviceName = SERVICES[this.env][Services.notification].name
  }
}

export const NotificationLogger = new NOTIFICATIONLogger()