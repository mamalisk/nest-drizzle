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
    description: 'Name field',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email field',
    example: 'john@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Description field',
    example: 'Test record description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}