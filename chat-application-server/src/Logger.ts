import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

class Logger {
  private logger: winston.Logger;

  constructor() {
    const datePattern = 'DD-MM-YY';
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          filename: 'Logs/logfile-%DATE%.log',
          datePattern: datePattern,
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
          format: winston.format.simple(),
        }),
      ],
    });
  }

  log(message: string, level: string = 'info'): void {
    this.logger.log({ level, message });
  }
}

export default new Logger();
