import { findOrder } from '../orders/find.js';
import { updateStatus } from '../orders/status.js';
import { returnedLines } from './lines.js';
import { refundValue } from './allocation.js';
import { refundDestination } from './destination.js';
import { findStock } from '../stock/inventory.js';
import { findCustomer } from '../customers/records.js';
import { nextId } from '../lib/ids.js';
import { today } from '../lib/dates.js';
import { eventLog } from '../lib/logger.js';
import { queueEmail } from '../email/queue.js';
import { refundMessage } from '../email/templates.js';

export function createRefund(state, input) {
    let order = findOrder(state, input.orderId);
    let returns = returnedLines(order, input.items);
    let value = 0;
    for (let returned of returns) value += returned.value;
    let amount = refundValue(order, value);
    // Independent rounding on each return must never send back more than was paid.
    if (amount > order.total - order.refunded) amount = order.total - order.refunded;
    let refund = { id: nextId(state.refunds, 'refund'), orderId: order.id,
        date: today(), amount: amount };
    refund.destination = refundDestination(state, order, refund);
    for (let returned of returns) {
        returned.line.returned = (returned.line.returned || 0) + returned.quantity;
        findStock(state, returned.line.bookId).onHand += returned.quantity;
    }
    order.refunded += amount;
    updateStatus(order);
    state.refunds.push(refund);
    queueEmail(state, findCustomer(state, order.customerId), refundMessage(order, refund));
    eventLog(state, 'order.refunded', { orderId: order.id, refundId: refund.id, amount: amount });
    return refund;
}
