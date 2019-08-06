import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { OrderProviders } from './order/order.providers';

@Module({
  imports: [],
  controllers: [AppController, OrderController],
  providers: [AppService, OrderService, OrderProviders],
})
export class AppModule { }
