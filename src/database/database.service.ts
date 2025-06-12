import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: NodePgDatabase<typeof schema>;
  private pool: Pool;

  async onModuleInit() {
    console.log('🔌 Initializing database connection...');
    console.log(`Database config: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}`);
    
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'testdb',
    });

    this.db = drizzle(this.pool, { schema });
    
    try {
      // Test the connection
      const client = await this.pool.connect();
      console.log('✅ Database connection successful');
      client.release();
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('💡 Make sure PostgreSQL is running and accessible');
    }
  }

  getDatabase(): NodePgDatabase<typeof schema> {
    return this.db;
  }

  async executeRawQuery(query: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async closeConnection(): Promise<void> {
    await this.pool.end();
  }
}