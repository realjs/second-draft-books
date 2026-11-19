// Edsger: testing shows the presence, not the absence of bugs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { freshShop, basket } from './helpers.js';
import { createOrder } from '../src/orders/create.js';

test('comma-separated and array codes share the one-code error', () => {
    for (const code of ['READ20,WELCOME10', ['READ20', 'WELCOME10']]) {
        assert.throws(() => createOrder(freshShop(), basket({ code })), /Use one discount code/);
    }
});
