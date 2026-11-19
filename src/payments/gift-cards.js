import { requirePence } from '../lib/money.js';
import { capture } from './gateway.js';
import { findCustomer } from '../customers/records.js';
import { queueEmail } from '../email/queue.js';
import { formatPrice } from '../lib/money.js';

export function buyGiftCard(state, input) {
    const customer = findCustomer(state, input.customerId);
    requirePence(input.value, 'Gift card value');
    if (input.value === 0) throw new Error('Choose a positive gift card value');
    if (typeof input.code !== 'string' || !/^[A-Z0-9-]{4,40}$/.test(input.code)) {
        throw new Error('Use a gift card code of 4 to 40 uppercase letters, digits or hyphens');
    }
    if (state.giftCards.some(card => card.code === input.code)) throw new Error('Gift card code already issued');
    const charge = capture(state, input.value, 'gift-purchase:' + input.code, false).charge;
    const card = { code: input.code, originalValue: input.value, balance: input.value,
        purchasedBy: customer.id, purchaseChargeId: charge.id };
    state.giftCards.push(card);
    queueEmail(state, customer, { subject: 'Your Second Draft gift card',
        text: 'Gift card ' + card.code + ' is ready to spend: ' + formatPrice(card.originalValue) + '.' });
    return card;
}

export function findGiftCard(state, code) {
    const card = state.giftCards.find(card => card.code === code);
    if (!card) throw new Error('Unknown gift card');
    return card;
}

export function spendGiftCard(state, input, total) {
    if (!input.giftCode) return { amount: 0, code: '' };
    const card = findGiftCard(state, input.giftCode);
    if (card.balance === 0) throw new Error('Gift card is exhausted');
    const amount = input.giftAmount === undefined ? Math.min(card.balance, total) : input.giftAmount;
    requirePence(amount, 'Gift payment');
    if (amount > total) throw new Error('Gift payment exceeds order');
    if (amount > card.balance) throw new Error('Gift payment exceeds balance');
    card.balance -= amount;
    return { amount, code: card.code };
}
