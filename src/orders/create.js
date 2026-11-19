import { findCustomer } from '../customers/records.js';
import { chooseCode } from '../discounts/policy.js';
import { orderLines } from './catalogue.js';
import { priceOrder } from './pricing.js';
import { reserve, release } from '../stock/reservations.js';
import { payOrder } from '../payments/charges.js';
import { nextId } from '../lib/ids.js';
import { today } from '../lib/dates.js';
import { eventLog } from '../lib/logger.js';
import { queueEmail } from '../email/queue.js';
import { orderMessage } from '../email/templates.js';

export function createOrder(state, input) {
    let customer = findCustomer(state, input.customerId);
    let lines = orderLines(state, input.items);
    let price = priceOrder(state, lines, chooseCode(input));
    let order = {
        id: nextId(state.orders, 'order'), customerId: customer.id, lines: lines,
        date: today(), grossSubtotal: price.grossSubtotal,
        paidItemsSubtotal: price.paidItemsSubtotal, discount: price.discount,
        code: price.code, total: price.total, refunded: 0, status: 'paid'
    };
    reserve(state, order);
    payOrder(state, order, input);
    release(state, order.id, true);
    state.orders.push(order);
    queueEmail(state, customer, orderMessage(order));
    eventLog(state, 'order.paid', { orderId: order.id, amount: order.total });
    return order;
}
