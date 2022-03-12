import { createLogger, format as formatter, transports } from 'winston';

export const buildDevLogger = () => {
	return createLogger({
		format: formatter.combine(
			formatter.colorize(),
			formatter.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
			formatter.errors({ stack: true }),
			formatter.printf(({ level, message, timestamp, stack }) => {
				return `(${timestamp}) ${level}: ${stack ?? message}`;
			})
		),
		transports: [new transports.Console()],
	});
};
