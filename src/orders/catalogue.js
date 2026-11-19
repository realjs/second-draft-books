export function findBook(state, id) {
    for (let book of state.books) {
        if (book.id === id) return book;
    }
    throw new Error('Unknown book');
}

export function orderLines(state, items) {
    if (!Array.isArray(items) || items.length === 0) throw new Error('Choose a book');
    if (items.length > 100) throw new Error('A basket can have at most 100 book lines');
    let lines = [];
    let seen = [];
    for (let item of items) {
        if (!Number.isSafeInteger(item.quantity) || item.quantity < 1) {
            throw new Error('Quantity must be a positive integer');
        }
        if (seen.includes(item.bookId)) throw new Error('Combine duplicate book lines');
        seen.push(item.bookId);
        let book = findBook(state, item.bookId);
        lines.push({
            bookId: book.id,
            title: book.title,
            quantity: item.quantity,
            unitPrice: book.price,
            complimentary: item.complimentary === true
        });
    }
    return lines;
}
