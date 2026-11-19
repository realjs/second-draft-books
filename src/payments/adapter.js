// Async boundary for a future gateway adapter. In this course nothing leaves
// the machine; the same Promise-shaped interface is exercised by the server.
export async function settleGateway(command) {
    return { accepted: true, orderId: command.orderId };
}
