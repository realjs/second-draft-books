import { readFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { saveDatabase } from '../src/storage/database.js';
import { outboxRoot, flushOutbox } from '../src/storage/outbox.js';

const state = JSON.parse(await readFile(new URL('../data/seed.json', import.meta.url), 'utf8'));
await mkdir(outboxRoot(), { recursive: true });
for (const name of await readdir(outboxRoot())) {
    if (/^email-\d+\.json$/.test(name)) await unlink(resolve(outboxRoot(), name));
}
await saveDatabase(state);
await flushOutbox(state);
console.log('Restored fictional shop records. No email was sent and no card was charged.');
