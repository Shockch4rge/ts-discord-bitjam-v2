import "dotenv/config";

import Bitjam from "./Bitjam";
import { logger } from "./utils/logger";


process.on("uncaughtException", err => {
	logger.error(`Uncaught exception: ${err}`);
});

new Bitjam();