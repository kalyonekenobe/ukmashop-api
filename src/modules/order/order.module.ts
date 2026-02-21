import { Module } from '@nestjs/common';
import { OrderController } from 'src/modules/order/order.controller';
import { OrderGeneratorService } from 'src/modules/order/order-generator.service';
import { OrderRepository } from 'src/modules/order/order.repository';
import { OrderService } from 'src/modules/order/order.service';
import { SseModule } from 'src/modules/sse/sse.module';

@Module({
  imports: [SseModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderGeneratorService],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
