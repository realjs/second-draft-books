import { available, findStock } from './inventory.js';

export function reserve(state, order) {
  for (let line of order.lines) {
    if (available(state, line.bookId) < line.quantity) throw new Error('Not enough stock');
  }
  for (let line of order.lines) {
    findStock(state, line.bookId).reserved += line.quantity;
    state.reservations.push({ orderId: order.id, bookId: line.bookId,
      quantity: line.quantity, status: 'held' });
  }
}

export function release(state, orderId, sell) {
  for (let reservation of state.reservations) {
    if (reservation.orderId === orderId && reservation.status === 'held') {
      let row = findStock(state, reservation.bookId);
      row.reserved -= reservation.quantity;
      if (sell) row.onHand -= reservation.quantity;
      reservation.status = sell ? 'sold' : 'released';
    }
  }
}
