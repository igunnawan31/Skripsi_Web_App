import path from 'node:path';
import fs from 'node:fs';
import dotenv, { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

const nodeEnv = process.env.NODE_ENV ?? 'development';
const envFile = `.env.${nodeEnv}`;

config({
  path: "../../.env",
})

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
  console.log(`[prisma] Loaded environment from ${envFile}`);
} else {
  dotenv.config();
  console.log('[prisma] Loaded default .env file');
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'tsx prisma/seed.ts',
  },
  views: {
    path: path.join('prisma', 'views'),
  },
  typedSql: {
    path: path.join('prisma', 'queries'),
  },
  datasource: {
    url: databaseUrl,
  },
});
