import { inWeek } from '../lib/dates.js';

export function weeklySales(state, start, end) {
    let rows = [];
    for (let order of state.orders) {
        if (inWeek(order.date, start, end)) {
            let books = 0;
        for (let line of order.lines) books += line.quantity;
        rows.push({ books: books, orderId: order.id, date: order.date,
                paid: order.total, refunded: order.refunded, net: order.total - order.refunded });
        }
    }
    return rows;
}
