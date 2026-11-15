import type { Metadata } from "next";

import ScholarshipDirectory from "@/components/scholarships/scholarship-directory";

export const metadata: Metadata = {

  title: "Find Scholarships",

  description:
    "Explore scholarship opportunities, compare eligibility requirements and discover official scholarship resources through BenefitX."

};

export default function ScholarshipsPage() {

  return <ScholarshipDirectory />;

}