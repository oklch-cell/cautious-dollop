import { defineConfig } from 'drizzle-kit';

import 'dotenv/config';

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  schemaFilter: ['public'],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
