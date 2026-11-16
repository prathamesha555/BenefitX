# BenefitX — Cloud Firestore setup

BenefitX already uses Firebase Authentication. Use the **same Firebase project** as the current BenefitX `.env.local` web configuration so Authentication and Firestore share one project.

## 1. Create the database

1. Open https://console.firebase.google.com/ and select the Firebase project used by BenefitX.
2. Open **Build → Firestore Database** (in the current console navigation it may appear under **Databases & Storage → Firestore**).
3. Select **Create database**.
4. Choose **Standard edition** and the **Production mode** starting rules.
5. Choose `asia-south1 (Mumbai)` for an India-first user base, if the console allows it. The database location cannot be changed after creation.
6. Complete database creation.

Do not create a second Firebase project just for Firestore unless you intentionally want to separate Authentication and database projects.

## 2. Add a Firebase Web App configuration

In Firebase Console, open **Project settings → General → Your apps**. If the project already has the Web App used by BenefitX, reuse its values. Otherwise, register a Web App named `BenefitX Web`.

Copy the web app configuration into the existing project's `.env.local` using the variable names in `.env.local.example`:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Keep the existing Authentication configuration. Do not replace values with example placeholders.

## 3. Configure the server-side Admin SDK

BenefitX's protected admin APIs use `firebase-admin`. In Firebase Console, open **Project settings → Service accounts → Firebase Admin SDK → Generate new private key**. Store the downloaded JSON securely and copy only these values into `.env.local`:

- `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
- `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
- `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`

For the private key, preserve the full `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines. In `.env.local`, keep it as one quoted value with `\n` between key lines, as shown in `.env.local.example`.

**Never** commit `.env.local`, upload the service-account JSON to GitHub, put the private key in a `NEXT_PUBLIC_` variable, or send it in chat.

## 4. Deploy the Firestore security rules and indexes

From the BenefitX project folder in PowerShell:

```powershell
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,firestore:indexes --project YOUR_FIREBASE_PROJECT_ID
```

Replace `YOUR_FIREBASE_PROJECT_ID` with the exact `project_id` value from the Firebase Web App configuration. Review the project name shown by the CLI before confirming deployment.

The rules in `firestore.rules` are designed for the current BenefitX code:

- Anyone can read only opportunities that are both published and verified.
- Browser clients cannot create, edit or delete scholarships or schemes.
- Signed-in users can read and edit only their own basic profile.
- Users can manage only their own bookmarks.
- Admin-only data is not accessible directly from browser clients. Admin changes go through protected Next.js API routes using the Admin SDK.

## 5. Check the connection

After `.env.local` contains the real values, run:

```powershell
npm run db:check
```

A successful check writes a temporary record, reads it back, and deletes it. It does not add demo scholarships or schemes.

Then restart Next.js:

```powershell
npm run dev
```

## 6. Firestore collections BenefitX will use

Firestore creates collections automatically when the first document is written. You do not need to manually create empty collections.

| Collection | Purpose |
|---|---|
| `scholarships` | Scholarship records managed from Admin |
| `schemes` | Government scheme records |
| `users` | Private user profiles |
| `users/{uid}/bookmarks` | A user's saved opportunities |
| `adminUsers` | Reserved for server-managed administration data |
| `auditLogs` | Reserved for administrator activity history |

The current scholarship admin module writes to `scholarships`. Government scheme CRUD and public Firestore-backed directory reads are separate implementation steps; the existing public directories still use local sample data until those integrations are completed. Do not treat sample records as official or verified.

## 7. First live database smoke test

Once `npm run db:check` succeeds, open `/admin/scholarships` while signed in with an account that already has the required Firebase custom claims (`admin: true`, `role: super_admin`). Create one test draft using an official source. Verify that it appears in Firebase Console → Firestore Database → `scholarships`.

Do not mark a record verified or publish it until the details have actually been checked against the official source.


## Public scholarship directory data flow

The public `/scholarships` directory now loads from `GET /api/scholarships`.
The server-side data service returns only documents where both
`publication.status == "published"` and `verification.status == "verified"`.
Scholarship detail pages resolve the slug from the same filtered Firestore source.
Draft, in-review, archived, pending and rejected records remain hidden.
