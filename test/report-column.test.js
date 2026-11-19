// Edsger: testing shows the presence, not the absence of bugs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { freshShop } from './helpers.js';
import { weeklySales } from '../src/reports/weekly.js';
import { salesCsv } from '../src/reports/csv.js';

test('the new column counts paid and complimentary copies', () => {
    const state = freshShop();
    state.orders[0].lines[0].quantity = 2;
    const rows = weeklySales(state, '2026-11-16', '2026-11-22');
    assert.equal(rows[0].books, 4);
    assert.match(salesCsv(rows), /net_gbp,books/);
    assert.match(salesCsv(rows), /24.00,0.00,24.00,4/);
});
