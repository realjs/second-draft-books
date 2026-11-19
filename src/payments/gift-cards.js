import { requirePence } from '../lib/money.js';

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
