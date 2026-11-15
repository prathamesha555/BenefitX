/**
 * Validate the optional age entered in the eligibility checker.
 * An omitted age is allowed; a supplied age must be a whole number
 * between 1 and 120 inclusive.
 */
export function getAgeValidationError(age: number | null): string {
  if (age === null) {
    return "";
  }

  if (!Number.isFinite(age)) {
    return "Enter a valid age using numbers only.";
  }

  if (!Number.isInteger(age)) {
    return "Enter your age as a whole number.";
  }

  if (age < 1 || age > 120) {
    return "Enter an age between 1 and 120, or leave the field blank.";
  }

  return "";
}
