# Requests on the staff desk

## Gift cards

**Grace:** Customers should buy a gift card and spend it over several visits.
For this iteration, staff issue cards into the bundled records; online purchase
is a separate request. A card can pay part of an order; the rest goes to the
ordinary payment gateway. A zero balance means no further spend is allowed.

Refunds go back to the original tender: the gift-card share to the gift card,
the remainder to the ordinary card. Across several returns, rounding must not
send either tender more than its original contribution. A gift-card balance
must never exceed its original issued value. Decline the command without saving
anything if that limit would be crossed. Stock and refund rules still apply.

## Discounts

**Grace:** When a customer supplies two codes, reject the request with “Use one
discount code”. Do not silently pick one or combine their percentages. Also
reject a comma-separated string of codes with that same message.

## Reports

**Grace:** Add a `books` column to the CSV, counting all copies, including
complimentary copies. Leave money in the existing pound columns. Customer
addresses do not belong in this report.

## Payments

**Grace:** If a response goes missing after a charge, find out what happened
without taking another payment. Two attempts are allowed, one charge is not two.
