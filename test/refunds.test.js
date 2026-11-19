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
