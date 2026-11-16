export type SchemeCategory =
  | "agriculture"
  | "women-child"
  | "healthcare"
  | "employment"
  | "housing"
  | "business"
  | "senior-citizens"
  | "social-welfare"
  | "disability"
  | "education";

export type BeneficiaryGroup =
  | "farmers"
  | "women"
  | "children"
  | "students"
  | "entrepreneurs"
  | "senior-citizens"
  | "persons-with-disabilities"
  | "general-public"
  | "workers"
  | "families";

export type SchemeScope = "central" | "state";

export type SchemeStatus =
  | "open"
  | "ongoing"
  | "upcoming"
  | "closed"
  | "not-verified";

export type VerificationStatus = "pending" | "verified" | "rejected";
export type PublicationStatus = "draft" | "in_review" | "published" | "archived";

export interface GovernmentScheme {
  id: string;
  slug: string;
  title: string;
  provider: string;
  providerType: string;
  scope: SchemeScope;
  state: string;
  categories: SchemeCategory[];
  beneficiaryGroups: BeneficiaryGroup[];
  description: string;
  objective: string;
  benefits: string[];
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationSteps: string[];
  applicationStatus: SchemeStatus;
  applicationStartDate: string | null;
  deadline: string | null;
  benefitAmount: string | null;
  officialPortalName: string;
  sourceUrl: string;
  lastVerifiedAt: string | null;
  verification?: {
    status: VerificationStatus;
    sourceUrl?: string;
    lastVerifiedAt: string | null;
  };
  publication?: { status: PublicationStatus };
  createdAt?: string;
  updatedAt?: string;
  isDemo: boolean;
}
