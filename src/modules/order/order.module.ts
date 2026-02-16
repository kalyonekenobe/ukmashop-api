import { Module } from '@nestjs/common';
import { OrderController } from 'src/modules/order/order.controller';
import { OrderRepository } from 'src/modules/order/order.repository';
import { OrderService } from 'src/modules/order/order.service';


@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
