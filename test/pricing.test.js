// Edsger: testing shows the presence, not the absence of bugs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { freshShop } from './helpers.js';
import { orderLines } from '../src/orders/catalogue.js';
import { priceOrder } from '../src/orders/pricing.js';
import { chooseCode } from '../src/discounts/policy.js';
import { formatPrice } from '../src/lib/money.js';

test('Small Maps costs 750p and READ20 saves 150p', () => {
  const state = freshShop();
  const lines = orderLines(state, [{ bookId: 'book-1', quantity: 1 }]);
  assert.equal(priceOrder(state, lines, 'READ20').total, 600);
});

test('a complimentary book is not part of the discount base', () => {
  const state = freshShop();
  const lines = orderLines(state, [
    { bookId: 'book-1', quantity: 1 },
    { bookId: 'book-3', quantity: 1, complimentary: true }
  ]);
  const price = priceOrder(state, lines, 'READ20');
  assert.equal(price.grossSubtotal, 1750);
  assert.equal(price.paidItemsSubtotal, 750);
  assert.equal(price.discount, 150);
});

test('a migrated oversized discount cannot make the total negative', () => {
  const state = freshShop();
  state.discountCodes[2].active = true;
  const lines = orderLines(state, [{ bookId: 'book-1', quantity: 1 }]);
  assert.equal(priceOrder(state, lines, 'OLD120').total, 0);
});

test('only one code is accepted', () => {
  assert.throws(() => chooseCode({ code: ['READ20', 'WELCOME10'] }), /one discount/);
});

test('zero, fractional and duplicate quantities are rejected', () => {
  for (const quantity of [0, -1, 1.5, '1']) {
    assert.throws(() => orderLines(freshShop(), [{ bookId: 'book-1', quantity }]));
  }
  assert.throws(() => orderLines(freshShop(), [
    { bookId: 'book-1', quantity: 1 }, { bookId: 'book-1', quantity: 1 }
  ]), /duplicate/);
});

test('money is pence until the display boundary', () => {
  assert.equal(formatPrice(750), '£7.50');
  for (const amount of [-1, NaN, 0.1, Infinity]) assert.throws(() => formatPrice(amount));
});

test('inactive discount codes do not apply', () => {
  const state = freshShop();
  assert.throws(() => priceOrder(state, orderLines(state,
    [{ bookId: 'book-1', quantity: 1 }]), 'OLD120'), /inactive/);
});
