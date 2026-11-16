import "server-only";

import { adminDb } from "@/lib/firebase-admin";
import type { Scholarship } from "@/types/scholarship";

const COLLECTION = "scholarships";

function toScholarship(
  id: string,
  data: Record<string, unknown>,
): Scholarship {
  // Return an explicit public-field allowlist. Admin emails and other internal
  // metadata written by the management API must never reach public visitors.
  return {
    id,
    slug: String(data.slug ?? ""),
    title: String(data.title ?? ""),
    provider: String(data.provider ?? ""),
    providerType: String(data.providerType ?? ""),
    scope: data.scope as Scholarship["scope"],
    state: String(data.state ?? ""),
    educationLevels: Array.isArray(data.educationLevels)
      ? (data.educationLevels as Scholarship["educationLevels"])
      : [],
    scholarshipType: Array.isArray(data.scholarshipType)
      ? (data.scholarshipType as Scholarship["scholarshipType"])
      : [],
    description: String(data.description ?? ""),
    benefitSummary: String(data.benefitSummary ?? ""),
    eligibilitySummary: Array.isArray(data.eligibilitySummary)
      ? (data.eligibilitySummary as string[])
      : [],
    documents: Array.isArray(data.documents) ? (data.documents as string[]) : [],
    applicationProcess: Array.isArray(data.applicationProcess)
      ? (data.applicationProcess as string[])
      : [],
    applicationStatus: data.applicationStatus as Scholarship["applicationStatus"],
    deadline: typeof data.deadline === "string" ? data.deadline : null,
    amount: typeof data.amount === "string" ? data.amount : null,
    officialPortalName: String(data.officialPortalName ?? ""),
    sourceUrl: String(data.sourceUrl ?? ""),
    lastVerifiedAt: typeof data.lastVerifiedAt === "string" ? data.lastVerifiedAt : null,
    verification: {
      status: "verified",
      sourceUrl: String(data.sourceUrl ?? ""),
      lastVerifiedAt:
        typeof (data.verification as Record<string, unknown> | undefined)?.lastVerifiedAt === "string"
          ? ((data.verification as Record<string, unknown>).lastVerifiedAt as string)
          : null,
    },
    publication: { status: "published" },
    isDemo: false,
  };
}

/**
 * Returns only opportunities that have passed editorial verification and
 * have explicitly been published by an administrator.
 */
export async function getPublishedScholarships(): Promise<Scholarship[]> {
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("publication.status", "==", "published")
    .where("verification.status", "==", "verified")
    .orderBy("title", "asc")
    .get();

  return snapshot.docs.map((document) =>
    toScholarship(document.id, document.data() as Record<string, unknown>),
  );
}

/** Returns one public opportunity by slug, or null when it is not public. */
export async function getPublishedScholarshipBySlug(
  slug: string,
): Promise<Scholarship | null> {
  const snapshot = await adminDb
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();

  const document = snapshot.docs[0];
  if (!document) return null;

  const data = document.data();
  if (
    data.publication?.status !== "published" ||
    data.verification?.status !== "verified"
  ) {
    return null;
  }

  return toScholarship(document.id, data as Record<string, unknown>);
}
