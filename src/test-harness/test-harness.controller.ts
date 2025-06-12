import {
  Controller,
  Post,
  Body,
  Get,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TestHarnessService } from './test-harness.service';
import { ExecuteQueryDto, InsertRecordDto, TruncateTableDto } from '../dto/query.dto';

@ApiTags('Test Harness')
@Controller('test-harness')
export class TestHarnessController {
  private readonly logger = new Logger(TestHarnessController.name);

  constructor(private readonly testHarnessService: TestHarnessService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }

  @Post('query')
  @ApiOperation({ summary: 'Execute a SQL query' })
  @ApiResponse({ status: 200, description: 'Query executed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid query or parameters' })
  async executeQuery(@Body() executeQueryDto: ExecuteQueryDto) {
    try {
      this.logger.log(`Executing query: ${executeQueryDto.query}`);
      const result = await this.testHarnessService.executeQuery(
        executeQueryDto.query,
        executeQueryDto.params,
      );
      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Query execution failed: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('insert')
  @ApiOperation({ 
    summary: 'Insert a record into any table',
    description: 'Generic endpoint to insert data into any specified table with dynamic payload'
  })
  @ApiResponse({ status: 201, description: 'Record inserted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or table name' })
  async insertRecord(@Body() insertRecordDto: InsertRecordDto) {
    try {
      this.logger.log(`Inserting into table '${insertRecordDto.tableName}': ${JSON.stringify(insertRecordDto.payload)}`);
      const result = await this.testHarnessService.insertRecord(insertRecordDto);
      return {
        success: true,
        data: result,
        table: insertRecordDto.tableName,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Record insertion failed: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          error: error.message,
          table: insertRecordDto.tableName,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('records')
  @ApiOperation({ summary: 'Get all records from test_table' })
  @ApiResponse({ status: 200, description: 'Records retrieved successfully' })
  async getAllRecords() {
    try {
      this.logger.log('Retrieving all records');
      const result = await this.testHarnessService.getAllRecords();
      return {
        success: true,
        data: result,
        count: result.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Record retrieval failed: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('truncate')
  @ApiOperation({ 
    summary: 'Truncate (clear all data from) any table',
    description: 'Generic endpoint to truncate any specified table, with option to restart identity sequences'
  })
  @ApiResponse({ status: 200, description: 'Table truncated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid table name or truncate operation failed' })
  async truncateTable(@Body() truncateTableDto: TruncateTableDto) {
    try {
      this.logger.log(`Truncating table '${truncateTableDto.tableName}'`);
      const result = await this.testHarnessService.truncateTable(truncateTableDto);
      return {
        success: true,
        ...result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Table truncation failed: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          error: error.message,
          table: truncateTableDto.tableName,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}