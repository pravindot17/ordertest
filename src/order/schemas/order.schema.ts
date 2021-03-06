import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  orderId: String,
  name: String,
  email: String,
  address: String,
  totalAmount: Number,
  orderState: String,
  transactionId: String,
  cancelledReason: String,
  products: [],
  orderHistory: [],
  paymentDetails: {},
}, {
    timestamps: true,
  });
