import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export function outboxRoot() {
  return resolve(process.env.SECOND_DRAFT_OUTBOX || 'outbox');
}

export async function flushOutbox(state) {
  await mkdir(outboxRoot(), { recursive: true });
  for (const email of state.emails) {
    // Replaying a saved queue replaces the same file rather than sending twice.
    await writeFile(resolve(outboxRoot(), email.id + '.json'), JSON.stringify(email, null, 2) + '\n');
  }
}
