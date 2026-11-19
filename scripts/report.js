import { readDatabase } from '../src/storage/database.js';
import { weeklySales } from '../src/reports/weekly.js';
import { salesCsv } from '../src/reports/csv.js';

const start = process.argv[2] || '2000-01-01';
const end = process.argv[3] || '2099-12-31';
console.log(salesCsv(weeklySales(await readDatabase(), start, end)));
