import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Order } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {

  async create(createOrderDto: CreateOrderDto): Promise<any> {
    // const createdOrder = new this.orderModel(createOrderDto);
    // return await createdOrder.save();
    return new Promise((resolve) => resolve({ name: 'Order' }));
  }

  // async findAll(): Promise<Order[]> {
  //   // return await this.orderModel.find().exec();
  // }
}
