import { Injectable, HttpService, HttpException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order, IOrderService } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { map, catchError } from 'rxjs/operators';
import { PAYMENT_API, AUTH_TOKEN } from '../constants';
import { Observable } from 'rxjs';
import { calculateTotalAmount, generateOrderId } from '../helper';
import { OrderMachine } from './state-machine/order.state';

@Injectable()
export class OrderService implements IOrderService {

  constructor(private http: HttpService, @InjectModel('Order') private readonly orderModel: Model<Order>) { }

  async create(createOrderDto: CreateOrderDto): Promise<any> {
    const createdOrder = new this.orderModel(createOrderDto);
    createdOrder.orderId = generateOrderId();
    createdOrder.orderState = 'created';
    createdOrder.totalAmount = calculateTotalAmount(createOrderDto.products, 'amount');
    createdOrder.orderHistory = [{ state: 'created', createdAt: new Date() }];
    return await createdOrder.save();
  }

  updateStateChange(orderId, state, transactionId = null, cancelledReason = null) {
    this.orderModel.findOne({ orderId }, (err, order) => {
      if (err) { throw new InternalServerErrorException(`Failed to change the state to ${state}`); }
      order.orderState = state;
      order.orderHistory.push({ state, createdAt: new Date() });
      if (transactionId) { order.transactionId = transactionId; }
      if (cancelledReason) { order.cancelledReason = cancelledReason; }
      order.save();
    });
  }

  async findAllOrders(): Promise<Order[]> {
    return await this.orderModel.find().exec();
  }

  async getOrderDetails(id): Promise<Order> {
    return await this.orderModel.findOne({ orderId: id });
  }

  async trackOrderDetails(id): Promise<Order> {
    return await this.orderModel.findOne({ orderId: id }, {
      _id: false,
      orderState: true,
      orderHistory: true,
      transactionId: true,
      cancelledReason: true,
    });
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

  async getStateMachine(orderId) {
    const order = await this.getOrderDetails(orderId);
    if (!order) { throw new NotFoundException('Order does not exist!'); }
    const orderMachine = new OrderMachine(order);
    return orderMachine.machine;
  }
}
