import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class ExecuteQueryDto {
  @ApiProperty({
    description: 'SQL query to execute',
    example: 'SELECT * FROM test_table WHERE id = $1',
  })
  @IsString()
  query: string;

  @ApiProperty({
    description: 'Parameters for the query',
    example: [1],
    required: false,
  })
  @IsOptional()
  @IsArray()
  params?: any[];
}

export class InsertRecordDto {
  @ApiProperty({
    description: 'Table name to insert into',
    example: 'test_table',
  })
  @IsString()
  tableName: string;

  @ApiProperty({
    description: 'Data payload to insert',
    example: {
      name: 'John Doe',
      email: 'john@example.com',
      description: 'Test record description'
    },
  })
  payload: Record<string, any>;
}

export class TruncateTableDto {
  @ApiProperty({
    description: 'Table name to truncate (clear all data)',
    example: 'test_table',
  })
  @IsString()
  tableName: string;

  @ApiProperty({
    description: 'Whether to restart identity sequences (auto-increment columns)',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  restartIdentity?: boolean = false;
}