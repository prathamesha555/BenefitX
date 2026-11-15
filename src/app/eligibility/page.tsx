import type { Metadata } from "next";

import EligibilityChecker from "@/components/eligibility/eligibility-checker";


export const metadata: Metadata = {

  title: "Smart Eligibility Checker",

  description:
    "Explore potentially matching scholarships and government schemes using BenefitX's guided eligibility checker."

};


export default function EligibilityPage() {

  return <EligibilityChecker />;

}