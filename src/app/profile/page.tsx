import type { Metadata } from "next";

import ProfilePage from "@/components/auth/profile-page";


export const metadata: Metadata = {

  title: "My Profile | BenefitX",

  description:
    "View and manage your personal BenefitX account information."

};


export default function MyProfilePage() {

  return <ProfilePage />;

}