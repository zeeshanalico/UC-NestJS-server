import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import * as fs from 'fs';
import 'winston-daily-rotate-file';

// Get today's date string
const date = new Date();
const dateString =
  ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate())
  + '-'
  + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1))
  + '-'
  + date.getFullYear();

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
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(({ timestamp, level, message, context, trace, reqHost, reqType }) => {
      return `${timestamp} [${level}] ${context ? `[${context}]` : ''} ${message} ${reqHost ? `[Host: ${reqHost}]` : ''
        } ${reqType ? `[Type: ${reqType}]` : ''} ${trace ? `[Trace: ${trace}]` : ''}`;
    })
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
        format.colorize(),
        format.simple(),
        format.printf((request) => {
          const { level, message , reqHost = '', method, url } = request;          

          return `${dateString} [${level}]: ${message} ${reqHost}${url}`
        }),
      ),
    })
  ];

// Configure logger
export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.errors({ stack: true }), // capture stack trace
    format.splat(), // for printf format interpolation
    format.json(),
  ),
  transports: loggerTransports,
});
