export function returnedLines(order, items) {
    if (!Array.isArray(items) || items.length === 0) throw new Error('Choose a return');
    let result = [];
    let seen = [];
    for (let item of items) {
        if (!Number.isSafeInteger(item.quantity) || item.quantity < 1) {
            throw new Error('Return quantity must be positive');
        }
        if (seen.includes(item.bookId)) throw new Error('Combine duplicate return lines');
        seen.push(item.bookId);
        let found;
        for (let line of order.lines) {
            if (line.bookId === item.bookId) found = line;
        }
        if (!found) throw new Error('Book not in this order');
        let already = found.returned || 0;
        if (already + item.quantity > found.quantity) throw new Error('Already returned');
        result.push({ line: found, quantity: item.quantity,
            value: found.complimentary ? 0 : found.unitPrice * item.quantity });
    }
    return result;
}
