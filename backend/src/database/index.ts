import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

export type DatabaseType = ReturnType<typeof drizzle<typeof schema>>;

export class DatabaseService {
  private static instance: DatabaseType;

  static getInstance(configService: ConfigService): DatabaseType {
    if (!DatabaseService.instance) {
      const connectionString = configService.get<string>('DATABASE_URL');
      if (!connectionString) {
        throw new Error('DATABASE_URL is not defined');
      }

      const client = postgres(connectionString);
      DatabaseService.instance = drizzle(client, { schema });
    }
    return DatabaseService.instance;
  }
}

export const createDatabase = (configService: ConfigService): DatabaseType =>
  DatabaseService.getInstance(configService);
export * from './schema';
