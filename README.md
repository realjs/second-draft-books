# The Second Draft

A small independent bookshop. You've joined its software team. Start by using
one feature, then follow the part of the code that makes it work.

You'll never need to read every file. Start from something you can see working.
Follow one thread at a time, and keep a map of what you find.

## First visit: about ten minutes

Install Node.js 22 or later and Git. There are no npm dependencies to install.

```bash
git clone https://github.com/devcademy/second-draft-books.git
cd second-draft-books
npm run seed
npm start
```

Open http://127.0.0.1:3000/admin/. Place an order for one copy of **Small Maps**,
using customer `customer-1` and discount `READ20`. Find the resulting order in
the table. Its total is £6.00, and a confirmation appears in `outbox/`.
The gateway is a local simulation; it cannot charge a real card. Every customer
and address in this repository is fictional.

Now open `src/orders/pricing.js`, starting at `priceOrder()`. Predict how the
discount affects that total. Read `src/discounts/codes.js` only when pricing
calls it. You can ignore the HTTP server and storage code for this task: they
carry your request to the pricing code and save its answer.

## Useful commands

```bash
npm test
npm run report
```

Stop the server before reseeding. `npm run seed` restores the bundled fictional
records and removes generated outbox files. It never sends emails.

`docs/ARCHITECTURE.md` is Ada's map. `docs/FIRST-HOUR.md` gives you three short
tasks. Neither asks you to read the whole codebase.

## Local practice only

This deliberately small application has no login and uses JSON storage. It binds
to loopback. It is course material, not a service to expose to the internet.
Do not enter real customer details or card information.

History and discussions tell the story of a fictional team. The named authors
are teaching characters, not claims about who implemented this repository.

Course branches are proposals to inspect; switching to one does not mean it is
ready to ship. Run `npm run seed` after switching branches. All branches use
the same shop, customers, books and file layout.
