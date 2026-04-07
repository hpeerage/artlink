import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./db/schema";
import * as dotenv from "dotenv";

dotenv.config();

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

export const client = createClient({
  url: url,
  authToken: authToken,
});

export const db = drizzle(client, { schema });
