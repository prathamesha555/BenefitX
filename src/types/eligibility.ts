import type { EducationLevel } from "@/types/scholarship";

import type { BeneficiaryGroup } from "@/types/scheme";


export type OpportunityKind =
  | "scholarship"
  | "scheme";


export type OpportunitySelection =
  | "all"
  | "scholarship"
  | "scheme";


export interface IncomeRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}


export interface EligibilityProfile {

  state: string;

  age: number | null;

  educationLevel:
    | EducationLevel
    | "not-applicable"
    | null;

  beneficiaryGroup: BeneficiaryGroup | null;

  opportunityType: OpportunitySelection;

  annualIncomeRange: IncomeRange | null;

}


export interface EligibilityCriteria {

  states?: string[];

  educationLevels?: EducationLevel[];

  beneficiaryGroups?: BeneficiaryGroup[];

  minAge?: number;

  maxAge?: number;

  maxAnnualFamilyIncome?: number;

}


export interface EligibilityOpportunity {

  id: string;

  slug: string;

  title: string;

  kind: OpportunityKind;

  provider: string;

  description: string;

  officialPortalName: string;

  sourceUrl: string;

  criteria: EligibilityCriteria;

  isDemo: boolean;

}


export type CriterionStatus =
  | "match"
  | "not-match"
  | "unknown";


export interface CriterionResult {

  label: string;

  status: CriterionStatus;

  message: string;

}


export type EligibilityResultStatus =
  | "potential-match"
  | "needs-info"
  | "not-match";


export interface EligibilityMatch {

  opportunity: EligibilityOpportunity;

  status: EligibilityResultStatus;

  checks: CriterionResult[];

}