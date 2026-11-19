// Attribute the amount actually paid to the books being returned.
// Complimentary books have a catalogue value but contributed no payment.
export function refundValue(order, returnedValue) {
    let denominator = order.grossSubtotal;
    if (denominator === 0) return 0;
    return Math.round(order.total * returnedValue / denominator);
}
