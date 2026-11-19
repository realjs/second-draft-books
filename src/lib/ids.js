export function nextId(records, prefix) {
  let largest = 0;
  for (let record of records) {
    let number = Number(record.id.slice(prefix.length + 1));
    if (number > largest) largest = number;
  }
  return prefix + '-' + (largest + 1);
}
