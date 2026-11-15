import type { Scholarship } from "@/types/scholarship";

/*
  IMPORTANT:

  These are demonstration records for UI development.

  They are NOT actual government scholarships.

  Replace them with officially verified records
  before publishing the platform.
*/

export const scholarships: Scholarship[] = [

  {
    id: "demo-001",

    slug: "school-merit-scholarship-demo",

    title: "School Merit Scholarship – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "central",

    state: "All India",

    educationLevels: ["school"],

    scholarshipType: ["merit"],

    description:
      "An illustrative scholarship listing designed to demonstrate how school-level opportunities will appear on BenefitX.",

    benefitSummary:
      "Financial assistance details will be displayed after official verification.",

    eligibilitySummary: [
      "Illustrative academic eligibility condition.",
      "Actual academic requirements must be verified.",
      "Applicable education level must match the official notification."
    ],

    documents: [],

    applicationProcess: [
      "Review the official scholarship notification.",
      "Check the eligibility requirements.",
      "Follow the official application instructions."
    ],

    applicationStatus: "not-verified",

    deadline: null,

    amount: null,

    officialPortalName: "National Scholarship Portal",

    sourceUrl: "https://scholarships.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  },

  {
    id: "demo-002",

    slug: "post-matric-scholarship-demo",

    title: "Post-Matric Scholarship – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "state",

    state: "Maharashtra",

    educationLevels: [
      "higher-secondary",
      "undergraduate"
    ],

    scholarshipType: [
      "need-based",
      "category-based"
    ],

    description:
      "An illustrative post-matric scholarship listing for testing the BenefitX search and filtering system.",

    benefitSummary:
      "Actual financial benefits depend on the relevant official scheme.",

    eligibilitySummary: [
      "The applicant must satisfy the applicable education criteria.",
      "Income criteria must be checked against the official notification.",
      "Category-specific requirements may apply."
    ],

    documents: [],

    applicationProcess: [
      "Visit the Maharashtra Government scholarship portal.",
      "Identify the applicable scheme.",
      "Review the official eligibility conditions."
    ],

    applicationStatus: "not-verified",

    deadline: null,

    amount: null,

    officialPortalName: "MahaDBT",

    sourceUrl: "https://mahadbt.maharashtra.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  },

  {
    id: "demo-003",

    slug: "undergraduate-financial-assistance-demo",

    title: "Undergraduate Financial Assistance – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "central",

    state: "All India",

    educationLevels: ["undergraduate"],

    scholarshipType: ["need-based"],

    description:
      "An illustrative listing demonstrating how undergraduate financial assistance opportunities will be presented.",

    benefitSummary:
      "Financial assistance information is pending verification.",

    eligibilitySummary: [
      "Applicant must satisfy the applicable course requirements.",
      "Income-related requirements may apply.",
      "Additional conditions depend on the actual scheme."
    ],

    documents: [],

    applicationProcess: [
      "Review the relevant official scheme.",
      "Check eligibility and document requirements.",
      "Follow the official application procedure."
    ],

    applicationStatus: "not-verified",

    deadline: null,

    amount: null,

    officialPortalName: "National Scholarship Portal",

    sourceUrl: "https://scholarships.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  },

  {
    id: "demo-004",

    slug: "technical-education-scholarship-demo",

    title: "Technical Education Scholarship – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "state",

    state: "Maharashtra",

    educationLevels: [
      "diploma",
      "undergraduate"
    ],

    scholarshipType: [
      "merit",
      "technical"
    ],

    description:
      "An illustrative technical education scholarship listing for engineering and diploma-level discovery workflows.",

    benefitSummary:
      "Actual assistance details must be confirmed through the applicable scheme notification.",

    eligibilitySummary: [
      "Applicant must be enrolled in an eligible technical course.",
      "Course and institution requirements must be verified.",
      "Additional academic conditions may apply."
    ],

    documents: [],

    applicationProcess: [
      "Identify the applicable technical education scheme.",
      "Check the official eligibility requirements.",
      "Use the relevant government application portal."
    ],

    applicationStatus: "not-verified",

    deadline: null,

    amount: null,

    officialPortalName: "MahaDBT",

    sourceUrl: "https://mahadbt.maharashtra.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  },

  {
    id: "demo-005",

    slug: "minority-education-assistance-demo",

    title: "Minority Education Assistance – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "central",

    state: "All India",

    educationLevels: [
      "school",
      "higher-secondary",
      "undergraduate"
    ],

    scholarshipType: ["minority"],

    description:
      "An illustrative educational assistance listing demonstrating minority-related scholarship categories.",

    benefitSummary:
      "Benefits and applicable conditions require official verification.",

    eligibilitySummary: [
      "Scheme-specific eligibility requirements must be checked.",
      "Applicable academic requirements may apply.",
      "Supporting documents depend on the official scheme."
    ],

    documents: [],

    applicationProcess: [
      "Check the relevant official notification.",
      "Review applicable eligibility criteria.",
      "Follow the official application instructions."
    ],

    applicationStatus: "not-verified",

    deadline: null,

    amount: null,

    officialPortalName: "National Scholarship Portal",

    sourceUrl: "https://scholarships.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  },

  {
    id: "demo-006",

    slug: "postgraduate-research-fellowship-demo",

    title: "Postgraduate Research Fellowship – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "central",

    state: "All India",

    educationLevels: [
      "postgraduate",
      "doctoral"
    ],

    scholarshipType: ["research"],

    description:
      "An illustrative research funding listing for demonstrating postgraduate and doctoral scholarship discovery.",

    benefitSummary:
      "Fellowship amount and funding conditions are not yet verified.",

    eligibilitySummary: [
      "Applicant must satisfy the relevant academic qualifications.",
      "Research programme requirements must be checked.",
      "Additional institutional conditions may apply."
    ],

    documents: [],

    applicationProcess: [
      "Identify the relevant research fellowship.",
      "Review its official notification.",
      "Follow the application procedure specified by the provider."
    ],

    applicationStatus: "not-verified",

    deadline: null,

    amount: null,

    officialPortalName: "National Scholarship Portal",

    sourceUrl: "https://scholarships.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  }

];

export function getScholarshipBySlug(slug: string) {
  return scholarships.find(
    (scholarship) => scholarship.slug === slug
  );
}