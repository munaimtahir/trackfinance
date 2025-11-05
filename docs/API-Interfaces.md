# API / Interfaces

The primary "API" layer is Firebase SDK usage. The AI developer should create a small wrapper layer so the rest of the app does not depend directly on Firebase APIs.

## Firebase wrapper (example)

- `services/firebaseApp.ts`
  - Initializes the Firebase app using config.
  - Exports `auth`, `firestore`, `storage`, `messaging`.

- `services/bills.ts`
  - `createBill(payload: CreateBillPayload): Promise<Bill>`
  - `getBillsByStatus(status: "pending" | "paid"): Promise<Bill[]>`
  - `subscribeToBillsByStatus(...)` for real-time updates.
  - `markBillPaid(id: string, payload: MarkPaidPayload): Promise<void>`

- `services/users.ts`
  - `saveDeviceToken(userId: string, token: string)`
  - `getCurrentUserProfile()`

The exact TypeScript interfaces should be aligned with `docs/DataModel.md`.
