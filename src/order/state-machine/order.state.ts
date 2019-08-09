import StateMachine = require('javascript-state-machine');
import { IOrderService } from '../interfaces/order.interface';
import { InternalServerErrorException } from '@nestjs/common';
import { OrderService } from '../order.service';

export enum OrderTransition {
  CREATE = 'create',
  CONFIRM = 'confirm',
  CANCEL = 'cancel',
  DELIVER = 'deliver',
}

export class OrderMachine {
  machine: any;

  constructor(order) {
    this.machine = new StateMachine({
      init: order.orderState,
      data: { order },
      transitions: [
        {
          name: OrderTransition.CREATE,
          from: 'init',
          to: 'created',
        },
        {
          name: OrderTransition.CONFIRM,
          from: 'created',
          to: 'confirmed',
        },
        {
          name: OrderTransition.DELIVER,
          from: 'confirmed',
          to: 'delivered',
        },
        {
          name: OrderTransition.CANCEL,
          from: ['confirmed', 'created'],
          to: 'cancelled',
        },
      ],
      methods: {
        onBeforeCreate: this.onBeforeCreateOrder,
        onBeforeConfirm: this.onBeforeConfirm,
        onCancel: this.onCancel,
      },
    });
  }

  private async onBeforeCreateOrder(context: any, orderService: IOrderService) {
    const machine = context.fsm;
    machine.savedOrder = await orderService.create(machine.order);
    return machine.savedOrder;
  }

  private async onBeforeConfirm(context: any, orderService: OrderService) {
    const machine = context.fsm;
    orderService.makePaymant(machine.savedOrder).subscribe(paymentResponse => {
      if (paymentResponse.paymentStatus !== true) {
        return orderService.updateStateChange(machine.savedOrder.orderId, 'cancelled');
      }
      orderService.updateStateChange(machine.savedOrder.orderId, 'confirmed', paymentResponse.transactionId);
    }, error => {
      console.log('Got the error', error.response.message);
      // throw new InternalServerErrorException(error.response);
    });
  }

  private async onCancel(context: any, orderService: OrderService) {
    const machine = context.fsm;
    orderService.updateStateChange(machine.order.orderId, 'cancelled');
  }
}
