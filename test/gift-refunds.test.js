// Edsger: testing shows the presence, not the absence of bugs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { freshShop, basket } from './helpers.js';
import { createOrder } from '../src/orders/create.js';
import { createRefund } from '../src/refunds/create.js';

test('a mixed-payment full return restores the two contributions', () => {
    const state = freshShop();
    const order = createOrder(state, basket({ giftCode: 'GIFT-1000', giftAmount: 500 }));
    const refund = createRefund(state, { orderId: order.id, items: [{ bookId: 'book-1', quantity: 1 }] });
    assert.deepEqual(refund.destination, { gift: 500, card: 250 });
    assert.equal(state.giftCards[0].balance, 1000);
});

test('a partial return allocates a share to each tender', () => {
    const state = freshShop();
    const order = createOrder(state, basket({ giftCode: 'GIFT-1000', giftAmount: 1000,
        items: [{ bookId: 'book-1', quantity: 1 }, { bookId: 'book-2', quantity: 1 }] }));
    const refund = createRefund(state, { orderId: order.id, items: [{ bookId: 'book-1', quantity: 1 }] });
    assert.deepEqual(refund.destination, { gift: 250, card: 500 });
});

test('a gift-only return puts its payment back on the gift card', () => {
    const state = freshShop();
    const order = createOrder(state, basket({ giftCode: 'GIFT-1000' }));
    const refund = createRefund(state, { orderId: order.id, items: [{ bookId: 'book-1', quantity: 1 }] });
    assert.deepEqual(refund.destination, { gift: 750, card: 0 });
});
