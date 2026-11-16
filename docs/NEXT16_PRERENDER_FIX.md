# BenefitX — Next.js 16 Cache Components build fix

This patch addresses the two prerendering errors reported by the local build:

1. `/api/scholarships` was being prerendered even though it reads live Firestore data. The Route Handler now calls `await connection()` directly at the start of `GET`, which opts it into request-time execution. The shared Firestore helper no longer calls `connection()` from inside a service function.
2. The shared `SiteHeader` calls `usePathname()`. With Cache Components enabled, it is now rendered under a Suspense boundary in the root layout.
3. The scholarship detail page now places its dynamic params and Firestore lookup inside a Suspense-wrapped async child component. The detail page uses static route metadata, avoiding a metadata-time Firestore read outside the Suspense boundary.

## Apply

Merge the `src` folder into the existing BenefitX project and replace the four included files. Do not replace `.env.local`, Firebase config, package files, or your existing Firestore rules/indexes.

Files:
- `src/app/layout.tsx`
- `src/app/api/scholarships/route.ts`
- `src/app/scholarships/[slug]/page.tsx`
- `src/lib/scholarship-data.ts`

Then run:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run build
```

Only after the build succeeds, run `npm run start` and test `/api/scholarships`, `/scholarships`, and a published scholarship detail URL.
