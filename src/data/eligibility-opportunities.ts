import type {
  EligibilityOpportunity
} from "@/types/eligibility";


/*
  IMPORTANT

  All records below are synthetic test records.

  They are NOT actual government scholarships or schemes.

  Their criteria are deliberately illustrative.

  They exist only to test the eligibility engine.

  Replace these records with structured, officially
  verified scholarship and scheme data before launch.
*/


export const eligibilityOpportunities: EligibilityOpportunity[] = [

  // 1. Undergraduate Student Support

  {
    id: "elig-demo-001",

    slug: "undergraduate-student-support",

    title: "Undergraduate Student Support – Demo",

    kind: "scholarship",

    provider: "Illustrative Education Provider",

    description:
      "Test record for matching undergraduate and postgraduate students against education, beneficiary and income conditions.",

    officialPortalName: "National Scholarship Portal",

    sourceUrl: "https://scholarships.gov.in/",

    criteria: {

      educationLevels: [
        "undergraduate",
        "postgraduate"
      ],

      beneficiaryGroups: [
        "students"
      ],

      maxAnnualFamilyIncome: 500000

    },

    isDemo: true

  },


  // 2. Maharashtra School Support

  {
    id: "elig-demo-002",

    slug: "maharashtra-school-support",

    title: "Maharashtra School Support – Demo",

    kind: "scholarship",

    provider: "Illustrative State Education Provider",

    description:
      "Test record for checking school-level opportunities restricted to Maharashtra in this illustrative dataset.",

    officialPortalName: "MahaDBT",

    sourceUrl: "https://mahadbt.maharashtra.gov.in/",

    criteria: {

      states: [
        "Maharashtra"
      ],

      educationLevels: [
        "school",
        "higher-secondary"
      ],

      beneficiaryGroups: [
        "students"
      ],

      maxAnnualFamilyIncome: 250000

    },

    isDemo: true

  },


  // 3. Farmer Support

  {
    id: "elig-demo-003",

    slug: "farmer-welfare-support",

    title: "Farmer Welfare Support – Demo",

    kind: "scheme",

    provider: "Illustrative Agricultural Provider",

    description:
      "Test record demonstrating beneficiary matching for farmer-focused government assistance.",

    officialPortalName: "myScheme",

    sourceUrl: "https://www.myscheme.gov.in/",

    criteria: {

      beneficiaryGroups: [
        "farmers"
      ],

      minAge: 18

    },

    isDemo: true

  },


  // 4. Women Support

  {
    id: "elig-demo-004",

    slug: "women-support-programme",

    title: "Women Support Programme – Demo",

    kind: "scheme",

    provider: "Illustrative Welfare Provider",

    description:
      "Test record demonstrating how age, state, beneficiary and income conditions can be evaluated.",

    officialPortalName: "myScheme",

    sourceUrl: "https://www.myscheme.gov.in/",

    criteria: {

      states: [
        "Maharashtra"
      ],

      beneficiaryGroups: [
        "women"
      ],

      minAge: 18,

      maxAnnualFamilyIncome: 600000

    },

    isDemo: true

  },


  // 5. Entrepreneur Support

  {
    id: "elig-demo-005",

    slug: "entrepreneur-development-support",

    title: "Entrepreneur Development Support – Demo",

    kind: "scheme",

    provider: "Illustrative Business Support Provider",

    description:
      "Test record for matching entrepreneurs with illustrative business development conditions.",

    officialPortalName: "myScheme",

    sourceUrl: "https://www.myscheme.gov.in/",

    criteria: {

      beneficiaryGroups: [
        "entrepreneurs"
      ],

      minAge: 18

    },

    isDemo: true

  },


  // 6. Senior Citizen Support

  {
    id: "elig-demo-006",

    slug: "senior-citizen-support",

    title: "Senior Citizen Welfare Support – Demo",

    kind: "scheme",

    provider: "Illustrative Welfare Provider",

    description:
      "Test record for checking age-based beneficiary matching.",

    officialPortalName: "myScheme",

    sourceUrl: "https://www.myscheme.gov.in/",

    criteria: {

      beneficiaryGroups: [
        "senior-citizens"
      ],

      minAge: 60

    },

    isDemo: true

  }

];