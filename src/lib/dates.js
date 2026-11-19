export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function inWeek(date, start, end) {
  return date >= start && date <= end;
}
