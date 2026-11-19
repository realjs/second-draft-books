// Edsger: testing shows the presence, not the absence of bugs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { freshShop, basket } from './helpers.js';
import { buyGiftCard } from '../src/payments/gift-cards.js';
import { createOrder } from '../src/orders/create.js';

test('a purchased gift card can pay for books over several visits', () => {
    const state = freshShop();
    const card = buyGiftCard(state, { customerId: 'customer-2', code: 'GIFT-SAM', value: 1000 });
    const purchase = state.charges.at(-1);
    assert.equal(purchase.amount, 1000);
    assert.equal(card.balance, 1000);
    assert.match(state.emails[0].text, /GIFT-SAM/);
    createOrder(state, basket({ giftCode: card.code, giftAmount: 500 }));
    createOrder(state, basket({ giftCode: card.code, giftAmount: 500 }));
    assert.equal(card.balance, 0);
    assert.equal(state.charges.length, 4); // Seed payment, gift purchase, two 250p remainders.
});

test('a duplicate code is rejected before charging again', () => {
    const state = freshShop();
    const input = { customerId: 'customer-2', code: 'GIFT-SAM', value: 1000 };
    buyGiftCard(state, input);
    const charges = state.charges.length;
    assert.throws(() => buyGiftCard(state, input), /already issued/);
    assert.equal(state.charges.length, charges);
});

test('invalid gift purchases do not create a charge', () => {
    for (const value of [0, -1, 1.5, '1000']) {
        const state = freshShop();
        assert.throws(() => buyGiftCard(state, { customerId: 'customer-1', code: 'GIFT-SAM', value }));
        assert.equal(state.charges.length, 1);
    }
});
