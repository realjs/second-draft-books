import { eventLog } from '../lib/logger.js';

export function normaliseCustomer(state, customer) {
  customer.email = customer.email.trim().toLowerCase();
  eventLog(state, 'customer.normalised', { customerId: customer.id });
  return customer;
}
