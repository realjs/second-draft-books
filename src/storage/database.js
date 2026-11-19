import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export function dataRoot() {
  return resolve(process.env.SECOND_DRAFT_DATA || 'data');
}

export async function readDatabase() {
  try {
    return JSON.parse(await readFile(resolve(dataRoot(), 'shop.json'), 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error('Run npm run seed before starting the shop');
    throw error;
  }
}

export async function saveDatabase(state) {
  await mkdir(dataRoot(), { recursive: true });
  const temporary = resolve(dataRoot(), 'shop.json.tmp');
  await writeFile(temporary, JSON.stringify(state, null, 2) + '\n');
  await rename(temporary, resolve(dataRoot(), 'shop.json'));
}
