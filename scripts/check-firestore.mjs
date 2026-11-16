import dotenv from "dotenv";
import { randomUUID } from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

dotenv.config({ path: ".env.local" });

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    "Missing Firebase Admin credentials. Add FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY to .env.local.",
  );
  process.exit(1);
}

const app = getApps().find((item) => item.name === "benefitx-db-check")
  ?? initializeApp(
    {
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    },
    "benefitx-db-check",
  );

const db = getFirestore(app);
const checkId = randomUUID();
const checkRef = db.collection("_diagnostics").doc(checkId);

try {
  await checkRef.set({
    application: "BenefitX",
    purpose: "Firestore connection test",
    createdAt: FieldValue.serverTimestamp(),
  });

  const saved = await checkRef.get();
  if (!saved.exists || saved.data()?.application !== "BenefitX") {
    throw new Error("The test record could not be read after writing it.");
  }

  await checkRef.delete();
  console.log(`SUCCESS: BenefitX connected to Cloud Firestore project "${projectId}".`);
  console.log("A temporary test document was written, read and deleted successfully.");
} catch (error) {
  console.error("Firestore connection test failed:", error);
  process.exitCode = 1;
} finally {
  await app.delete();
}
