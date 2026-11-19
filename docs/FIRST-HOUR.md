# Your first hour

Use the shop before reading its internals. Start it with the README commands,
open the staff desk and place the Small Maps order. Nothing leaves your machine.

You'll never need to read all of it. Start from something you can see working.
Follow one thread at a time.

## Grace: “How does READ20 get applied?”

Start at `priceOrder()` in `src/orders/pricing.js`. Its imports name the next
files to visit. `import` makes a function from another module available here;
`export` makes it available to another file.

Before running anything else, write down the price you expect for two copies of
Small Maps with READ20. Then place that order in the staff desk and compare.
Keep a note with three headings: starting point, calls it makes, evidence.

## Grace: “Where does the confirmation come from?”

Start at `createOrder()` in `src/orders/create.js`. Follow the email call only.
Compare the file in `outbox/` with the subject and body built by the template.
You can ignore how the queue reaches disk: storage saves that answer to JSON.

## Grace: “Why do these two prices look different?”

Find both `formatPrice()` functions. Decide which is used in the confirmation
and which in the CSV. Predict how each displays 750 pence, then check.

## Keep this map small

- `orders/`: a basket becomes a priced, paid order.
- `discounts/`: one code selects a percentage.
- `stock/`: shelf counts and reservations.
- `payments/`: a pretend gateway and the calls into it.
- `refunds/`: returned books become payment returns and shelf stock.
- `customers/`: customer records and normalisation.
- `reports/`: order totals for the staff report.
- `email/`: messages and an outbox queue.
- `storage/`: JSON files; you can leave this unopened for now.
- `lib/`: small shared functions.

You have enough of a map to answer one question. You do not need the rest yet.
