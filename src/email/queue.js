import { nextId } from '../lib/ids.js';

export function queueEmail(state, customer, message) {
    let email = { id: nextId(state.emails, 'email'), to: customer.email,
        subject: message.subject, text: message.text };
    state.emails.push(email);
    return email;
}
