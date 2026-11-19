// An allow-list is easier to inspect than an ever-growing list of secrets.
const allowed = ['orderId', 'customerId', 'refundId', 'amount', 'attempt'];

export function eventLog(state, event, fields) {
    let entry = { event: event };
    for (let key of allowed) {
        if (fields[key] !== undefined) entry[key] = fields[key];
    }
    state.logs.push(entry);
    return entry;
}
