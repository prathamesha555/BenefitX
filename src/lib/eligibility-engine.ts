import type {

  EligibilityProfile,

  EligibilityOpportunity,

  EligibilityMatch,

  CriterionResult

} from "@/types/eligibility";


/*
  BENEFITX ELIGIBILITY ENGINE

  This engine performs rule-based comparisons.

  It does not guarantee government approval.

  All current opportunities are demonstration records.
*/


export function evaluateOpportunity(

  opportunity: EligibilityOpportunity,

  profile: EligibilityProfile

): EligibilityMatch {


  const checks: CriterionResult[] = [];

  const criteria = opportunity.criteria;


  // ======================================
  // 1. STATE CHECK
  // ======================================

  if (
    criteria.states &&
    criteria.states.length > 0
  ) {

    if (!profile.state) {

      checks.push({

        label: "State",

        status: "unknown",

        message: "State information is missing."

      });

    } else if (
      criteria.states.includes(profile.state)
    ) {

      checks.push({

        label: "State",

        status: "match",

        message: "Your state matches the defined requirement."

      });

    } else {

      checks.push({

        label: "State",

        status: "not-match",

        message: `This opportunity is restricted to ${criteria.states.join(", ")}.`

      });

    }

  }


  // ======================================
  // 2. EDUCATION CHECK
  // ======================================

  if (
    criteria.educationLevels &&
    criteria.educationLevels.length > 0
  ) {

    if (
      !profile.educationLevel ||
      profile.educationLevel === "not-applicable"
    ) {

      checks.push({

        label: "Education",

        status: "unknown",

        message: "Your education level is needed."

      });

    } else if (
      criteria.educationLevels.includes(
        profile.educationLevel
      )
    ) {

      checks.push({

        label: "Education",

        status: "match",

        message: "Your education level matches."

      });

    } else {

      checks.push({

        label: "Education",

        status: "not-match",

        message: "Your education level does not match."

      });

    }

  }


  // ======================================
  // 3. BENEFICIARY CHECK
  // ======================================

  if (
    criteria.beneficiaryGroups &&
    criteria.beneficiaryGroups.length > 0
  ) {

    if (!profile.beneficiaryGroup) {

      checks.push({

        label: "Beneficiary Group",

        status: "unknown",

        message: "Your beneficiary group is required."

      });

    } else if (
      criteria.beneficiaryGroups.includes(
        profile.beneficiaryGroup
      )
    ) {

      checks.push({

        label: "Beneficiary Group",

        status: "match",

        message: "Your selected beneficiary group matches."

      });

    } else {

      checks.push({

        label: "Beneficiary Group",

        status: "not-match",

        message: "Your selected beneficiary group does not match."

      });

    }

  }


  // ======================================
  // 4. AGE CHECK
  // ======================================

  if (
    criteria.minAge !== undefined ||
    criteria.maxAge !== undefined
  ) {

    if (profile.age === null) {

      checks.push({

        label: "Age",

        status: "unknown",

        message: "Age information is required for this condition."

      });

    } else {

      const passesMin =
        criteria.minAge === undefined ||
        profile.age >= criteria.minAge;

      const passesMax =
        criteria.maxAge === undefined ||
        profile.age <= criteria.maxAge;

      if (passesMin && passesMax) {

        checks.push({

          label: "Age",

          status: "match",

          message: "Your age matches the defined range."

        });

      } else {

        checks.push({

          label: "Age",

          status: "not-match",

          message: "Your age does not satisfy the defined age condition."

        });

      }

    }

  }


  // ======================================
  // 5. ANNUAL FAMILY INCOME CHECK
  // ======================================

  if (
    criteria.maxAnnualFamilyIncome !== undefined
  ) {

    const range = profile.annualIncomeRange;

    const maximum = criteria.maxAnnualFamilyIncome;

    if (!range) {

      checks.push({

        label: "Annual Family Income",

        status: "unknown",

        message: "Income information is needed."

      });

    } else if (
      range.max !== null &&
      range.max <= maximum
    ) {

      checks.push({

        label: "Annual Family Income",

        status: "match",

        message: "Your selected income range is within the illustrative limit."

      });

    } else if (
      range.min > maximum
    ) {

      checks.push({

        label: "Annual Family Income",

        status: "not-match",

        message: "Your selected income range exceeds the illustrative limit."

      });

    } else {

      checks.push({

        label: "Annual Family Income",

        status: "unknown",

        message: "Your income range overlaps the illustrative limit. Exact verification is required."

      });

    }

  }


  // ======================================
  // 6. RESULT CLASSIFICATION
  // ======================================

  const hasFailure = checks.some(
    (check) => check.status === "not-match"
  );

  const hasUnknown = checks.some(
    (check) => check.status === "unknown"
  );


  let status: EligibilityMatch["status"];


  if (hasFailure) {

    status = "not-match";

  } else if (hasUnknown || checks.length === 0) {

    status = "needs-info";

  } else {

    status = "potential-match";

  }


  return {

    opportunity,

    status,

    checks

  };

}


/* =========================================
   EVALUATE ALL OPPORTUNITIES
========================================= */

export function evaluateEligibility(

  opportunities: EligibilityOpportunity[],

  profile: EligibilityProfile

): EligibilityMatch[] {

  return opportunities.map((opportunity) =>
    evaluateOpportunity(opportunity, profile)
  );

}