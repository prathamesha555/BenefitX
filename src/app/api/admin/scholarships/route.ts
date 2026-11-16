import { connection, NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getAdminSession } from "@/lib/admin-session";

const COLLECTION = "scholarships";
const EDUCATION_LEVELS = [
  "school",
  "higher-secondary",
  "diploma",
  "undergraduate",
  "postgraduate",
  "doctoral",
] as const;
const SCHOLARSHIP_TYPES = [
  "merit",
  "need-based",
  "category-based",
  "minority",
  "disability",
  "technical",
  "research",
] as const;
const APPLICATION_STATUSES = [
  "open",
  "upcoming",
  "closed",
  "not-verified",
] as const;
const SCOPES = ["central", "state", "institution"] as const;
const PUBLICATION_STATUSES = ["draft", "in_review", "published", "archived"] as const;
const VERIFICATION_STATUSES = ["pending", "verified", "rejected"] as const;

type ScholarshipInput = {
  title: string;
  slug: string;
  provider: string;
  providerType: string;
  scope: (typeof SCOPES)[number];
  state: string;
  educationLevels: (typeof EDUCATION_LEVELS)[number][];
  scholarshipType: (typeof SCHOLARSHIP_TYPES)[number][];
  description: string;
  benefitSummary: string;
  eligibilitySummary: string[];
  documents: string[];
  applicationProcess: string[];
  applicationStatus: (typeof APPLICATION_STATUSES)[number];
  deadline: string | null;
  amount: string | null;
  officialPortalName: string;
  sourceUrl: string;
  verificationStatus: (typeof VERIFICATION_STATUSES)[number];
  publicationStatus: (typeof PUBLICATION_STATUSES)[number];
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function enumList<T extends readonly string[]>(value: unknown, allowed: T): T[number][] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is T[number] =>
    typeof item === "string" && allowed.includes(item as T[number]),
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseInput(body: unknown): { input?: ScholarshipInput; error?: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Invalid request body." };
  }

  const data = body as Record<string, unknown>;
  const title = text(data.title);
  const provider = text(data.provider);
  const description = text(data.description);
  const officialPortalName = text(data.officialPortalName);
  const sourceUrl = text(data.sourceUrl);
  const slug = slugify(text(data.slug) || title);

  if (!title) return { error: "Scholarship name is required." };
  if (!provider) return { error: "Provider or government department is required." };
  if (!description) return { error: "Description is required." };
  if (!officialPortalName) return { error: "Official portal name is required." };
  if (!slug) return { error: "A valid URL slug could not be generated." };

  try {
    const url = new URL(sourceUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return { error: "The official source must use HTTP or HTTPS." };
    }
  } catch {
    return { error: "Enter a valid official source URL." };
  }

  const scopeValue = text(data.scope);
  const applicationStatusValue = text(data.applicationStatus);
  const verificationStatusValue = text(data.verificationStatus);
  const publicationStatusValue = text(data.publicationStatus);

  const scope = SCOPES.includes(scopeValue as (typeof SCOPES)[number])
    ? scopeValue as ScholarshipInput["scope"]
    : "central";
  const applicationStatus = APPLICATION_STATUSES.includes(
    applicationStatusValue as (typeof APPLICATION_STATUSES)[number],
  )
    ? applicationStatusValue as ScholarshipInput["applicationStatus"]
    : "not-verified";
  const verificationStatus = VERIFICATION_STATUSES.includes(
    verificationStatusValue as (typeof VERIFICATION_STATUSES)[number],
  )
    ? verificationStatusValue as ScholarshipInput["verificationStatus"]
    : "pending";
  const publicationStatus = PUBLICATION_STATUSES.includes(
    publicationStatusValue as (typeof PUBLICATION_STATUSES)[number],
  )
    ? publicationStatusValue as ScholarshipInput["publicationStatus"]
    : "draft";

  if (publicationStatus === "published" && verificationStatus !== "verified") {
    return {
      error: "Verify the official source before publishing this scholarship.",
    };
  }

  const deadline = text(data.deadline) || null;
  if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    return { error: "Deadline must be a valid date." };
  }

  const input: ScholarshipInput = {
    title,
    slug,
    provider,
    providerType: text(data.providerType) || "Government",
    scope,
    state: text(data.state) || (scope === "central" ? "All India" : "Maharashtra"),
    educationLevels: enumList(data.educationLevels, EDUCATION_LEVELS),
    scholarshipType: enumList(data.scholarshipType, SCHOLARSHIP_TYPES),
    description,
    benefitSummary: text(data.benefitSummary),
    eligibilitySummary: stringList(data.eligibilitySummary),
    documents: stringList(data.documents),
    applicationProcess: stringList(data.applicationProcess),
    applicationStatus,
    deadline,
    amount: text(data.amount) || null,
    officialPortalName,
    sourceUrl,
    verificationStatus,
    publicationStatus,
  };

  if (input.educationLevels.length === 0) {
    return { error: "Select at least one eligible education level." };
  }
  if (input.scholarshipType.length === 0) {
    return { error: "Select at least one scholarship category." };
  }

  if (publicationStatus === "published") {
    const missing: string[] = [];
    if (!input.benefitSummary) missing.push("benefit details");
    if (input.eligibilitySummary.length === 0) missing.push("eligibility criteria");
    if (input.documents.length === 0) missing.push("required documents");
    if (input.applicationProcess.length === 0) missing.push("application steps");
    if (missing.length > 0) {
      return {
        error: `Add ${missing.join(", ")} before publishing this scholarship.`,
      };
    }
  }

  return { input };
}

async function requireAdmin() {
  const session = await getAdminSession();
  return session ? session : null;
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return origin === request.nextUrl.origin;
}

function rejectInvalidOrigin(request: NextRequest) {
  if (isSameOrigin(request)) return null;
  return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
}

export async function GET() {
  // GET route handlers can be prerendered. This endpoint reads an HTTP-only
  // admin session and verifies it with Firebase Admin, so it must run per request.
  await connection();

  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
    }

    const snapshot = await adminDb.collection(COLLECTION).get();
    const scholarships = snapshot.docs
      .map((document) => {
        // Firestore DocumentData has an open-ended shape. Keep the timestamp
        // field explicit so TypeScript knows it exists before sorting.
        const data = document.data() as Record<string, unknown>;
        return {
          ...data,
          id: document.id,
          updatedAt: data.updatedAt,
        };
      })
      .sort((a, b) => {
        const aDate = typeof a.updatedAt === "string" ? a.updatedAt : "";
        const bDate = typeof b.updatedAt === "string" ? b.updatedAt : "";
        return bDate.localeCompare(aDate);
      });

    return NextResponse.json(
      { scholarships },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Admin scholarship list error:", error);
    return NextResponse.json({ error: "Unable to load scholarships." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const originError = rejectInvalidOrigin(request);
  if (originError) return originError;

  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
    }

    const body = await request.json();
    const parsed = parseInput(body);
    if (!parsed.input) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const duplicate = await adminDb
      .collection(COLLECTION)
      .where("slug", "==", parsed.input.slug)
      .limit(1)
      .get();

    if (!duplicate.empty) {
      return NextResponse.json({ error: "A scholarship with this URL slug already exists." }, { status: 409 });
    }

    const now = new Date().toISOString();
    const verification = {
      status: parsed.input.verificationStatus,
      sourceUrl: parsed.input.sourceUrl,
      lastVerifiedAt: parsed.input.verificationStatus === "verified" ? now : null,
    };
    const record = {
      ...parsed.input,
      verification,
      publication: { status: parsed.input.publicationStatus },
      lastVerifiedAt: verification.lastVerifiedAt,
      isDemo: false,
      createdAt: now,
      updatedAt: now,
      createdBy: session.email ?? session.uid ?? "administrator",
      updatedBy: session.email ?? session.uid ?? "administrator",
    };
    const reference = adminDb.collection(COLLECTION).doc();
    await reference.set({ id: reference.id, ...record });

    return NextResponse.json({ id: reference.id, message: "Scholarship created successfully." }, { status: 201 });
  } catch (error) {
    console.error("Admin scholarship create error:", error);
    return NextResponse.json({ error: "Unable to create scholarship." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const originError = rejectInvalidOrigin(request);
  if (originError) return originError;

  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
    }

    const body = await request.json();
    if (!body || typeof body !== "object" || typeof (body as Record<string, unknown>).id !== "string") {
      return NextResponse.json({ error: "Scholarship ID is required." }, { status: 400 });
    }
    const data = body as Record<string, unknown>;
    const id = text(data.id);
    const parsed = parseInput(data);
    if (!parsed.input) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const reference = adminDb.collection(COLLECTION).doc(id);
    const existing = await reference.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Scholarship was not found." }, { status: 404 });
    }

    const duplicate = await adminDb
      .collection(COLLECTION)
      .where("slug", "==", parsed.input.slug)
      .limit(2)
      .get();
    if (duplicate.docs.some((document) => document.id !== id)) {
      return NextResponse.json({ error: "A scholarship with this URL slug already exists." }, { status: 409 });
    }

    const current = existing.data() ?? {};
    const now = new Date().toISOString();
    const wasVerified = current.verification?.status === "verified";
    const verificationSensitiveFields = [
      "title",
      "provider",
      "sourceUrl",
      "description",
      "benefitSummary",
      "eligibilitySummary",
      "documents",
      "applicationProcess",
      "educationLevels",
      "scholarshipType",
    ] as const;
    const verificationSensitiveChanged = verificationSensitiveFields.some((field) =>
      JSON.stringify(current[field] ?? null) !== JSON.stringify(parsed.input?.[field] ?? null),
    );
    const requiresReverification = wasVerified && verificationSensitiveChanged;
    const nextVerificationStatus = requiresReverification
      ? "pending"
      : parsed.input.verificationStatus;
    const nextPublicationStatus = requiresReverification && parsed.input.publicationStatus === "published"
      ? "in_review"
      : parsed.input.publicationStatus;
    const verification = {
      status: nextVerificationStatus,
      sourceUrl: parsed.input.sourceUrl,
      lastVerifiedAt:
        nextVerificationStatus === "verified"
          ? (wasVerified && !requiresReverification && typeof current.verification?.lastVerifiedAt === "string"
              ? current.verification.lastVerifiedAt
              : now)
          : null,
    };

    await reference.set({
      ...parsed.input,
      id,
      verification,
      publication: { status: nextPublicationStatus },
      lastVerifiedAt: verification.lastVerifiedAt,
      isDemo: false,
      createdAt: current.createdAt ?? now,
      updatedAt: now,
      createdBy: current.createdBy ?? session.email ?? session.uid ?? "administrator",
      updatedBy: session.email ?? session.uid ?? "administrator",
    });

    return NextResponse.json({
      id,
      message: requiresReverification
        ? "Scholarship updated. Its verified content changed, so it has been moved back to review. Re-verify it before publishing."
        : "Scholarship updated successfully.",
    });
  } catch (error) {
    console.error("Admin scholarship update error:", error);
    return NextResponse.json({ error: "Unable to update scholarship." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const originError = rejectInvalidOrigin(request);
  if (originError) return originError;

  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
    }

    const body = await request.json();
    const id = body && typeof body === "object"
      ? text((body as Record<string, unknown>).id)
      : "";
    if (!id) {
      return NextResponse.json({ error: "Scholarship ID is required." }, { status: 400 });
    }

    const reference = adminDb.collection(COLLECTION).doc(id);
    const existing = await reference.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Scholarship was not found." }, { status: 404 });
    }

    await reference.delete();
    return NextResponse.json({ id, message: "Scholarship deleted successfully." });
  } catch (error) {
    console.error("Admin scholarship delete error:", error);
    return NextResponse.json({ error: "Unable to delete scholarship." }, { status: 500 });
  }
}
