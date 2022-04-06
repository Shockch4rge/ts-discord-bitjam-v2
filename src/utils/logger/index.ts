import winston from "winston";

import { buildDevLogger } from "./devLogger";
import { buildProdLogger } from "./prodLogger";


let logger: winston.Logger;

if (process.env.NODE_ENV === "development") {
	logger = buildDevLogger();
} else {
	//TODO: change to production logger
	logger = buildDevLogger();
}

export { logger };
