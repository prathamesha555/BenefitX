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
  console.error("Required: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY.");
  process.exit(1);
}
if (projectId !== EXPECTED_PROJECT_ID) {
  console.error(`Safety stop: expected Firebase project ${EXPECTED_PROJECT_ID}, found ${projectId}. No data was written.`);
  process.exit(1);
}

const seedPath = resolve(projectRoot, "data", "scholarships.seed.json");
const records = JSON.parse(await readFile(seedPath, "utf8"));
if (!Array.isArray(records) || records.length !== 20) {
  throw new Error("Seed file must contain exactly 20 scholarship records.");
}
const slugs = records.map((item) => item.slug);
if (new Set(slugs).size !== slugs.length) {
  throw new Error("Duplicate slugs found in the scholarship seed file.");
}

const appName = "benefitx-initial-scholarships-seed";
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
  console.log(`Collection: scholarships`);
  console.log(`Mode: ${apply ? "APPLY — will write pending/draft records" : "DRY RUN — no writes"}`);
  console.log(`Seed records: ${records.length}`);

  for (const item of records) {
    try {
      const existing = await db.collection("scholarships").where("slug", "==", item.slug).limit(1).get();
      if (!existing.empty) {
        skipped += 1;
        console.log(`SKIP (slug exists): ${item.title}`);
        continue;
      }

      const now = new Date().toISOString();
      const docRef = db.collection("scholarships").doc();
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
        seedBatch: "initial-20-government-scholarships",
      };

      if (apply) await docRef.create(document);
      inserted += 1;
      console.log(`${apply ? "INSERT" : "WOULD INSERT"}: ${item.title}`);
    } catch (error) {
      errors.push({ title: item.title, message: error instanceof Error ? error.message : String(error) });
      console.error(`ERROR: ${item.title}: ${errors.at(-1).message}`);
    }
  }

  console.log("\nSummary");
  console.log(`${apply ? "New records inserted" : "New records ready to insert"}: ${inserted}`);
  console.log(`Existing records skipped: ${skipped}`);
  console.log(`Failed records: ${errors.length}`);
  console.log("All inserted records remain verification=pending and publication=draft.");
  if (!apply) {
    console.log("\nDry run only: no Firestore data was changed. Review scholarships.seed.json, then run with --apply.");
  }
  if (errors.length) process.exitCode = 1;
} catch (error) {
  console.error("Scholarship seeding failed:", error);
  process.exitCode = 1;
} finally {
  await app.delete();
}
