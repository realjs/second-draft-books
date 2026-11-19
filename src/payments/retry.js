import { capture } from './gateway.js';

export function chargeWithRetry(state, order, options = {}) {
  let key = 'order:' + order.id;
  let response = capture(state, order.total, key, options.loseFirstResponse === true);
  if (response.status === 'unknown') {
    response = capture(state, order.total, key, false);
  }
  return response.charge;
}
