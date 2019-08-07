import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {

  constructor(@InjectModel('Order') private readonly orderModel: Model<Order>) { }

  async create(createOrderDto: CreateOrderDto): Promise<any> {

    // let totalAmount1 = createOrderDto.products.map(( val) => acc + val.amount)

    const createdOrder = new this.orderModel(createOrderDto);
    return await createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return await this.orderModel.find().exec();
  }
}
