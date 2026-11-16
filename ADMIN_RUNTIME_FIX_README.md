# BenefitX Admin Runtime Fix

This patch fixes the Next.js 16 prerender-time `Date.now()` failure triggered by Firebase Admin session-cookie verification.

## Files changed

- `src/app/admin/page.tsx` — puts admin session verification and dashboard stats behind request-time rendering and a Suspense fallback.
- `src/app/admin/scholarships/page.tsx` — applies the same approach to Scholarship Management.
- `src/app/api/admin/scholarships/route.ts` — makes the GET handler explicitly request-time before verifying the HTTP-only admin session.
- `src/components/auth/login-form.tsx` — only routes to `/admin` when both required custom claims are present (`admin: true` and `role: "super_admin"`), matching the server-side guard.

## Apply the patch

1. Stop the local server with `Ctrl + C`.
2. Extract this ZIP into the root of your existing `benefitx` project folder.
3. Allow the four files under `src/` to be replaced.
4. Do not replace or delete `.env.local`.
5. Remove the Next.js build cache and restart:

   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   npm run dev
   ```

6. Test these routes after signing in with the administrator account:
   - `http://localhost:3000/admin`
   - `http://localhost:3000/admin/scholarships`

## Administrator permission check

The server guard requires both Firebase custom claims:

```json
{
  "admin": true,
  "role": "super_admin"
}
```

If the account has not received these claims yet, find its UID under Firebase Console > Authentication > Users and run this from the project root:

```powershell
node scripts/set-admin.mjs YOUR_FIREBASE_AUTH_UID
```

Then sign out and sign in again so Firebase refreshes the ID token and the server session cookie contains the claims.

Never commit `.env.local` or the Firebase service-account private key.
