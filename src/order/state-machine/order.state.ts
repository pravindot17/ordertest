import StateMachine = require('javascript-state-machine');
import { IOrderService } from '../interfaces/order.interface';
import { OrderService } from '../order.service';
import { TIME_TO_DELIVER_INSEC } from '../../constants';

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
        onAfterConfirm: this.onAfterConfirm,
        onCancel: this.onCancel,
        onAfterDeliver: this.onAfterDeliver,
      },
    });
  }

  private async onBeforeCreateOrder(context: any, orderService: IOrderService) {
    const machine = context.fsm;
    machine.savedOrder = await orderService.create(machine.order);
    return machine.savedOrder;
  }

  private async onBeforeConfirm(context: any, orderService: OrderService) {
    return new Promise((resolve, reject) => {
      const machine = context.fsm;
      orderService.makePaymant(machine.savedOrder).subscribe(async (paymentResponse) => {
        if (paymentResponse.paymentStatus !== true) {
          await orderService.updateStateChange(machine.savedOrder.orderId, 'cancelled', null, 'Payment declined');
          return false;
        }
        await orderService.updateStateChange(machine.savedOrder.orderId, 'confirmed', paymentResponse.transactionId);
        return resolve();
      }, error => {
        console.log('Payment service failed', error.response.message);
        return false;
      });
    });
  }

  private async onCancel(context: any, orderService: OrderService) {
    const machine = context.fsm;
    orderService.updateStateChange(machine.order.orderId, 'cancelled', null, 'Customer cancelled the order');
  }

  private async onAfterConfirm(context: any, orderService: OrderService) {
    const machine = context.fsm;
    setTimeout(() => {
      machine.deliver(orderService);
    }, TIME_TO_DELIVER_INSEC);
  }

  private async onAfterDeliver(context: any, orderService: OrderService) {
    const machine = context.fsm;

    // fetching the latest order state as within interval customer may cancel the order
    const fsm = await orderService.getStateMachine(machine.savedOrder.orderId);
    if (!fsm.can('deliver')) {
      console.log('Deliver transition is not allowed');
      return false;
    }
    orderService.updateStateChange(machine.savedOrder.orderId, 'delivered');
  }
}
