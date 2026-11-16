BenefitX - Public Scholarship Directory Firestore Integration

Apply this patch to the existing BenefitX project. It does not include or replace
.env.local, Firebase credentials, authentication files, or existing admin modules.

Files included:
- src/lib/scholarship-data.ts (new): server-only Firestore reader with an explicit public-field allowlist.
- src/app/api/scholarships/route.ts (new): read-only endpoint for published and verified scholarships.
- src/components/scholarships/scholarship-directory.tsx: loads live records from the endpoint and keeps existing search/filter UI.
- src/components/scholarships/scholarship-card.tsx: labels records as verified.
- src/app/scholarships/[slug]/page.tsx: resolves detail pages from Firestore, not local demo data.
- docs/FIRESTORE_SETUP.md: describes the new data flow.

Data visibility rule:
A scholarship is returned publicly only when BOTH fields match:
  publication.status == "published"
  verification.status == "verified"

The existing firestore.indexes.json already contains the composite index for
publication.status + verification.status + title, so no index change is needed.

Apply:
1. Back up your current project folder or commit your changes in Git.
2. Extract this ZIP into the root of your existing benefitx folder.
3. Merge folders and replace only the included files when prompted.
4. Do not replace .env.local.
5. Run:
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   npm run build
6. If the build succeeds, run:
   npm run start
7. Open http://localhost:3000/api/scholarships
   It should return {"scholarships":[]} until at least one scholarship is both verified and published.
8. Open http://localhost:3000/scholarships to test the public directory.

Important:
The temporary test record is expected to remain hidden because it is in Draft /
Pending status. Do not mark that test record verified or published. Delete it from
Admin > Scholarship Management when finished with the connectivity test.

This patch uses the existing Firebase Admin credentials from .env.local on the
server. No Firebase service-account key is exposed to the browser.
