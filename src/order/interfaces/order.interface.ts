import { Document } from 'mongoose';
import { CreateOrderDto } from '../dto/create-order.dto';

export interface Product {
  name: string;
  amount: number;
}

export interface Order extends Document {
  orderId: string;
  orderState: string;
  orderHistory: object[];
  paymentDetails: object;
  readonly name: string;
  readonly email: string;
  readonly address: string;
  totalAmount: number;
  transactionId: string;
  cancelledReason: string;
  readonly products: Product[];
}

export interface IOrderService {
  create(createOrderDto: CreateOrderDto);
  findAllOrders();
  getOrderDetails(id);
  makePaymant(orderDetails: object);
}
