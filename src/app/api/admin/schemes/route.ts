import { connection, NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getAdminSession } from "@/lib/admin-session";

const COLLECTION = "schemes";
const SCOPES = ["central", "state"] as const;
const CATEGORIES = [
  "agriculture",
  "women-child",
  "healthcare",
  "employment",
  "housing",
  "business",
  "senior-citizens",
  "social-welfare",
  "disability",
  "education",
] as const;
const BENEFICIARY_GROUPS = [
  "farmers",
  "women",
  "children",
  "students",
  "entrepreneurs",
  "senior-citizens",
  "persons-with-disabilities",
  "general-public",
  "workers",
  "families",
] as const;
const APPLICATION_STATUSES = ["open", "ongoing", "upcoming", "closed", "not-verified"] as const;
const VERIFICATION_STATUSES = ["pending", "verified", "rejected"] as const;
const PUBLICATION_STATUSES = ["draft", "in_review", "published", "archived"] as const;

type SchemeInput = {
  title: string;
  slug: string;
  provider: string;
  providerType: string;
  scope: (typeof SCOPES)[number];
  state: string;
  categories: (typeof CATEGORIES)[number][];
  beneficiaryGroups: (typeof BENEFICIARY_GROUPS)[number][];
  description: string;
  objective: string;
  benefits: string[];
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationSteps: string[];
  applicationStatus: (typeof APPLICATION_STATUSES)[number];
  applicationStartDate: string | null;
  deadline: string | null;
  benefitAmount: string | null;
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
  return value.filter(
    (item): item is T[number] => typeof item === "string" && allowed.includes(item as T[number]),
  );
}

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function parseInput(body: unknown): { input?: SchemeInput; error?: string } {
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

  if (!title) return { error: "Scheme name is required." };
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
    ? (scopeValue as SchemeInput["scope"])
    : "central";
  const applicationStatus = APPLICATION_STATUSES.includes(
    applicationStatusValue as (typeof APPLICATION_STATUSES)[number],
  )
    ? (applicationStatusValue as SchemeInput["applicationStatus"])
    : "not-verified";
  const verificationStatus = VERIFICATION_STATUSES.includes(
    verificationStatusValue as (typeof VERIFICATION_STATUSES)[number],
  )
    ? (verificationStatusValue as SchemeInput["verificationStatus"])
    : "pending";
  const publicationStatus = PUBLICATION_STATUSES.includes(
    publicationStatusValue as (typeof PUBLICATION_STATUSES)[number],
  )
    ? (publicationStatusValue as SchemeInput["publicationStatus"])
    : "draft";

  const applicationStartDate = text(data.applicationStartDate) || null;
  const deadline = text(data.deadline) || null;
  if (applicationStartDate && !validDate(applicationStartDate)) {
    return { error: "Application start date must be a valid date." };
  }
  if (deadline && !validDate(deadline)) {
    return { error: "Application deadline must be a valid date." };
  }

  const input: SchemeInput = {
    title,
    slug,
    provider,
    providerType: text(data.providerType) || "Government",
    scope,
    state: text(data.state) || (scope === "central" ? "All India" : "Maharashtra"),
    categories: enumList(data.categories, CATEGORIES),
    beneficiaryGroups: enumList(data.beneficiaryGroups, BENEFICIARY_GROUPS),
    description,
    objective: text(data.objective),
    benefits: stringList(data.benefits),
    eligibilityCriteria: stringList(data.eligibilityCriteria),
    requiredDocuments: stringList(data.requiredDocuments),
    applicationSteps: stringList(data.applicationSteps),
    applicationStatus,
    applicationStartDate,
    deadline,
    benefitAmount: text(data.benefitAmount) || null,
    officialPortalName,
    sourceUrl,
    verificationStatus,
    publicationStatus,
  };

  if (input.categories.length === 0) return { error: "Select at least one scheme category." };
  if (input.beneficiaryGroups.length === 0) return { error: "Select at least one beneficiary group." };

  if (publicationStatus === "published") {
    if (verificationStatus !== "verified") {
      return { error: "Verify the official source before publishing this scheme." };
    }
    const missing: string[] = [];
    if (!input.objective) missing.push("scheme objective");
    if (input.benefits.length === 0) missing.push("benefit details");
    if (input.eligibilityCriteria.length === 0) missing.push("eligibility criteria");
    if (input.applicationSteps.length === 0) missing.push("application steps");
    if (missing.length > 0) {
      return { error: `Add ${missing.join(", ")} before publishing this scheme.` };
    }
  }

  return { input };
}

async function requireAdmin() {
  return (await getAdminSession()) ?? null;
}

function rejectInvalidOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin === request.nextUrl.origin) return null;
  return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
}

export async function GET() {
  // This session-protected endpoint must run for each request, not during prerendering.
  await connection();

  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
    }

    const snapshot = await adminDb.collection(COLLECTION).get();
    const schemes = snapshot.docs
      .map((document) => {
        const data = document.data() as Record<string, unknown>;
        return { ...data, id: document.id, updatedAt: data.updatedAt };
      })
      .sort((a, b) => {
        const aDate = typeof a.updatedAt === "string" ? a.updatedAt : "";
        const bDate = typeof b.updatedAt === "string" ? b.updatedAt : "";
        return bDate.localeCompare(aDate);
      });

    return NextResponse.json(
      { schemes },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Admin scheme list error:", error);
    return NextResponse.json({ error: "Unable to load government schemes." }, { status: 500 });
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

    const parsed = parseInput(await request.json());
    if (!parsed.input) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const duplicate = await adminDb.collection(COLLECTION)
      .where("slug", "==", parsed.input.slug)
      .limit(1)
      .get();
    if (!duplicate.empty) {
      return NextResponse.json({ error: "A scheme with this URL slug already exists." }, { status: 409 });
    }

    const now = new Date().toISOString();
    const verification = {
      status: parsed.input.verificationStatus,
      sourceUrl: parsed.input.sourceUrl,
      lastVerifiedAt: parsed.input.verificationStatus === "verified" ? now : null,
    };
    const reference = adminDb.collection(COLLECTION).doc();
    await reference.set({
      ...parsed.input,
      id: reference.id,
      verification,
      publication: { status: parsed.input.publicationStatus },
      lastVerifiedAt: verification.lastVerifiedAt,
      isDemo: false,
      createdAt: now,
      updatedAt: now,
      createdBy: session.email ?? session.uid ?? "administrator",
      updatedBy: session.email ?? session.uid ?? "administrator",
    });

    return NextResponse.json(
      { id: reference.id, message: "Government scheme created successfully." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin scheme create error:", error);
    return NextResponse.json({ error: "Unable to create government scheme." }, { status: 500 });
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
      return NextResponse.json({ error: "Scheme ID is required." }, { status: 400 });
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
      return NextResponse.json({ error: "Government scheme was not found." }, { status: 404 });
    }

    const duplicate = await adminDb.collection(COLLECTION)
      .where("slug", "==", parsed.input.slug)
      .limit(2)
      .get();
    if (duplicate.docs.some((document) => document.id !== id)) {
      return NextResponse.json({ error: "A scheme with this URL slug already exists." }, { status: 409 });
    }

    const current = existing.data() ?? {};
    const now = new Date().toISOString();
    const wasVerified = current.verification?.status === "verified";
    const verificationSensitiveFields = [
      "title",
      "provider",
      "providerType",
      "officialPortalName",
      "sourceUrl",
      "description",
      "objective",
      "benefits",
      "benefitAmount",
      "applicationStatus",
      "applicationStartDate",
      "deadline",
      "eligibilityCriteria",
      "requiredDocuments",
      "applicationSteps",
      "categories",
      "beneficiaryGroups",
      "scope",
      "state",
    ] as const;
    const verificationSensitiveChanged = verificationSensitiveFields.some((field) =>
      JSON.stringify(current[field] ?? null) !== JSON.stringify(parsed.input?.[field] ?? null),
    );
    const requiresReverification = wasVerified && verificationSensitiveChanged;
    const nextVerificationStatus = requiresReverification ? "pending" : parsed.input.verificationStatus;
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
        ? "Scheme updated. Its verified content changed, so it has been moved back to review. Re-verify it before publishing."
        : "Government scheme updated successfully.",
    });
  } catch (error) {
    console.error("Admin scheme update error:", error);
    return NextResponse.json({ error: "Unable to update government scheme." }, { status: 500 });
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
      return NextResponse.json({ error: "Scheme ID is required." }, { status: 400 });
    }

    const reference = adminDb.collection(COLLECTION).doc(id);
    const existing = await reference.get();
    if (!existing.exists) {
      return NextResponse.json({ error: "Government scheme was not found." }, { status: 404 });
    }

    await reference.delete();
    return NextResponse.json({ id, message: "Government scheme deleted successfully." });
  } catch (error) {
    console.error("Admin scheme delete error:", error);
    return NextResponse.json({ error: "Unable to delete government scheme." }, { status: 500 });
  }
}
