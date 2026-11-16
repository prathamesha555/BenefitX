import "server-only";

import { adminDb } from "@/lib/firebase-admin";
import type { GovernmentScheme } from "@/types/scheme";

const COLLECTION = "schemes";

type FirestoreScheme = Record<string, unknown> & {
  verification?: { status?: unknown; sourceUrl?: unknown; lastVerifiedAt?: unknown };
  publication?: { status?: unknown };
};

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

/**
 * Return only fields intended for public display. In particular, do not expose
 * createdBy, updatedBy, admin emails, moderation notes, or other admin metadata.
 */
function toPublicScheme(id: string, data: FirestoreScheme): GovernmentScheme {
  const verification = data.verification;
  const verifiedAt = nullableString(verification?.lastVerifiedAt)
    ?? nullableString(data.lastVerifiedAt);

  return {
    id,
    slug: stringValue(data.slug),
    title: stringValue(data.title),
    provider: stringValue(data.provider),
    providerType: stringValue(data.providerType),
    scope: data.scope as GovernmentScheme["scope"],
    state: stringValue(data.state),
    categories: stringArray(data.categories) as GovernmentScheme["categories"],
    beneficiaryGroups: stringArray(data.beneficiaryGroups) as GovernmentScheme["beneficiaryGroups"],
    description: stringValue(data.description),
    objective: stringValue(data.objective),
    benefits: stringArray(data.benefits),
    eligibilityCriteria: stringArray(data.eligibilityCriteria),
    requiredDocuments: stringArray(data.requiredDocuments),
    applicationSteps: stringArray(data.applicationSteps),
    applicationStatus: data.applicationStatus as GovernmentScheme["applicationStatus"],
    applicationStartDate: nullableString(data.applicationStartDate),
    deadline: nullableString(data.deadline),
    benefitAmount: nullableString(data.benefitAmount),
    officialPortalName: stringValue(data.officialPortalName),
    sourceUrl: stringValue(data.sourceUrl),
    lastVerifiedAt: verifiedAt,
    verification: {
      status: "verified",
      sourceUrl: stringValue(verification?.sourceUrl) || stringValue(data.sourceUrl),
      lastVerifiedAt: verifiedAt,
    },
    publication: { status: "published" },
    isDemo: false,
  };
}

function isPublicScheme(data: FirestoreScheme): boolean {
  return (
    data.verification?.status === "verified" &&
    data.publication?.status === "published" &&
    data.isDemo !== true
  );
}

/** Fetch only verified, published, non-demo scheme records for public pages. */
export async function getPublishedSchemes(): Promise<GovernmentScheme[]> {
  // Keep this query on the server. The Admin SDK bypasses client Firestore rules,
  // so this function explicitly enforces publication and verification status.
  const snapshot = await adminDb.collection(COLLECTION).get();

  return snapshot.docs
    .map((document) => ({
      id: document.id,
      data: document.data() as FirestoreScheme,
    }))
    .filter(({ data }) => isPublicScheme(data))
    .map(({ id, data }) => toPublicScheme(id, data))
    .sort((a, b) => a.title.localeCompare(b.title));
}

/** Return a single public scheme by slug, or null if it is not publishable. */
export async function getPublishedSchemeBySlug(
  slug: string,
): Promise<GovernmentScheme | null> {
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();

  const document = snapshot.docs[0];
  if (!document) return null;

  const data = document.data() as FirestoreScheme;
  if (!isPublicScheme(data)) return null;

  return toPublicScheme(document.id, data);
}
