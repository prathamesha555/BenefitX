import "server-only";

import { cookies } from "next/headers";

import {
  adminAuth
} from "@/lib/firebase-admin";


export async function getAdminSession() {

  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get(
    "benefitx_session"
  )?.value;


  if (!sessionCookie) {

    return null;

  }


  try {

    const decodedClaims =
      await adminAuth.verifySessionCookie(
        sessionCookie,
        true
      );


    if (
      decodedClaims.admin !== true ||
      decodedClaims.role !== "super_admin"
    ) {

      return null;

    }


    return decodedClaims;


  } catch {

    return null;

  }

}