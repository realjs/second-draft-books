# Ada's map of the shop

Written at v1.0. Please leave a note when a change invalidates part of this map.

`server.js` accepts requests and hands their bodies to synchronous shop functions.
`src/storage/commands.js` serialises writes, gives the function a private copy
of the database, saves successful changes, then materialises the email queue.
Failed shop functions never save their partial changes. Use only one server
process for a data directory; a JSON file is not a multi-process database.

Pricing knows about books and discount codes. It does not read files. Stock
checks happen before a reservation is created. On payment, reservations become
sales. The gateway is a local ledger with an idempotency key for each order.
The async adapter belongs at the storage boundary, outside the pricing and
refund calculations learners read first.

Refunds return the price of each book, less that book's share of the discount.
The refund module uses the same set of paid books as pricing. Read
`src/refunds/allocation.js` for the calculation.

The CSV contains order references and money. It never needs a customer's email.
Logs have an explicit set of fields for the same reason. Emails can contain
customer addresses because they go into a local outbox, not logs or reports.

## Invariants

- Stock never goes negative, and each reservation is released exactly once.
- Order totals never go below zero; only one discount code applies.
- Total refunds never exceed the order's payment.
- Every order belongs to a customer; personal data stays out of logs and reports.

These are rules the shop relies on, not proof that every write path keeps them.
Check a second writer before trusting a rule you've found in the first.
