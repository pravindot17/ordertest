import { Controller, Post, Body, HttpCode, Get, Param, Put, ConflictException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { USER_PAYMENT_CREDS } from '../constants';
import { OrderMachine } from './state-machine/order.state';
import { CancelOrderDto } from './dto/cancel-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @HttpCode(200)
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<object> {
    createOrderDto.paymentDetails = USER_PAYMENT_CREDS;
    createOrderDto.orderState = 'init';
    const orderMachine = new OrderMachine(createOrderDto);
    const fsm = orderMachine.machine;
    await fsm.create(this.orderService);
    const orderResult = fsm.savedOrder;
    if (!fsm.can('confirm')) {
      throw new ConflictException('Confirm transition is not allowed');
    }
    // trigger payment call by doing transition to confirm
    await fsm.confirm(this.orderService);

    return { status: 'created', orderResult };
  }

  @Put('cancel')
  async cancelOrder(@Body() cancelOrderDto: CancelOrderDto): Promise<object> {

    const order = await this.orderService.getOrderDetails(cancelOrderDto.orderId);
    const orderMachine = new OrderMachine(order);
    const fsm = orderMachine.machine;
    if (!fsm.can('cancel')) {
      throw new ConflictException('Cancel transition is not allowed');
    }

    await fsm.cancel(this.orderService);
    return { status: 'cancelled' };
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
