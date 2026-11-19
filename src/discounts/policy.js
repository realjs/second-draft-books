export function chooseCode(input) {
    if (typeof input.code === 'string' && input.code.includes(',')) throw new Error('Use one discount code');
    if (Array.isArray(input.code)) throw new Error('Use one discount code');
    return input.code || '';
}
