import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { testTable } from '../database/schema';
import { InsertRecordDto, TruncateTableDto } from '../dto/query.dto';

@Injectable()
export class TestHarnessService {
  private readonly logger = new Logger(TestHarnessService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async executeQuery(query: string, params?: any[]): Promise<any> {
    this.logger.log(`Executing query: ${query}`);
    
    if (params) {
      this.logger.log(`With parameters: ${JSON.stringify(params)}`);
    }

    return await this.databaseService.executeRawQuery(query, params);
  }

  async insertRecord(data: InsertRecordDto): Promise<any> {
    this.logger.log(`Inserting into table '${data.tableName}': ${JSON.stringify(data.payload)}`);
    
    // For dynamic table insertion, we'll use raw SQL for flexibility
    // This allows inserting into any table with any payload structure
    const columns = Object.keys(data.payload);
    const values = Object.values(data.payload);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${data.tableName} (${columns.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    this.logger.log(`Generated query: ${query}`);
    this.logger.log(`With values: ${JSON.stringify(values)}`);
    
    const result = await this.databaseService.executeRawQuery(query, values);
    return result[0];
  }

  async getAllRecords(): Promise<any[]> {
    this.logger.log('Retrieving all records from test_table');
    
    const db = this.databaseService.getDatabase();
    return await db.select().from(testTable);
  }

  async truncateTable(data: TruncateTableDto): Promise<any> {
    this.logger.log(`Truncating table '${data.tableName}'${data.restartIdentity ? ' and restarting identity sequences' : ''}`);
    
    // Build the TRUNCATE query with optional RESTART IDENTITY
    const restartClause = data.restartIdentity ? ' RESTART IDENTITY' : '';
    const query = `TRUNCATE TABLE ${data.tableName}${restartClause}`;
    
    this.logger.log(`Generated query: ${query}`);
    
    await this.databaseService.executeRawQuery(query);
    
    return {
      message: `Table '${data.tableName}' truncated successfully`,
      restartedIdentity: data.restartIdentity || false,
    };
  }
}