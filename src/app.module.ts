import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { TestHarnessModule } from './test-harness/test-harness.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
          },
        },
        serializers: {
          req: (req) => ({
            method: req.method,
            url: req.url,
            headers: req.headers,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),
    DatabaseModule,
    TestHarnessModule,
  ],
})
export class AppModule {}