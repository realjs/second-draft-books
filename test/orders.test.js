// Edsger: testing shows the presence, not the absence of bugs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { freshShop, basket } from './helpers.js';
import { createOrder } from '../src/orders/create.js';
import { reserve, release } from '../src/stock/reservations.js';
import { payOrder } from '../src/payments/charges.js';

test('an order takes stock and queues one confirmation', () => {
    const state = freshShop();
    const order = createOrder(state, basket());
    assert.equal(order.total, 750);
    assert.equal(state.stock[0].onHand, 17);
    assert.equal(state.stock[0].reserved, 0);
    assert.equal(state.emails.length, 1);
    assert.match(state.emails[0].text, /£7.50/);
});

test('a reservation is released once', () => {
    const state = freshShop();
    const order = { id: 'order-2', lines: [{ bookId: 'book-1', quantity: 1 }] };
    reserve(state, order);
    release(state, order.id, false);
    release(state, order.id, false);
    assert.equal(state.stock[0].reserved, 0);
    assert.equal(state.stock[0].onHand, 18);
});

test('orders need an existing customer and available stock', () => {
    assert.throws(() => createOrder(freshShop(), basket({ customerId: 'missing' })), /Unknown customer/);
    assert.throws(() => createOrder(freshShop(), basket({
        items: [{ bookId: 'book-1', quantity: 99 }]
    })), /stock/);
});

test('a gift payment reduces the ordinary gateway charge', () => {
    const state = freshShop();
    const order = { id: 'order-2', total: 750 };
    payOrder(state, order, { giftCode: 'GIFT-1000', giftAmount: 500 });
    assert.equal(state.charges.at(-1).amount, 250);
});
