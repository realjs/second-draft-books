export function formatPrice(pence) {
    return (pence / 100).toFixed(2);
}

export function salesCsv(rows) {
    let output = 'order_id,date,paid_gbp,refunded_gbp,net_gbp\n';
    for (let row of rows) {
        output += row.orderId + ',' + row.date + ',' + formatPrice(row.paid) + ','
            + formatPrice(row.refunded) + ',' + formatPrice(row.net) + '\n';
    }
    return output;
}
