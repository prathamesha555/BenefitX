import type { Metadata } from "next";

import UserDashboard from "@/components/auth/user-dashboard";


export const metadata: Metadata = {

  title: "My Dashboard | BenefitX",

  robots: {
    index: false,
    follow: false,
  }

};


export default function DashboardPage() {

  return <UserDashboard />;

}