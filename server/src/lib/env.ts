import { config } from "dotenv";

config({ path: ".env" });

export const { PORT, SALT, JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } = process.env;
