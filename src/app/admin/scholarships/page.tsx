import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import ScholarshipManagement from "@/components/admin/scholarship-management";
import { getAdminSession } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Scholarship Management | BenefitX Admin",
  description:
    "Create, edit, review and manage BenefitX scholarship records.",
  robots: {
    index: false,
    follow: false,
  },
};

function ScholarshipLoading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#F4F6F2] px-6">
      <p className="text-sm font-medium text-[#59665F]">
        Loading Scholarship Management...
      </p>
    </main>
  );
}

async function ScholarshipManagementContent() {
  // Session verification uses Firebase Admin's current-time checks.
  // Make this request-dependent before Firebase Admin runs.
  await connection();

  const session = await getAdminSession();

  if (!session) {
    redirect("/login?next=/admin/scholarships");
  }

  return (
    <ScholarshipManagement
      adminEmail={session.email ?? "Administrator"}
    />
  );
}

export default function AdminScholarshipsPage() {
  return (
    <Suspense fallback={<ScholarshipLoading />}>
      <ScholarshipManagementContent />
    </Suspense>
  );
}
