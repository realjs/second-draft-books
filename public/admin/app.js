function pounds(pence) {
  return '£' + (pence / 100).toFixed(2);
}

function appendText(parent, tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  parent.append(element);
  return element;
}

async function refresh() {
  const response = await fetch('/api/shop');
  const shop = await response.json();
  if (!response.ok) throw new Error(shop.error);
  const customers = document.querySelector('#customers');
  const books = document.querySelector('#books');
  customers.replaceChildren();
  books.replaceChildren();
  for (const customer of shop.customers) {
    const option = appendText(customers, 'option', customer.name);
    option.value = customer.id;
  }
  for (const book of shop.books) {
    const option = appendText(books, 'option', book.title + ' · ' + pounds(book.price));
    option.value = book.id;
  }
  const orders = document.querySelector('#orders');
  orders.replaceChildren();
  for (const order of shop.orders) {
    const row = document.createElement('tr');
    appendText(row, 'td', order.id);
    appendText(row, 'td', pounds(order.total));
    appendText(row, 'td', pounds(order.refunded));
    appendText(row, 'td', order.status);
    appendText(row, 'td', order.lines.map(line => line.quantity + ' × ' + line.title).join(', '));
    orders.append(row);
  }
  const stock = document.querySelector('#stock');
  stock.replaceChildren();
  for (const item of shop.stock) {
    appendText(stock, 'li', item.bookId + ': ' + item.onHand + ' on hand, ' + item.reserved + ' reserved');
  }
  const emails = document.querySelector('#emails');
  emails.replaceChildren();
  for (const email of shop.emails) appendText(emails, 'li', email.subject + ' — ' + email.text);
}

function handleForm(id, endpoint, transform, messageId) {
  const form = document.querySelector(id);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const message = document.querySelector(messageId);
    const button = form.querySelector('button');
    button.disabled = true;
    try {
      const values = Object.fromEntries(new FormData(form));
      const response = await fetch(endpoint, { method: 'POST',
        headers: { 'content-type': 'application/json' }, body: JSON.stringify(transform(values)) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      message.textContent = 'Saved ' + (result.id || result.bookId) +
        (result.amount !== undefined ? ' · ' + pounds(result.amount) : '');
      await refresh();
    } catch (error) {
      message.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });
}

handleForm('#order-form', '/api/orders', input => ({
  customerId: input.customerId, code: input.code,
  items: [{ bookId: input.bookId, quantity: Number(input.quantity) }]
}), '#message');
handleForm('#refund-form', '/api/refunds', input => ({
  orderId: input.orderId, items: [{ bookId: input.bookId, quantity: Number(input.quantity) }]
}), '#refund-message');
handleForm('#stock-form', '/api/stock/adjust', input => ({
  bookId: input.bookId, delta: Number(input.delta)
}), '#stock-message');
refresh().catch(error => { document.querySelector('#message').textContent = error.message; });
