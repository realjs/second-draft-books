import { nextId } from '../lib/ids.js';
import { requirePence } from '../lib/money.js';

// A deterministic local gateway model. There are no card numbers or network calls.
// A timeout means the caller didn't get the answer, not that no money moved.
export function capture(state, amount, key, loseResponse) {
    requirePence(amount, 'Charge');
    for (let charge of state.charges) {
        if (charge.key === key) {
            if (charge.amount !== amount) throw new Error('Key reused for a different amount');
            return { status: 'confirmed', charge: charge };
        }
    }
    let charge = { id: nextId(state.charges, 'charge'), key: key, amount: amount };
    state.charges.push(charge);
    return { status: loseResponse ? 'unknown' : 'confirmed', charge: charge };
}

export function returnPayment(state, chargeId, amount, refundId) {
    requirePence(amount, 'Refund');
    let original;
    for (let charge of state.charges) {
        if (charge.id === chargeId) original = charge;
    }
    if (!original) throw new Error('Unknown charge');
    let already = 0;
    for (let entry of state.gatewayRefunds) {
        if (entry.refundId === refundId) return entry;
        if (entry.chargeId === chargeId) already += entry.amount;
    }
    if (already + amount > original.amount) throw new Error('Refund exceeds charge');
    let entry = { chargeId: chargeId, amount: amount, refundId: refundId };
    state.gatewayRefunds.push(entry);
    return entry;
}
