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
    // A later return can use the original gift contribution as its ceiling.
    const gift = order.refunded > 0
        ? Math.min(refund.amount, order.giftPaid)
        : cumulativeGift - alreadyGift;
    const card = refund.amount - gift;
    // createRefund already caps the total returned against the order payment.
    returnPayment(state, order.chargeId, card, refund.id);
    giftCard.balance += gift;
    order.giftRefunded = alreadyGift + gift;
    order.cardRefunded = alreadyCard + card;
    return { card, gift };
}
