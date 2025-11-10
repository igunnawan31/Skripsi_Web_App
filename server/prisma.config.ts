import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import type { PrismaConfig } from 'prisma';

const nodeEnv = process.env.NODE_ENV ?? 'development';
const envFile = `.env.${nodeEnv}`;

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
  console.log(`[prisma] Loaded environment from ${envFile}`);
} else {
  dotenv.config();
  console.log('[prisma] Loaded default .env file');
}

const databaseUrl = process.env.DATABASE_URL;
console.log(databaseUrl);
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

export default {
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'ts-node --compiler-options \'{"module":"CommonJS"}\' prisma/seed.ts',
  },
  views: {
    path: path.join('prisma', 'views'),
  },
  typedSql: {
    path: path.join('prisma', 'queries'),
  },
  engine: 'classic',
  datasource: {
    url: databaseUrl,
  },
} satisfies PrismaConfig;
