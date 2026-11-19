// Store pence. Only the display boundary knows about pounds or currency symbols.
export function requirePence(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(label + ' must be a non-negative integer number of pence');
  }
  return value;
}

export function formatPrice(pence) {
  requirePence(pence, 'Price');
  return '£' + (pence / 100).toFixed(2);
}
