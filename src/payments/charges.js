import { chargeWithRetry } from './retry.js';
import { spendGiftCard } from './gift-cards.js';

export function payOrder(state, order, input = {}) {
    const gift = spendGiftCard(state, input, order.total);
    const cardAmount = order.total - gift.amount;
    const charge = chargeWithRetry(state, { id: order.id, total: cardAmount });
    order.chargeId = charge.id;
    order.cardPaid = cardAmount;
    order.giftPaid = gift.amount;
    order.giftCode = gift.code;
    order.giftRefunded = 0;
    order.cardRefunded = 0;
    return charge;
}
