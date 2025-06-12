import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { testTable } from '../database/schema';
import { InsertRecordDto } from '../dto/query.dto';

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
    this.logger.log(`Inserting record: ${JSON.stringify(data)}`);
    
    const db = this.databaseService.getDatabase();
    const result = await db.insert(testTable).values(data).returning();
    
    return result[0];
  }

  async getAllRecords(): Promise<any[]> {
    this.logger.log('Retrieving all records from test_table');
    
    const db = this.databaseService.getDatabase();
    return await db.select().from(testTable);
  }
}