import type { Metadata } from "next";

export const instant = false;

import { redirect } from "next/navigation";

import AdminDashboard from "@/components/admin/admin-dashboard";

import { getAdminSession } from "@/lib/admin-session";

import { getAdminStats } from "@/lib/admin-data";


export const metadata: Metadata = {

  title: "Admin Dashboard | BenefitX",

  description:
    "Secure BenefitX administration dashboard."

};



export default async function AdminPage() {


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