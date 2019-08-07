import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {

  constructor(@InjectModel('Order') private readonly orderModel: Model<Order>) { }

  async create(createOrderDto: CreateOrderDto): Promise<any> {

    createOrderDto.orderId = this.generateOrderId();
    const createdOrder = new this.orderModel(createOrderDto);
    return await createdOrder.save();
  }

  async findAllOrders(): Promise<Order[]> {
    return await this.orderModel.find().exec();
  }

  async getOrderDetails(id): Promise<Order> {
    return await this.orderModel.findOne({ orderId: id }).exec();
  }

  generateOrderId(length = 15) {
    return new Array(length).join().replace(/(.|$)/g, () => ((Math.random() * 36) | 0).toString(36));
  }
}
