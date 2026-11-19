import { chargeWithRetry } from './retry.js';

export function payOrder(state, order) {
  let charge = chargeWithRetry(state, order);
  order.chargeId = charge.id;
  order.cardPaid = order.total;
  order.giftPaid = 0;
  return charge;
}
