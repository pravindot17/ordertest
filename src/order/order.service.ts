import { Injectable, HttpService, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order, IOrderService } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { map, catchError } from 'rxjs/operators';
import { PAYMENT_API, AUTH_TOKEN } from '../constants';
import { Observable } from 'rxjs';

@Injectable()
export class OrderService implements IOrderService {

  constructor(private http: HttpService, @InjectModel('Order') private readonly orderModel: Model<Order>) { }

  async create(createOrderDto: CreateOrderDto): Promise<any> {
    const createdOrder = new this.orderModel(createOrderDto);
    createdOrder.orderId = this.generateOrderId();
    createdOrder.orderState = 'created';
    createdOrder.totalAmount = 1000;
    createdOrder.orderHistory = [{ state: 'created', createdAt: new Date() }];
    return await createdOrder.save();
  }

  updateStateChange(orderId, state, transactionId = null) {
    this.orderModel.findOne({ orderId }, (err, order) => {
      if (err) { throw new InternalServerErrorException(`Failed to change the state to ${state}`); }
      order.orderState = state;
      order.orderHistory.push({ state, createdAt: new Date() });
      order.transactionId = transactionId;
      order.save();
    });
  }

  async findAllOrders(): Promise<Order[]> {
    return await this.orderModel.find().exec();
  }

  async getOrderDetails(id): Promise<Order> {
    return await this.orderModel.findOne({ orderId: id });
  }

  generateOrderId(length = 15) {
    return new Array(length).join().replace(/(.|$)/g, () => ((Math.random() * 36) | 0).toString(36));
  }

  makePaymant(orderDetails: object): Observable<any> {
    return this.http.post(PAYMENT_API, orderDetails, { headers: { Authorization: AUTH_TOKEN } }).pipe(
      map((res) => {
        return res.data;
      }),
      catchError(e => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  }
}
