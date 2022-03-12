import { createLogger, format as formatter, transports } from 'winston';

export const buildProdLogger = () => {
	return createLogger({
		format: formatter.combine(
			formatter.timestamp(),
			formatter.errors({ stack: true }),
			formatter.printf(({ level, message, timestamp, stack }) => {
				return `(${timestamp}) ${level}: ${stack ?? message}`;
			}),
			formatter.json()
		),
		transports: [new transports.Console()],
	});
};
