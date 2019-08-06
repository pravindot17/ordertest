import { Connection } from 'mongoose';
import { OrderSchema } from './order.schama';

export const OrderProviders = [
  {
    provide: 'order',
    useFactory: (connection: Connection) => connection.model('Order', OrderSchema),
    inject: ['OrderData'],
  },
];
