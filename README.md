# Family Bill Tracker (Android-focused)

Private Android-first mobile app for two users (you and your father) to keep track of household bills without using WhatsApp threads.

## Core idea

- Your father takes a **photo of each new bill** inside the app.
- The bill is uploaded to the cloud and stored as **Pending**.
- You get notified and see all **Pending** bills in a list.
- After you pay a bill, you:
  - Mark it as **Paid**.
  - Optionally add a **payment screenshot** and a short note.
- Both of you can always see which bills are **Pending vs Paid**.

This repository is structured as an **AI-friendly dev pack**.  
An AI developer agent (e.g. GitHub Copilot Chat, ChatGPT code interpreter, etc.) can read the docs in `docs/` and then implement the complete app.

## Planned tech stack

- **Mobile app:** React Native + Expo (Android-first, iOS-friendly later if needed)
- **Language:** TypeScript
- **Backend / Cloud:** Firebase (Firestore, Storage, Auth, Cloud Messaging)
- **Testing:** Jest + React Native Testing Library
- **CI:** GitHub Actions (lint + tests + basic build check)

## Where to start

1. Read `docs/Goals.md` and `docs/Architecture.md` for the product vision.
2. Open `docs/FinalAIDeveloperPrompt.md` — this is the main prompt to feed into an AI dev agent.
3. Use the Issues templates in `.github/ISSUE_TEMPLATE/` to track tasks.

Nothing in this pack is final; the AI developer is expected to extend, refine, and keep docs in sync with the implementation.
