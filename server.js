import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { body, json } from './src/http/responses.js';
import { readDatabase } from './src/storage/database.js';
import { runCommand } from './src/storage/commands.js';
import { createOrder } from './src/orders/create.js';
import { createRefund } from './src/refunds/create.js';
import { adjustStock } from './src/stock/adjustments.js';
import { normaliseCustomer } from './src/customers/cleanup.js';
import { findCustomer } from './src/customers/records.js';
import { weeklySales } from './src/reports/weekly.js';
import { salesCsv } from './src/reports/csv.js';

const assets = {
  '/admin/': ['index.html', 'text/html; charset=utf-8'],
  '/admin/style.css': ['style.css', 'text/css; charset=utf-8'],
  '/admin/app.js': ['app.js', 'text/javascript; charset=utf-8']
};

export function makeServer() {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://127.0.0.1');
      if (request.method === 'GET' && url.pathname === '/') {
        response.writeHead(302, { location: '/admin/' });
        response.end();
        return;
      }
      if (request.method === 'GET' && assets[url.pathname]) {
        const [file, type] = assets[url.pathname];
        response.writeHead(200, { 'content-type': type });
        response.end(await readFile(new URL('./public/admin/' + file, import.meta.url)));
        return;
      }
      if (request.method === 'GET' && url.pathname === '/api/shop') {
        const state = await readDatabase();
        json(response, 200, {
          books: state.books, customers: state.customers, stock: state.stock,
          orders: state.orders, refunds: state.refunds, giftCards: state.giftCards,
          emails: state.emails
        });
        return;
      }
      if (request.method === 'GET' && url.pathname === '/api/reports/sales') {
        const state = await readDatabase();
        const rows = weeklySales(state, url.searchParams.get('start') || '2000-01-01',
          url.searchParams.get('end') || '2099-12-31');
        response.writeHead(200, { 'content-type': 'text/csv; charset=utf-8' });
        response.end(salesCsv(rows));
        return;
      }
      if (request.method === 'POST') {
        const input = await body(request);
        let result;
        if (url.pathname === '/api/orders') {
          result = await runCommand(state => createOrder(state, input));
        } else if (url.pathname === '/api/refunds') {
          result = await runCommand(state => createRefund(state, input));
        } else if (url.pathname === '/api/stock/adjust') {
          result = await runCommand(state => adjustStock(state, input.bookId, input.delta));
        } else if (url.pathname === '/api/customers/normalise') {
          result = await runCommand(state => normaliseCustomer(state, findCustomer(state, input.customerId)));
        } else {
          json(response, 404, { error: 'Unknown route' });
          return;
        }
        json(response, 201, result);
        return;
      }
      json(response, 404, { error: 'Unknown route' });
    } catch (error) {
      json(response, 400, { error: error.message });
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await readDatabase();
  const port = Number(process.env.PORT || 3000);
  makeServer().listen(port, '127.0.0.1', () => {
    console.log('The Second Draft: http://127.0.0.1:' + port + '/admin/');
  });
}
