import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import SchemeManagement from "@/components/admin/scheme-management";
import { getAdminSession } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Government Scheme Management | BenefitX Admin",
  description: "Create, edit, review and manage BenefitX government scheme records.",
  robots: { index: false, follow: false },
};

function SchemeManagementLoading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#F4F6F2] px-6">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#075B46] border-t-transparent" />
        <p className="text-sm font-medium text-[#59665F]">Loading Government Scheme Management...</p>
      </div>
    </main>
  );
}

async function SchemeManagementContent() {
  await connection();
  const session = await getAdminSession();
  if (!session) redirect("/login?next=/admin/schemes");

  return <SchemeManagement adminEmail={session.email ?? "Administrator"} />;
}

export default function AdminSchemesPage() {
  return (
    <Suspense fallback={<SchemeManagementLoading />}>
      <SchemeManagementContent />
    </Suspense>
  );
}
