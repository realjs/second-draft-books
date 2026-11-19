export function findOrder(state, id) {
    for (let order of state.orders) {
        if (order.id === id) return order;
    }
    throw new Error('Unknown order');
}
