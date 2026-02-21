import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { OrderRepository } from 'src/modules/order/order.repository';
import { SseService } from 'src/modules/sse/sse.service';

const ADDRESSES = [
  '123 Main St, Kyiv, Ukraine',
  '456 Independence Ave, Lviv, Ukraine',
  '789 Shevchenko Blvd, Odesa, Ukraine',
  '321 Khreshchatyk St, Kyiv, Ukraine',
  '654 Franko St, Ivano-Frankivsk, Ukraine',
  '987 Lesia Ukrainka Blvd, Kyiv, Ukraine',
  '111 Mazepa Ave, Chernihiv, Ukraine',
  '222 Hrushevskoho St, Dnipro, Ukraine',
];

const NOTES = [
  'Leave at the front door',
  'Call before delivery',
  'Fragile items inside',
  null,
  'Ring the doorbell twice',
  null,
  'Deliver after 5 PM',
  'Gift wrapping requested',
];

const ORDER_GENERATION_INTERVAL_MS = 10_000;

@Injectable()
export class OrderGeneratorService {
  private readonly logger = new Logger(OrderGeneratorService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderRepository: OrderRepository,
    private readonly sseService: SseService,
  ) {}

  @Interval(ORDER_GENERATION_INTERVAL_MS)
  async generateRandomOrder(): Promise<void> {
    try {
      const [users, products] = await Promise.all([
        this.prismaService.user.findMany({ select: { id: true } }),
        this.prismaService.product.findMany({ select: { id: true } }),
      ]);

      if (users.length === 0 || products.length === 0) {
        this.logger.warn('Cannot generate random order: no users or products in the database');
        return;
      }

      const randomUser = users[Math.floor(Math.random() * users.length)];
      const productCount = Math.floor(Math.random() * Math.min(3, products.length)) + 1;
      const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
      const selectedProducts = shuffledProducts.slice(0, productCount);

      const orderProducts = selectedProducts.map(product => ({
        productId: product.id,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: (Math.random() * 100 + 5).toFixed(2),
      }));

      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 14) + 3);

      const order = await this.orderRepository.create(
        {
          shippingAddress: ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)],
          billingAddress: ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)],
          notes: NOTES[Math.floor(Math.random() * NOTES.length)] ?? undefined,
          estimatedDelivery,
          tax: (Math.random() * 20 + 1).toFixed(2),
          shippingCost: (Math.random() * 15 + 2).toFixed(2),
          products: orderProducts,
        },
        { id: randomUser.id } as any,
      );

      this.sseService.emitOrderCreated(order);
      this.logger.log(`Random order generated: ${order.id}`);
    } catch (error) {
      this.logger.error('Failed to generate random order', error);
    }
  }
}
