import { eventLog } from '../lib/logger.js';

export function normaliseCustomer(state, customer) {
    customer.email = customer.email.trim().toLowerCase();
    state.logs.push({ event: 'customer.cleaned', customerId: customer.id, email: customer.email });
    eventLog(state, 'customer.normalised', { customerId: customer.id });
    return customer;
}
