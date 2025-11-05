# Goals: Family Bill Tracker

## MVP (Version 0.1)

1. **Authentication**
   - Support exactly two users to start: father and child.
   - Use Firebase Auth (phone or email/password).
   - Simple login screen; once logged in, remember the user.

2. **Father flow – Capture bills**
   - Home screen with one main action: **"Add New Bill"**.
   - Open camera or gallery to capture/select a bill photo.
   - Optional single-line text field for a short title/description.
   - Save bill with:
     - `status = "pending"`
     - uploaded image in Firebase Storage
     - metadata in Firestore.

3. **Shared view – See bills**
   - Tab or segmented control for:
     - **Pending**
     - **Paid**
   - Each bill row shows:
     - Thumbnail
     - Title (or short fallback)
     - Created date
   - Tapping a bill opens detail view.

4. **Child flow – Mark as paid**
   - From bill detail:
     - Button: **"Mark as Paid"**.
     - Optionally attach a **payment screenshot**.
     - Optional note (e.g., "Paid via bank app on 05-11-2025").
   - Update bill `status` to `"paid"` and store receipt image & note.

5. **Notifications**
   - When father creates a bill → notify child device(s).
   - When child marks bill as paid → optionally notify father.

6. **Basic offline handling**
   - If offline:
     - Allow capturing bill and enqueue upload.
   - When back online:
     - Sync queued bills to Firestore and Storage.

## v1.0 (Post-MVP)

- Bill categories (electricity, gas, internet, etc.).
- Due dates with local reminders.
- Monthly summary (number of bills, optionally total amount).
- Export data (CSV/JSON; PDF summary optional).
- Small UX improvements for visibility and accessibility.

## Non-goals (for now)

- Multi-family / multi-tenant SaaS model.
- Web dashboard.
- Integration with payment gateways or bank APIs.
