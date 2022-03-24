import "dotenv/config";

import Bot from "./Bot";
import { logger } from "./utils/logger";


process.on("uncaughtException", err => {
	logger.error(`Uncaught exception: ${err}`);
});

const bot = new Bot();
bot.initialise();
