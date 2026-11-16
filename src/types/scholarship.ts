export type EducationLevel =
  | "school"
  | "higher-secondary"
  | "diploma"
  | "undergraduate"
  | "postgraduate"
  | "doctoral";

export type ScholarshipType =
  | "merit"
  | "need-based"
  | "category-based"
  | "minority"
  | "disability"
  | "technical"
  | "research";

export type ApplicationStatus =
  | "open"
  | "upcoming"
  | "closed"
  | "not-verified";

export type ScholarshipScope =
  | "central"
  | "state"
  | "institution";

export interface Scholarship {
  id: string;

  slug: string;

  title: string;

  provider: string;

  providerType: string;

  scope: ScholarshipScope;

  state: string;

  educationLevels: EducationLevel[];

  scholarshipType: ScholarshipType[];

  description: string;

  benefitSummary: string;

  eligibilitySummary: string[];

  documents: string[];

  applicationProcess: string[];

  applicationStatus: ApplicationStatus;

  deadline: string | null;

  amount: string | null;

  officialPortalName: string;

  sourceUrl: string;

  lastVerifiedAt: string | null;

  /** Editorial verification state, separate from the application window. */
  verification?: {
    status: "pending" | "verified" | "rejected";
    sourceUrl?: string;
    lastVerifiedAt: string | null;
  };

  /** Controls whether this record is visible in the public directory. */
  publication?: {
    status: "draft" | "in_review" | "published" | "archived";
  };

  createdAt?: string;
  updatedAt?: string;

  isDemo: boolean;
}