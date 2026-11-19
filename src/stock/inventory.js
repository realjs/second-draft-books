export function findStock(state, bookId) {
  for (let row of state.stock) {
    if (row.bookId === bookId) return row;
  }
  throw new Error('No stock record');
}

export function available(state, bookId) {
  let row = findStock(state, bookId);
  return row.onHand - row.reserved;
}
