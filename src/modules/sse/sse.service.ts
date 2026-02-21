import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

export interface OrderSseEvent {
  type: 'order_created';
  data: OrderEntity;
}

@Injectable()
export class SseService {
  private readonly orderSubject = new Subject<OrderSseEvent>();

  emitOrderCreated(order: OrderEntity): void {
    this.orderSubject.next({ type: 'order_created', data: order });
  }

  getOrderStream(): Observable<OrderSseEvent> {
    return this.orderSubject.asObservable();
  }
}
