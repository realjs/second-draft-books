import { findDiscount, discountAmount } from '../discounts/codes.js';
import { requirePence } from '../lib/money.js';

export function priceOrder(state, lines, code) {
  let grossSubtotal = 0;
  let paidItemsSubtotal = 0;
  for (let line of lines) {
    requirePence(line.unitPrice, 'Book price');
    let value = line.unitPrice * line.quantity;
    requirePence(value, 'Line total');
    grossSubtotal += value;
    if (!line.complimentary) paidItemsSubtotal += value;
  }
  requirePence(grossSubtotal, 'Subtotal');
  let discount = findDiscount(state, code);
  let saving = discountAmount(paidItemsSubtotal, discount);
  return {
    grossSubtotal: grossSubtotal,
    paidItemsSubtotal: paidItemsSubtotal,
    discount: saving,
    code: discount.code,
    total: paidItemsSubtotal - saving
  };
}
