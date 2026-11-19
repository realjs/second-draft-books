import { formatPrice } from '../lib/money.js';

export function orderMessage(order) {
  return {
    subject: 'Your order ' + order.id,
    text: 'Thanks for visiting The Second Draft. Total paid: ' + formatPrice(order.total) + '.'
  };
}

export function refundMessage(order, refund) {
  let lead = 'We have returned ';
  let tail = ' for your books.';
  return { subject: 'Refund for ' + order.id, text: lead + formatPrice(refund.amount) + tail };
}
