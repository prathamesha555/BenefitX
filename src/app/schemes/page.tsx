import type { Metadata } from "next";

import SchemeDirectory from "@/components/schemes/scheme-directory";

export const metadata: Metadata = {

  title: "Government Schemes & Benefits",

  description:
    "Explore government welfare schemes, agriculture assistance, healthcare programmes and other citizen benefits through BenefitX."

};

export default function SchemesPage() {

  return <SchemeDirectory />;

}