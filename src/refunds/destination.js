import { returnPayment } from '../payments/gateway.js';
import { findGiftCard } from '../payments/gift-cards.js';

export function refundDestination(state, order, refund) {
    if (!order.giftPaid) {
        returnPayment(state, order.chargeId, refund.amount, refund.id);
        return { card: refund.amount, gift: 0 };
    }
    const giftCard = findGiftCard(state, order.giftCode);
    const alreadyGift = order.giftRefunded || 0;
    const alreadyCard = order.cardRefunded || 0;
    // Round the cumulative allocation, not each return independently.
    const cumulativeGift = Math.round((order.refunded + refund.amount) * order.giftPaid / order.total);
    const gift = cumulativeGift - alreadyGift;
    const card = refund.amount - gift;
    if (gift < 0 || card < 0 || alreadyGift + gift > order.giftPaid || alreadyCard + card > order.cardPaid) {
        throw new Error('Refund exceeds original tender');
    }
    if (giftCard.balance + gift > giftCard.originalValue) throw new Error('Gift card exceeds issued value');
    returnPayment(state, order.chargeId, card, refund.id);
    giftCard.balance += gift;
    order.giftRefunded = alreadyGift + gift;
    order.cardRefunded = alreadyCard + card;
    return { card, gift };
}
