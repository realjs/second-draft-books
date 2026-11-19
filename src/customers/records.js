export function findCustomer(state, id) {
    for (let customer of state.customers) {
        if (customer.id === id) return customer;
    }
    throw new Error('Unknown customer');
}

export function customerSummary(customer) {
    return { id: customer.id, name: customer.name };
}
