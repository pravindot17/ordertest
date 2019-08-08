import { Controller, Post, Body, HttpCode, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { USER_PAYMENT_CREDS } from '../constants';
import { OrderMachine } from './state-machine/order.state';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @HttpCode(200)
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<object> {
    createOrderDto.paymentDetails = USER_PAYMENT_CREDS;
    createOrderDto.orderState = 'init';
    let orderMachine = new OrderMachine(createOrderDto);
    let fsm = orderMachine.machine
    await fsm.create(this.orderService)
    let orderResult = fsm.savedOrder;

    // trigger payment call by doing transition to confirm
    await fsm.confirm(this.orderService);

    return { status: 'created', orderResult };
  }

  @Get(':id')
  async getOrderDetails(@Param('id') id): Promise<object> {
    return await this.orderService.getOrderDetails(id);
  }

  @Get()
  async getAllOrders(): Promise<object> {
    return await this.orderService.findAllOrders();
  }
}
