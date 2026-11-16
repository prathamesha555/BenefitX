import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, "..");
dotenv.config({ path: resolve(projectRoot, ".env.local") });

const EXPECTED_PROJECT_ID = "benefitx-12146";
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
const apply = process.argv.includes("--apply");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing Firebase Admin credentials in .env.local.");
  process.exit(1);
}
if (projectId !== EXPECTED_PROJECT_ID) {
  console.error(`Safety stop: expected Firebase project ${EXPECTED_PROJECT_ID}, found ${projectId}. No data was written.`);
  process.exit(1);
}

const seedPath = resolve(projectRoot, "data", "government-schemes.seed.json");
const records = JSON.parse(await readFile(seedPath, "utf8"));
if (!Array.isArray(records) || records.length !== 20) {
  throw new Error("Seed file must contain exactly 20 scheme records.");
}

const appName = "benefitx-initial-schemes-seed";
const app = getApps().find((item) => item.name === appName) ?? initializeApp({
  credential: cert({ projectId, clientEmail, privateKey }),
  projectId,
}, appName);
const db = getFirestore(app);

let inserted = 0;
let skipped = 0;
const errors = [];

try {
  console.log(`Project: ${projectId}`);
  console.log(`Mode: ${apply ? "APPLY — will write pending/draft records" : "DRY RUN — no writes"}`);
  console.log(`Seed records: ${records.length}`);

  for (const item of records) {
    const existing = await db.collection("schemes").where("slug", "==", item.slug).limit(1).get();
    if (!existing.empty) {
      skipped += 1;
      console.log(`SKIP (slug exists): ${item.title}`);
      continue;
    }

    const now = new Date().toISOString();
    const docRef = db.collection("schemes").doc();
    const document = {
      ...item,
      id: docRef.id,
      verification: {
        status: "pending",
        sourceUrl: item.sourceUrl,
        lastVerifiedAt: null,
      },
      publication: { status: "draft" },
      lastVerifiedAt: null,
      isDemo: false,
      createdAt: now,
      updatedAt: now,
      createdBy: "initial-official-source-seed",
      updatedBy: "initial-official-source-seed",
      seedBatch: "initial-20-government-schemes",
    };

    if (apply) {
      await docRef.create(document);
    }
    inserted += 1;
    console.log(`${apply ? "INSERT" : "WOULD INSERT"}: ${item.title}`);
  }

  console.log("\nSummary");
  console.log(`New records ${apply ? "inserted" : "ready to insert"}: ${inserted}`);
  console.log(`Existing records skipped: ${skipped}`);
  console.log("All inserted records remain verification=pending and publication=draft.");
  if (!apply) {
    console.log("\nNo Firestore data was changed. Run with --apply only after reviewing the seed JSON and source notes.");
  }
} catch (error) {
  console.error("Scheme seeding failed:", error);
  process.exitCode = 1;
} finally {
  await app.delete();
}
