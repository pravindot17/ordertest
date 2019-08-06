import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'OrderData',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb://localhost/order'),
  },
];