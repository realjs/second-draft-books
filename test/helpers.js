import { readFileSync } from 'node:fs';

export function freshShop() {
    return JSON.parse(readFileSync(new URL('../data/seed.json', import.meta.url), 'utf8'));
}

export function basket(options = {}) {
    return {
        customerId: 'customer-1',
        items: [{ bookId: 'book-1', quantity: 1 }],
        code: '', ...options
    };
}
