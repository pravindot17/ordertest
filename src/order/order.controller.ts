import { Controller, Post, Body, HttpCode, BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @HttpCode(200)
  async createOrder(@Body() body): Promise<object> {
    if (!body) throw new BadRequestException('Please provide valid request body')
    if (!body.name) throw new BadRequestException('Please provide valid customer name')
    if (!body.email) throw new BadRequestException('Please provide valid customer email')
    if (!body.address) throw new BadRequestException('Please provide valid shippig address')
    if (!body.totalAmount) throw new BadRequestException('Please provide valid order total amount')
    if (!body.products && !body.products.length) throw new BadRequestException('Please provide valid products')

    return { status: 'working' };
  }
}