import { returnPayment } from '../payments/gateway.js';

export function refundDestination(state, order, refund) {
  returnPayment(state, order.chargeId, refund.amount, refund.id);
  return { card: refund.amount, gift: 0 };
}
