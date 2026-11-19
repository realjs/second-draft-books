export function chooseCode(input) {
  if (Array.isArray(input.code)) throw new Error('Use one discount code');
  return input.code || '';
}
