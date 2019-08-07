import { Document } from 'mongoose';

export interface Product {
  name: string;
  amount: number;
}

export interface Order extends Document {
  orderId: string;
  orderState: string;
  orderHistory: object[];
  readonly name: string;
  readonly email: string;
  readonly address: string;
  readonly totalAmount: number;
  readonly products: Product[];
}
