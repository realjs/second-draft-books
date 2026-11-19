export function findDiscount(state, code) {
    if (!code) return { code: '', percent: 0 };
    if (typeof code !== 'string') throw new Error('Use one discount code');
    for (let discount of state.discountCodes) {
        if (discount.code === code.toUpperCase() && discount.active) return discount;
    }
    throw new Error('Unknown or inactive discount code');
}

export function discountAmount(subtotal, discount) {
    return Math.round(subtotal * discount.percent / 100);
}
