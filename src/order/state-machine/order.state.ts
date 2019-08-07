import { ForbiddenException } from '@nestjs/common';

interface State {
  order: OrderState;

  acceptOrder();
  cancelOrder();
  dispatchOrder();
}

export class OrderState {
  public currentState: State;

  public createdOrderState: State;
  public confirmedOrderState: State;
  public cancelledOrderState: State;
  public deliveredOrderState: State;

  constructor() {
    this.createdOrderState = new CreatedOrderState(this);
    this.confirmedOrderState = new ConfirmedOrderState(this);
    this.cancelledOrderState = new CancelledOrderState(this);
    this.deliveredOrderState = new DeliveredOrderState(this);

    this.setState(this.createdOrderState);
  }

  public setState(state: State) {
    this.currentState = state;
  }

  public getState() {
    return this.currentState;
  }
}

class CreatedOrderState implements State {
  order: OrderState;
  constructor(order: OrderState) {
    this.order = order;
  }

  acceptOrder() {
    // Confirming your order
    this.order.setState(this.order.confirmedOrderState);
  }

  cancelOrder() {
    // Cancelling your order
    this.order.setState(this.order.cancelledOrderState);
  }

  dispatchOrder() {
    // You can't dispatch the order at order created state
    throw new ForbiddenException(`You can't dispatch the order before accepting it`);
  }
}

class ConfirmedOrderState implements State {
  order: OrderState;
  constructor(order: OrderState) {
    this.order = order;
  }

  acceptOrder() {
    // You have already accepted the order
    throw new ForbiddenException(`You have already accepted the order`);
  }

  cancelOrder() {
    // Cancelling your order
    this.order.setState(this.order.cancelledOrderState);
  }

  dispatchOrder() {
    // dispatching the order
    this.order.setState(this.order.deliveredOrderState);
  }
}

class CancelledOrderState implements State {
  order: OrderState;
  constructor(order: OrderState) {
    this.order = order;
  }

  acceptOrder() {
    // You can not accept the order at Cancelled state
    throw new ForbiddenException(`You can not accept the order at Cancelled state`);
  }

  cancelOrder() {
    // You have already cancelled the order
    throw new ForbiddenException(`You have already cancelled the order`);
  }

  dispatchOrder() {
    // You can not dispatch the cancelled order
    throw new ForbiddenException(`You can not dispatch the cancelled order`);
  }
}

class DeliveredOrderState implements State {
  order: OrderState;
  constructor(order: OrderState) {
    this.order = order;
  }

  acceptOrder() {
    // You can not accept the order at Delivered state
    throw new ForbiddenException(`You can not accept the order at Delivered state`);
  }

  cancelOrder() {
    // You can not cancel the order at Delivered state
    throw new ForbiddenException(`You can not cancel the order at Delivered state`);
  }

  dispatchOrder() {
    // You have already dispatched the order
    throw new ForbiddenException(`You have already dispatched the order`);
  }
}
