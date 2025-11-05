# Tests Plan

The AI developer should implement and maintain automated tests that cover:

## Unit tests

- Data helpers for:
  - Building bill payloads.
  - Mapping Firestore documents to app models.
- Hooks:
  - `useCreateBill`:
    - Handles success.
    - Handles failure (surface a readable error).
  - `useMarkBillPaid`:
    - Updates status.
    - Attaches receipt image URL and note.

## Integration / component tests

Using React Native Testing Library where possible:

1. **Bill creation flow**
   - Given a logged-in father:
     - Press "Add New Bill".
     - Mock camera/gallery selection.
     - Submit.
     - Verify Firestore create is called.
     - UI shows confirmation.

2. **Pending list view**
   - With fixtures for pending and paid bills:
     - Pending tab shows only pending.
     - Paid tab shows only paid.

3. **Mark as paid flow**
   - Given a pending bill:
     - Open detail.
     - Click "Mark as Paid".
     - Attach mock screenshot and note.
     - Verify Firestore update.
     - UI moves bill from Pending to Paid.

## CI expectations

- Tests must run in GitHub Actions on every push/PR.
- Lint and type-check should pass:
  - TypeScript type checking.
  - ESLint with a basic React Native rule set.
