import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import * as fs from 'fs';
import 'winston-daily-rotate-file';

// Create logs directory if not exists
const logsDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

const dailyRotateFileTransport = (level: string) => new transports.DailyRotateFile({
  level,
  dirname: logsDirectory,
  filename: `%DATE%-${level}.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
});

const isProduction = process.env.NODE_ENV.trim() == 'production';

const loggerTransports = isProduction
  ? [
    dailyRotateFileTransport('info'),
    dailyRotateFileTransport('warn'),
    dailyRotateFileTransport('error'),
  ]
  : [
    new transports.Console({
      format: format.combine(
        format.colorize({all:true}),
        format.align(),
        format.simple(),
        format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A', // 2022-01-25 03:23:10.350 PM
        }),
        format.printf(({ timestamp, level, message, context, trace }) => {
          return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
        }),
      ),
    })
  ];

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.errors({ stack: true }), // capture stack trace
    format.splat(), // for printf format interpolation
    format.json(),
  ),
  transports: loggerTransports,
});

    // format.printf(({ timestamp, level, message, context, trace, reqHost, reqType }) => {
    //   return `${timestamp} [${level}] ${context ? `[${context}]` : ''} ${message} ${reqHost ? `[Host: ${reqHost}]` : ''
    //     } ${reqType ? `[Type: ${reqType}]` : ''} ${trace ? `[Trace: ${trace}]` : ''}`;
    // })
    