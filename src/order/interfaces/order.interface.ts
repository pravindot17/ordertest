import { Document } from 'mongoose';

export interface Product {
  name: string;
  amount: number;
}

export interface Order extends Document {
  readonly name: string;
  readonly email: string;
  readonly address: string;
  readonly totalAmount: number;
  readonly products: Product[];
}