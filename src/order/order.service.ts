import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Order } from './order.interface';
import { CreateOrderDto } from './create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject('order')
    private readonly orderModel: Model<Order>,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdCat = new this.orderModel(createOrderDto);
    return await createdCat.save();
  }

  async findAll(): Promise<Order[]> {
    return await this.orderModel.find().exec();
  }
}