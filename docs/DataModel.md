# Data Model

## Collection: `users`

- `id`: string (Firebase Auth UID)
- `displayName`: string
- `role`: `"father"` | `"child"`
- `phoneNumber` or `email`: string (optional, depends on auth)
- `deviceTokens`: string[] (FCM tokens)
- `createdAt`: timestamp
- `updatedAt`: timestamp

## Collection: `bills`

- `id`: string (document ID)
- `createdBy`: string (user ID of creator, usually father)
- `assignedTo`: string (user ID of child; optional, but useful)
- `title`: string (short label, e.g. "Electricity Bill - October")
- `description`: string (optional)
- `amount`: number (optional)
- `currency`: string (optional, default "PKR")
- `category`: string (optional), e.g. "electricity", "gas", "internet"
- `dueDate`: timestamp (optional)
- `status`: `"pending"` | `"paid"`
- `billImageUrl`: string (Firebase Storage URL)
- `receiptImageUrl`: string (Firebase Storage URL, optional)
- `payerNote`: string (optional)
- `createdAt`: timestamp
- `updatedAt`: timestamp

## Local / Offline (client side only)

On the client, you may maintain:
- A local queue of `pendingUploads` if connectivity is lost.
- A local cache for last fetched bills to make UI responsive.
