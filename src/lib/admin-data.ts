import "server-only";

import { adminDb } from "@/lib/firebase-admin";


export interface AdminStats {

  scholarships: number;

  schemes: number;

  users: number;

  pendingVerification: number;

}


export async function getAdminStats(): Promise<AdminStats> {


  const [

    scholarshipsSnapshot,

    schemesSnapshot,

    usersSnapshot

  ] = await Promise.all([

    adminDb.collection("scholarships").get(),

    adminDb.collection("schemes").get(),

    adminDb.collection("users").get()

  ]);


  const allOpportunities = [

    ...scholarshipsSnapshot.docs,

    ...schemesSnapshot.docs

  ];


  const pendingVerification =
    allOpportunities.filter((document) => {

      const data = document.data();

      return (

        data.verification?.status === "pending" ||

        data.verificationStatus === "pending"

      );

    }).length;


  return {

    scholarships: scholarshipsSnapshot.size,

    schemes: schemesSnapshot.size,

    users: usersSnapshot.size,

    pendingVerification

  };

}