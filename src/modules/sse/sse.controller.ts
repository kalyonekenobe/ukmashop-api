import { Controller, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable, map } from 'rxjs';
import { RoutesApiTags } from 'src/core/constants';
import { Routes } from 'src/core/enums/app.enums';
import { SseService } from 'src/modules/sse/sse.service';

@ApiTags(RoutesApiTags[Routes.Sse])
@Controller(Routes.Sse)
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('orders')
  orderEvents(): Observable<MessageEvent> {
    return this.sseService.getOrderStream().pipe(
      map(event => ({
        data: JSON.stringify(event),
      }) as MessageEvent),
    );
  }
}
