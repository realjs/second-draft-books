export function updateStatus(order) {
  if (order.refunded === order.total) order.status = 'refunded';
  else if (order.refunded > 0) order.status = 'partly-refunded';
  else order.status = 'paid';
  return order.status;
}
