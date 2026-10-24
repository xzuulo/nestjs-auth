import { registerAs } from '@nestjs/config';
import type { DatabaseConfig } from './database.types.js';

export default registerAs('database', (): DatabaseConfig => ({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USERNAME ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? '1234',
  database: process.env.DATABASE_NAME ?? 'mydb',
}));
