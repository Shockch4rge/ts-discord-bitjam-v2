// Credits to Zechariah Tan for providing this declaration file
declare module NodeJS {
    interface ProcessEnv {
		readonly FIREBASE__SERVICE_ACCOUNT__PROJECT_ID: string;
		readonly FIREBASE__SERVICE_ACCOUNT__PRIVATE_KEY: string;
		readonly FIREBASE__SERVICE_ACCOUNT__CLIENT_EMAIL: string;
		readonly FIREBASE__COLLECTION__GUILDS: string;
		readonly FIREBASE__COLLECTION__USERS: string;
		readonly FIREBASE__DATABASE_URL: string;

		readonly DISCORD__TOKEN: string;
		readonly DISCORD__BOT_ID: string;
		readonly DISCORD__DEV_ID: string;

		readonly SPOTIFY__REFRESH_TOKEN: string;
		readonly SPOTIFY__CLIENT_ID: string;
		readonly SPOTIFY__CLIENT_SECRET: string;

		readonly GENIUS__ACCESS_TOKEN: string;

		readonly NODE_ENV: "development" | "production";
	}
}