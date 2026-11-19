import { findStock } from './inventory.js';

// Staff use this write path to correct a shelf count after a delivery.
export function adjustStock(state, bookId, delta) {
  if (!Number.isSafeInteger(delta)) throw new Error('Adjustment must be an integer');
  let row = findStock(state, bookId);
  row.onHand += delta;
  return row;
}
