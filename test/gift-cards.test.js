// Edsger: testing shows the presence, not the absence of bugs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { freshShop, basket } from './helpers.js';
import { createOrder } from '../src/orders/create.js';

test('a gift card can be spent over two visits', () => {
    const state = freshShop();
    const first = createOrder(state, basket({ giftCode: 'GIFT-1000', giftAmount: 500 }));
    const second = createOrder(state, basket({ giftCode: 'GIFT-1000', giftAmount: 500 }));
    assert.equal(first.cardPaid, 250);
    assert.equal(second.cardPaid, 250);
    assert.equal(state.giftCards[0].balance, 0);
});
