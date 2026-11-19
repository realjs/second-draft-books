// Margaret: keep this ordinary return working when the gateway changes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { freshShop, basket } from './helpers.js';
import { createOrder } from '../src/orders/create.js';
import { createRefund } from '../src/refunds/create.js';

test('returning a single paid book restores its stock and payment', () => {
    const state = freshShop();
    const order = createOrder(state, basket());
    const refund = createRefund(state, { orderId: order.id,
        items: [{ bookId: 'book-1', quantity: 1 }] });
    assert.equal(refund.amount, 750);
    assert.equal(state.stock[0].onHand, 18);
    assert.equal(order.status, 'refunded');
});

test('the final paid return receives the remaining rounding penny', () => {
    const state = freshShop();
    for (const book of state.books) book.price = 1;
    state.discountCodes[0].percent = 67;
    const order = createOrder(state, basket({ code: 'READ20', items: [
        { bookId: 'book-1', quantity: 1 }, { bookId: 'book-2', quantity: 1 },
        { bookId: 'book-3', quantity: 1 }
    ] }));
    assert.equal(order.total, 1);
    for (const bookId of ['book-1', 'book-2', 'book-3']) {
        createRefund(state, { orderId: order.id, items: [{ bookId, quantity: 1 }] });
    }
    assert.equal(order.refunded, 1);
});
