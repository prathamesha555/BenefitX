import type { GovernmentScheme } from "@/types/scheme";

/*
  IMPORTANT:

  These are demonstration records.

  They are NOT actual government scheme announcements.

  Their names, descriptions and eligibility conditions
  are illustrative examples for developing BenefitX.

  Replace them with verified government information
  before making the platform public.
*/

export const governmentSchemes: GovernmentScheme[] = [

  // 1. Agriculture

  {
    id: "scheme-demo-001",

    slug: "farmer-agricultural-support-demo",

    title: "Farmer Agricultural Support – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "central",

    state: "All India",

    categories: ["agriculture"],

    beneficiaryGroups: ["farmers"],

    description:
      "An illustrative agricultural assistance listing demonstrating how farmer-focused government opportunities will appear on BenefitX.",

    objective:
      "Demonstrate the presentation of agricultural assistance information.",

    benefits: [
      "Illustrative financial assistance information.",
      "Agricultural support information.",
      "Access to relevant official resources."
    ],

    eligibilityCriteria: [
      "Actual landholding requirements must be checked.",
      "Applicant conditions depend on the official scheme.",
      "State-specific requirements may apply."
    ],

    requiredDocuments: [],

    applicationSteps: [
      "Identify the relevant official agricultural scheme.",
      "Review the eligibility requirements.",
      "Check the official application instructions."
    ],

    applicationStatus: "not-verified",

    applicationStartDate: null,

    deadline: null,

    benefitAmount: null,

    officialPortalName: "myScheme",

    sourceUrl: "https://www.myscheme.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  },


  // 2. Women and Children

  {
    id: "scheme-demo-002",

    slug: "women-empowerment-support-demo",

    title: "Women Empowerment Support – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "central",

    state: "All India",

    categories: ["women-child"],

    beneficiaryGroups: ["women"],

    description:
      "An illustrative listing demonstrating how women-focused welfare and empowerment opportunities will be presented.",

    objective:
      "Demonstrate the presentation of women-focused support information.",

    benefits: [
      "Illustrative financial support information.",
      "Women-focused welfare resources.",
      "Access to official scheme information."
    ],

    eligibilityCriteria: [
      "Age-related criteria may apply.",
      "Income requirements depend on the actual scheme.",
      "Other conditions must be checked through official information."
    ],

    requiredDocuments: [],

    applicationSteps: [
      "Identify the relevant women-focused government scheme.",
      "Review the official eligibility requirements.",
      "Follow the instructions provided by the scheme authority."
    ],

    applicationStatus: "not-verified",

    applicationStartDate: null,

    deadline: null,

    benefitAmount: null,

    officialPortalName: "myScheme",

    sourceUrl: "https://www.myscheme.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  },


  // 3. Healthcare

  {
    id: "scheme-demo-003",

    slug: "public-healthcare-assistance-demo",

    title: "Public Healthcare Assistance – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "central",

    state: "All India",

    categories: ["healthcare"],

    beneficiaryGroups: [
      "families",
      "general-public"
    ],

    description:
      "An illustrative healthcare assistance listing for demonstrating health and medical welfare categories.",

    objective:
      "Demonstrate how healthcare-related government assistance can be organised.",

    benefits: [
      "Illustrative healthcare assistance information.",
      "Medical welfare resources.",
      "Access to official healthcare scheme information."
    ],

    eligibilityCriteria: [
      "Eligibility depends on the specific healthcare programme.",
      "Beneficiary identification requirements may apply.",
      "Other conditions must be checked through the official authority."
    ],

    requiredDocuments: [],

    applicationSteps: [
      "Find the applicable healthcare programme.",
      "Check the official eligibility conditions.",
      "Follow the authorised enrolment process."
    ],

    applicationStatus: "not-verified",

    applicationStartDate: null,

    deadline: null,

    benefitAmount: null,

    officialPortalName: "myScheme",

    sourceUrl: "https://www.myscheme.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  },


  // 4. Employment

  {
    id: "scheme-demo-004",

    slug: "employment-skill-development-demo",

    title: "Employment & Skill Development – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "central",

    state: "All India",

    categories: ["employment"],

    beneficiaryGroups: [
      "workers",
      "general-public"
    ],

    description:
      "An illustrative employment and skill-development listing demonstrating opportunities for job seekers and workers.",

    objective:
      "Demonstrate the discovery of employment and skill-development resources.",

    benefits: [
      "Illustrative vocational training information.",
      "Skill development resources.",
      "Employment support information."
    ],

    eligibilityCriteria: [
      "Educational qualifications may be required.",
      "Age conditions depend on the programme.",
      "Other requirements depend on the official scheme."
    ],

    requiredDocuments: [],

    applicationSteps: [
      "Identify the relevant employment programme.",
      "Read the official eligibility requirements.",
      "Apply using the designated official process."
    ],

    applicationStatus: "not-verified",

    applicationStartDate: null,

    deadline: null,

    benefitAmount: null,

    officialPortalName: "myScheme",

    sourceUrl: "https://www.myscheme.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  },


  // 5. Housing

  {
    id: "scheme-demo-005",

    slug: "affordable-housing-support-demo",

    title: "Affordable Housing Support – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "central",

    state: "All India",

    categories: ["housing"],

    beneficiaryGroups: ["families"],

    description:
      "An illustrative housing assistance listing demonstrating how housing-related government benefits will appear.",

    objective:
      "Demonstrate the organisation of housing support information.",

    benefits: [
      "Illustrative housing assistance information.",
      "Housing-related resources.",
      "Access to official housing programme information."
    ],

    eligibilityCriteria: [
      "Household conditions must be verified.",
      "Income limits may apply.",
      "Property-related conditions depend on the actual scheme."
    ],

    requiredDocuments: [],

    applicationSteps: [
      "Identify the applicable housing programme.",
      "Review the official eligibility guidelines.",
      "Follow the application process specified by the authority."
    ],

    applicationStatus: "not-verified",

    applicationStartDate: null,

    deadline: null,

    benefitAmount: null,

    officialPortalName: "myScheme",

    sourceUrl: "https://www.myscheme.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  },


  // 6. Business

  {
    id: "scheme-demo-006",

    slug: "entrepreneur-business-assistance-demo",

    title: "Entrepreneur Business Assistance – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "central",

    state: "All India",

    categories: ["business"],

    beneficiaryGroups: ["entrepreneurs"],

    description:
      "An illustrative business assistance listing demonstrating how entrepreneurship and enterprise support opportunities will be organised.",

    objective:
      "Demonstrate business-support and entrepreneurship information discovery.",

    benefits: [
      "Illustrative business support information.",
      "Entrepreneurship resources.",
      "Information about possible financial assistance."
    ],

    eligibilityCriteria: [
      "Business registration requirements may apply.",
      "Applicant and business eligibility must be checked.",
      "Financing conditions depend on the actual programme."
    ],

    requiredDocuments: [],

    applicationSteps: [
      "Identify the applicable business-support programme.",
      "Review the official eligibility conditions.",
      "Contact or apply through the authorised institution."
    ],

    applicationStatus: "not-verified",

    applicationStartDate: null,

    deadline: null,

    benefitAmount: null,

    officialPortalName: "myScheme",

    sourceUrl: "https://www.myscheme.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  },


  // 7. Senior Citizens

  {
    id: "scheme-demo-007",

    slug: "senior-citizen-welfare-demo",

    title: "Senior Citizen Welfare Support – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "central",

    state: "All India",

    categories: ["senior-citizens", "social-welfare"],

    beneficiaryGroups: ["senior-citizens"],

    description:
      "An illustrative welfare listing demonstrating how senior-citizen support opportunities will be presented.",

    objective:
      "Demonstrate the organisation of senior-citizen welfare information.",

    benefits: [
      "Illustrative welfare assistance information.",
      "Senior-citizen support resources.",
      "Access to official programme information."
    ],

    eligibilityCriteria: [
      "Age requirements depend on the actual programme.",
      "Income conditions may apply.",
      "Other requirements must be checked through official information."
    ],

    requiredDocuments: [],

    applicationSteps: [
      "Identify the applicable senior-citizen programme.",
      "Verify the age and other eligibility conditions.",
      "Follow the official application instructions."
    ],

    applicationStatus: "not-verified",

    applicationStartDate: null,

    deadline: null,

    benefitAmount: null,

    officialPortalName: "myScheme",

    sourceUrl: "https://www.myscheme.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  },


  // 8. Disability Assistance

  {
    id: "scheme-demo-008",

    slug: "disability-assistance-demo",

    title: "Disability Assistance Programme – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "central",

    state: "All India",

    categories: ["disability", "social-welfare"],

    beneficiaryGroups: ["persons-with-disabilities"],

    description:
      "An illustrative listing demonstrating how disability-related government assistance can be discovered.",

    objective:
      "Demonstrate the organisation of disability-related support information.",

    benefits: [
      "Illustrative assistance information.",
      "Accessibility-related resources.",
      "Social welfare information."
    ],

    eligibilityCriteria: [
      "Applicable disability-related conditions must be verified.",
      "Official certification requirements may apply.",
      "Additional eligibility rules depend on the programme."
    ],

    requiredDocuments: [],

    applicationSteps: [
      "Identify the relevant official programme.",
      "Review the prescribed eligibility and documentation conditions.",
      "Follow the authorised application procedure."
    ],

    applicationStatus: "not-verified",

    applicationStartDate: null,

    deadline: null,

    benefitAmount: null,

    officialPortalName: "myScheme",

    sourceUrl: "https://www.myscheme.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  },


  // 9. Education

  {
    id: "scheme-demo-009",

    slug: "education-support-programme-demo",

    title: "Education Support Programme – Demo",

    provider: "Demonstration Record",

    providerType: "Example",

    scope: "state",

    state: "Maharashtra",

    categories: ["education"],

    beneficiaryGroups: ["students"],

    description:
      "An illustrative education-support listing demonstrating how student-focused government assistance can be displayed separately from scholarships.",

    objective:
      "Demonstrate the discovery of general education assistance.",

    benefits: [
      "Illustrative education assistance information.",
      "Student welfare resources.",
      "Access to relevant government information."
    ],

    eligibilityCriteria: [
      "Education-level conditions depend on the actual scheme.",
      "Income requirements may apply.",
      "Institution-related conditions may apply."
    ],

    requiredDocuments: [],

    applicationSteps: [
      "Identify the applicable education programme.",
      "Check the official eligibility requirements.",
      "Follow the prescribed government application process."
    ],

    applicationStatus: "not-verified",

    applicationStartDate: null,

    deadline: null,

    benefitAmount: null,

    officialPortalName: "MahaDBT",

    sourceUrl: "https://mahadbt.maharashtra.gov.in/",

    lastVerifiedAt: null,

    isDemo: true
  }

];


export function getSchemeBySlug(slug: string) {

  return governmentSchemes.find(
    (scheme) => scheme.slug === slug
  );

}