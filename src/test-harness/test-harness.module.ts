import { Module } from '@nestjs/common';
import { TestHarnessController } from './test-harness.controller';
import { TestHarnessService } from './test-harness.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TestHarnessController],
  providers: [TestHarnessService],
})
export class TestHarnessModule {}