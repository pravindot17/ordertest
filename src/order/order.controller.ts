import { Controller, Post, Body, HttpCode, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @HttpCode(200)
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<object> {
    const orderResult = await this.orderService.create(createOrderDto);
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
