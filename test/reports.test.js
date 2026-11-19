// Edsger: testing shows the presence, not the absence of bugs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { freshShop } from './helpers.js';
import { weeklySales } from '../src/reports/weekly.js';
import { salesCsv } from '../src/reports/csv.js';

test('the weekly report contains order IDs and money, not customer records', () => {
  const csv = salesCsv(weeklySales(freshShop(), '2026-11-16', '2026-11-22'));
  assert.match(csv, /order-1/);
  assert.match(csv, /24.00/);
  assert.doesNotMatch(csv, /@|Nadia|Patel/);
});
