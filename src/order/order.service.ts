import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderState } from './state-machine/order.state';

@Injectable()
export class OrderService {

  constructor(@InjectModel('Order') private readonly orderModel: Model<Order>) { }

  async create(createOrderDto: CreateOrderDto): Promise<any> {

    const createdOrder = new this.orderModel(createOrderDto);
    createdOrder.orderId = this.generateOrderId();
    createdOrder.orderState = 'created';
    createdOrder.orderHistory = [{ state: 'created', createdOn: Date.now }];

    const orderResponse = await createdOrder.save();
    // const order = new OrderState();
    // order.setState(order.createdOrderState);
    return orderResponse;
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
