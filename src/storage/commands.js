import { readDatabase, saveDatabase } from './database.js';
import { flushOutbox } from './outbox.js';
import { settleGateway } from '../payments/adapter.js';

let queue = Promise.resolve();

export function runCommand(change) {
    // One writer: examples never depend on two HTTP requests interleaving.
    const pending = queue.then(async () => {
        const original = await readDatabase();
        const state = structuredClone(original);
        const result = change(state);
        if (state.charges.length > original.charges.length) {
            await settleGateway({ orderId: result.id || 'gift:' + result.code });
        }
        await saveDatabase(state);
        await flushOutbox(state);
        return result;
    });
    queue = pending.catch(() => {});
    return pending;
}
