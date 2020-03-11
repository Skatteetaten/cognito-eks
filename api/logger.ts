import winston from 'winston';

const { env } = process;

const LOG_LEVEL = env.LOG_LEVEL || 'info';

const customLevels = {
  error: 0,
  warning: 1,
  info: 2,
  debug: 3,
  trace: 4
};

const { combine, timestamp, printf } = winston.format;

const customFormat = printf(({ timestamp, level, message, ...rest }) => {
  return JSON.stringify(
    {
      timestamp,
      level: level.toUpperCase(),
      message: !!message ? message : '',
      ...rest
    },
    undefined,
    '  '
  );
});

export const logger = winston.createLogger({
  levels: customLevels,
  format: combine(timestamp(), customFormat),
  transports: [
    new winston.transports.Console({
      level: LOG_LEVEL
    })
  ]
});
