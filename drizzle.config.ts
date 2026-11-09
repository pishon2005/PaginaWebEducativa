import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const migrationUrl = process.env.DATABASE_MIGRATION_URL;
if (!migrationUrl) {
  throw new Error(
    "DATABASE_MIGRATION_URL debe configurarse para ejecutar Drizzle Kit.",
  );
}

export default defineConfig({
  schema: "./src/lib/db/schema",
  // Draft output only; applied migrations remain exclusively under supabase/migrations.
  out: "./supabase/migration-drafts",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationUrl,
  },
  verbose: true,
  strict: true,
});
