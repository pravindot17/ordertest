import StateMachine = require('javascript-state-machine')
import { IOrderService } from '../interfaces/order.interface';
import { BadRequestException, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { rejects } from 'assert';
import { OrderService } from '../order.service';

export enum OrderTransition {
  CREATE = 'create',
  CONFIRM = 'confirm',
  CANCEL = 'cancel',
  DELIVER = 'deliver'
}

export class OrderMachine {
  machine: any

  constructor(order) {
    console.log('order in mcahine', order)
    this.machine = new StateMachine({
      init: order.orderState,
      data: { order },
      transitions: [
        {
          name: OrderTransition.CREATE,
          from: 'init',
          to: 'created'
        },
        {
          name: OrderTransition.CONFIRM,
          from: 'created',
          to: 'confirmed'
        },
        {
          name: OrderTransition.DELIVER,
          from: 'confirmed',
          to: 'delivered'
        },
        {
          name: OrderTransition.CANCEL,
          from: ['confirmed', 'created'],
          to: 'cancelled'
        }
      ],
      methods: {
        onBeforeCreate: this.onBeforeCreateOrder,
        onBeforeConfirm: this.onBeforeConfirm,
      }
    })
  }

  private async onBeforeCreateOrder(context: any, orderService: IOrderService) {
    let machine = context.fsm;
    machine.savedOrder = await orderService.create(machine.order);
    return machine.savedOrder;
  }

  private async onBeforeConfirm(context: any, orderService: OrderService) {
    let machine = context.fsm;
    orderService.makePaymant(machine.savedOrder).subscribe(paymentResponse => {
      console.log('paymentResponse', paymentResponse)
      if (paymentResponse.paymentStatus !== true) {
        throw new InternalServerErrorException('Payment has failed!');
      }
      orderService.updateStateChange(machine.savedOrder.orderId, 'confirmed')
    }, error => {
      console.log('Got the error', error.response.message);
      throw new InternalServerErrorException(error.response);
    });
  }
}
