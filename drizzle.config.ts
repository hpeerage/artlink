// Trigger Vercel build fix v2
import { defineConfig } from "drizzle-kit";

export default defineConfig({
      schema: "./src/lib/db/schema.ts",
      out: "./drizzle",
      dialect: "turso", // Updated to 'turso' for drizzle-kit v0.31+
      dbCredentials: {
              url: process.env.TURSO_DATABASE_URL!,
              authToken: process.env.TURSO_AUTH_TOKEN!,
      },
});
