import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  API_KEY: z.string().min(32, "API_KEY must contain at least 32 characters"),
  WORKSPACE_ID: z.string().min(1).default("local"),
  PG_POOL_MAX: z.coerce.number().int().min(1).max(20).default(5),
});

const parsed = environmentSchema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
  throw new Error(`Invalid backend configuration:\n${details}`);
}

export const config = parsed.data;