import { Module } from '@nestjs/common';
import { SseController } from 'src/modules/sse/sse.controller';
import { SseService } from 'src/modules/sse/sse.service';

@Module({
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService],
})
export class SseModule {}
