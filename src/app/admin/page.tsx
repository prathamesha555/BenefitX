import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import AdminDashboard from "@/components/admin/admin-dashboard";
import { getAdminSession } from "@/lib/admin-session";
import { getAdminStats } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Admin Dashboard | BenefitX",
  description: "Secure BenefitX administration dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

function AdminLoading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#F4F6F2] px-6">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#075B46] border-t-transparent" />
        <p className="text-sm font-medium text-[#59665F]">
          Loading BenefitX Admin Dashboard...
        </p>
      </div>
    </main>
  );
}

async function AdminDashboardContent() {
  // Firebase Admin verifies session cookies using the current time.
  // Enter request-time rendering before calling it so Next.js does not
  // attempt to evaluate that code while prerendering this page.
  await connection();

  const session = await getAdminSession();

  if (!session) {
    redirect("/login?next=/admin");
  }

  const stats = await getAdminStats();

  return (
    <AdminDashboard
      stats={stats}
      adminEmail={session.email ?? "Administrator"}
    />
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
