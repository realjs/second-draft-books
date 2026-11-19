import { inWeek } from '../lib/dates.js';

export function weeklySales(state, start, end) {
    let rows = [];
    for (let order of state.orders) {
        if (inWeek(order.date, start, end)) {
            rows.push({ orderId: order.id, date: order.date,
                paid: order.total, refunded: order.refunded, net: order.total - order.refunded });
        }
    }
    return rows;
}
